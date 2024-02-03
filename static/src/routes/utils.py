import numpy as np
import os
import json
import re
import math
from flask import current_app

from colossus.cosmology import cosmology

###################################################################################################

def_n_bins = 1000
def_log_zero = 1E-20

cosmo_module = None

power_spectrum_models = {
    'Sugiyama 1995': 'sugiyama95',
    'Eisenstein & Hu 1998': 'eisenstein98',
    'Eisenstein & Hu 1998 (no BAO)': 'eisenstein98_zb',
    'CAMB': 'camb',
}

###################################################################################################

def sigfig(x, sig=4):
    
    if (x == 0):
        return 0
    
    return round(x, sig-int(math.floor(math.log10(abs(x))))-1)

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

def logify(plots, xAxis=True, yAxis=True):
    
    for plot in plots:
        if xAxis:
            if (isinstance(plot['x'][0], list)):
                plot['x'] = [[math.log10(i) if i > 0 else None for i in j] for j in plot['x']]
            else:
                plot['x'] = [math.log10(i) if i > 0 else None for i in plot['x']]
            plot['xTitle'] = 'log<sub>10</sub> ' + plot['xTitle']
        if yAxis:
            plot['y'] = [[math.log10(i) if i > 0 else None for i in j] for j in plot['y']]
            plot['yTitle'] = 'log<sub>10</sub> ' + plot['yTitle']
    
    return

###################################################################################################

def generateDomain(domain, log_plot=False, bins=def_n_bins):
    
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
        filename = os.path.join(current_app.static_folder, 'src/config', 'cosmoModule.js')

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
    
    x_plot = generateDomain(domain, log_plot)

    # For time and scale factor we need to limit the arrays
    if function == 'Time (t)':
        x_plot = x_plot[(x_plot >= 0.002) & (x_plot <= 120.869)]
    elif (function == 'Scale factor (a)'):
        x_plot = x_plot[(x_plot > 0.0)]

    # Prepare array of redshifts for evaluation; this may depend on cosmology
    z_eval = []
    for i in range(len(cosmos)):
        
        if function == 'Redshift (z)':
            z_eval.append(x_plot)
    
        elif function == '(z + 1)':
            z_eval.append(x_plot - 1.0)
            
        elif function == 'Time (t)':
            z_eval.append(cosmos[i].age(np.array(x_plot), inverse = True))
            
        elif (function == 'Scale factor (a)'):
            z_eval.append(1.0 / x_plot - 1.0)
        
        else:
            raise Exception('Unknown function, %s.' % function)
    
    return x_plot, z_eval
