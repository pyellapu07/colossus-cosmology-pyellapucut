import numpy as np
import os
import json
import re
import math
import flask

from colossus.cosmology import cosmology

###################################################################################################

def_n_bins = 1000
n_bins_time = 500

def_log_zero = 1E-20

cosmo_module = None

power_spectrum_models = {
    'Sugiyama 1995': 'sugiyama95',
    'Eisenstein & Hu 1998': 'eisenstein98',
    'Eisenstein & Hu 1998 (no BAO)': 'eisenstein98_zb',
    'CAMB': 'camb',
}

###################################################################################################

def sigfig(x, sig = 4):
    
    if (x == 0):
        return 0
    
    return round(x, sig - int(math.floor(math.log10(abs(x)))) - 1)

###################################################################################################

def createCosmos(models):
    
    cosmos = []
    names = []
    for model in models:
        cosmo = cosmology.Cosmology(**model)
        cosmos.append(cosmo)
        names.append(model['name'])
    
    return [cosmos, names]

###################################################################################################

def logify(plots, x_axis = True, y_axis = True):
    
    for plot in plots:
        if x_axis:
            if (isinstance(plot['x'][0], list)):
                raise Exception('X axis should be only one list')
            plot['x'][plot['x'] <= 0.0] = def_log_zero
            plot['x'] = np.log10(plot['x'])
            plot['xTitle'] = 'log<sub>10</sub> ' + plot['xTitle']
        if y_axis:
            for i in range(len(plot['y'])):
                plot['y'][i][plot['y'][i] <= 0.0] = def_log_zero
                plot['y'][i] = np.log10(plot['y'][i])
            plot['yTitle'] = 'log<sub>10</sub> ' + plot['yTitle']
    
    return

###################################################################################################

# JSON cannot handle numpy arrays, so we need to convert all of those to lists

def prepareJSON(plots):
    
    for plot in plots:
        plot['x'] = list(plot['x'])
        for i in range(len(plot['y'])):
            plot['y'][i] = list(plot['y'][i])
        
    return

###################################################################################################

def generateDomain(domain, log_plot = False, bins = def_n_bins):
    
    if domain[0] is None:
        raise Exception('Lower limit must be set.')
    if domain[1] is None:
        raise Exception('Upper limit must be set.')
    
    if (log_plot):
        if domain[0] <= 0.0:
            domain[0] = def_log_zero
        return np.logspace(np.log10(domain[0]), np.log10(domain[1]), bins)
    
    else:
        return np.linspace(domain[0], domain[1], bins)

###################################################################################################

def process_cosmo_module():
    
    global cosmo_module
    
    if (cosmo_module == None):
        filename = os.path.join(flask.current_app.static_folder, 'src/config', 'cosmoModule.js')

        with open(filename, 'r+', encoding="utf-8") as dataFile:
            data = dataFile.read()
            json_data = data[data.find('{'): data.rfind('}')+1]
            json_data = json_data.replace("\'", "\"")
            json_data = re.sub(r'([{\s,])(\w+):', r'\1"\2":', json_data)
            json_data = re.sub(r',\s*}', '}', json_data)
            json_data = re.sub(r',\s*]', ']', json_data)
            cosmo_module = json.loads(json_data)
    
    return cosmo_module

###################################################################################################

# Create data points along an axis that can be z, a, or t. We generate data points in the domain
# that is being plotted and convert them back into a redshift that will be fed to the respective
# Colossus functions.

def createTimeAxis(cosmos, function, domain, log_plot):

    if (log_plot and function == 'Redshift (z)'):
        domain[0] += 1.0
        domain[1] += 1.0
        function = '(z + 1)'
    
    x_plot = generateDomain(domain, log_plot, bins = n_bins_time)

    # For time and scale factor we need to limit the arrays because there are values that cannot
    # be converted to redshift without errors.
    if function == 'Time (t)':
        x_plot = x_plot[(x_plot >= 0.002) & (x_plot <= 100.0)]
    elif (function == 'Scale factor (a)'):
        x_plot = x_plot[x_plot > 0.0]

    # Prepare array of redshifts for evaluation; this may depend on cosmology. We also need to 
    # create a mask of valid x-bins, which may be influenced differently by different 
    # cosmologies.
    z_eval = []
    mask = np.ones_like(x_plot, bool)
    for i, cosmo in enumerate(cosmos):
        
        if function == 'Redshift (z)':
            z_eval.append(x_plot)
    
        elif function == '(z + 1)':
            z_eval.append(x_plot - 1.0)
            
        elif function == 'Time (t)':
            z_eval.append(cosmo.age(x_plot, inverse = True))
            
        elif (function == 'Scale factor (a)'):
            z_eval.append(1.0 / x_plot - 1.0)
        
        else:
            raise Exception('Unknown function, %s.' % function)
    
        mask &= (z_eval[i] > cosmo.z_min) & (z_eval[i] < cosmo.z_max)

    # Now limit arrays for all cosmologies
    x_plot = x_plot[mask]
    for i in range(len(cosmos)):
        z_eval[i] = z_eval[i][mask]
    
    return x_plot, z_eval, function

###################################################################################################
