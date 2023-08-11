import os
import json
import re
from flask import current_app
from math import log10, floor
from colossus.cosmology import cosmology
from numpy import logspace, linspace

cosmo_module = None

power_spectrum_models = {
    'Sugiyama 1995': 'sugiyama95',
    'Eisenstein & Hu 1998': 'eisenstein98',
    'Eisenstein & Hu 1998 (no BAO)': 'eisenstein98_zb',
    'CAMB': 'camb',
}

def sigfig(x, sig=4):
    if (x == 0):
        return 0
    return round(x, sig-int(floor(log10(abs(x))))-1)

def createCosmos(models):
    cosmos = []
    names = []
    for model in models:
        cosmo = cosmology.Cosmology(**model)
        cosmos.append(cosmo)
        names.append(model['name'])
    return [cosmos, names]

def logify(plots, xAxis=True, yAxis=True):
    for plot in plots:
        if xAxis:
            if (isinstance(plot['x'][0], list)):
                plot['x'] = [[log10(i) if i > 0 else None for i in j] for j in plot['x']]
            else:
                plot['x'] = [log10(i) if i > 0 else None for i in plot['x']]
            plot['xTitle'] = 'log<sub>10</sub> ' + plot['xTitle']
        if yAxis:
            plot['y'] = [[log10(i) if i > 0 else None for i in j] for j in plot['y']]
            plot['yTitle'] = 'log<sub>10</sub> ' + plot['yTitle']


def generateDomain(domain, log_plot=False, bins=1000):
    if (log_plot):
        # turn 0 into 1e-20 since log10 cant handle 0
        domain[0] = domain[0] if domain[0] > 0 else 1e-20
        return logspace(log10(domain[0]),log10(domain[1]), bins).tolist()
    return linspace(domain[0], domain[1], bins).tolist()

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
