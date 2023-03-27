import json
import os
from flask import Flask, render_template, request, jsonify
from math import log10, floor
from numpy import ndarray, isnan, linspace, array
from colossus.cosmology import cosmology
from colossus.lss import peaks

def sigfig(x, sig=4):
    if (x == 0):
        return 0
    return round(x, sig-int(floor(log10(abs(x))))-1)

'''
(!) responses are returned as an array of tables or plots

table data structure: 
{
    'type': 'table',
    'csv': [ [row 1 values], [row 2 values], [row 3 values]]
}

plot data structure:
{
    'type': 'plot',
    'x': [],
    'y': [[line1], [line2], [line3]]
}

'''

def logify( plots, xAxis=True, yAxis=True ):
    for plot in plots:
        if (xAxis):
            plot['x'] = [log10(i) for i in plot['x'] if i > 0]
            plot['xTitle'] = 'log<sub>10</sub> ' + plot['xTitle']
        if (yAxis):
            plot['y'] = [[log10(i) for i in j if i > 0] for j in plot['y']]
            plot['yTitle'] = 'log<sub>10</sub> ' + plot['yTitle']

def createCosmos( models ):
    cosmos = []
    names = []
    for model in models:
        cosmo = cosmology.Cosmology(**model)
        cosmos.append(cosmo)
        names.append(model['name'])
    return [cosmos, names]

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

filename = os.path.join(app.static_folder, 'src/config', 'cosmoModule.js')

with open(filename, 'r+', encoding="utf-8") as dataFile:
    data = dataFile.read()
    json_data = data[data.find('{') : data.rfind('}')+1]
    cosmoModule = json.loads(json_data)

@app.route('/Basic', methods=['POST'])
def basic():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    redshift = data['tab']['inputs']['Redshift (z)']

    csv = []
    table = {
        'type': 'table',
        'csv': csv
    }
    names.insert(0, '')
    csv.append(names)

    for sectionName in cosmoModule:
        sectionHeader = [sectionName]
        csv.append(sectionHeader)

        section = cosmoModule[sectionName]

        for key in section:
            row = [key]
            prop = section[key]

            for cosmo in cosmos:
                result = "---"

                if (prop["future"] or redshift >= 0):
                    result = getattr(cosmo, prop["function"])(redshift)

                    if isnan(result):
                        result = "---"
                    else:
                        if type(result) is ndarray:
                            result = result.tolist()
                        if result in [float("-inf"),float("inf")]:
                            result = str(result)
                        elif result < 0 and prop["function"] == "distanceModulus":
                            result = "---"
                        else:
                            result = sigfig(result)
                            if (result != 0 and (result > 100 or result < 0.01)):
                                result = "{:0.3e}".format(result)

                row.append(result)

            csv.append(row)

    return jsonify([table])

timePlots = [
{
    'title': 'Age of the Universe',
    'yTitle': 'Age (Gigayears)',
},
{
    'title': 'Hubble expansion rate',
    'yTitle': 'Hubble parameter (H)',
}]

@app.route('/Time', methods=['POST'])
def time():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    function = data['tab']['inputs']['Plot as function of']
    domain = data['tab']['inputs']['Domain']
    log_plot = data['tab']['inputs']['Log scale']

    num = 200
    x = linspace(domain[0],domain[1],num).tolist()
    if (function == 'Time (t)'):
        x = [a for a in x if a > 0 and a <= 120.869]
    elif (function == 'Scale factor (a)'):
        x = [a for a in x if a > 0]

    plots = []
    for plotTemp in timePlots:
        plot = plotTemp.copy()
        plot.update({
            'type': 'plot',
            'x': x,
            'y': [],
            'xTitle': function,
            'names': names
        })
        plots.append(plot)

    for cosmo in cosmos:
        x_copy = x.copy()

        if (function == 'Time (t)'):
            for j in range(len(x_copy)):
                x_copy[j] = cosmo.age(x[j], inverse = True)
        elif (function == 'Scale factor (a)'):
            for j in range(len(x_copy)):
                x_copy[j] = 1 / x[j] - 1

        line = cosmo.Hz(array(x_copy)).tolist()
        plots[1]['y'].append(line)

        if (function == 'Redshift (z)' or function == 'Scale factor (a)' ):
            line = cosmo.age(array(x_copy)).tolist()
        elif (function == 'Time (t)'):
            line = x_copy
            plots[0]['yTitle'] = 'Redshift (z)'
        plots[0]['y'].append(line)

    if (log_plot):
        logify(plots)

    return jsonify(plots)

distances = cosmoModule['Distances']

@app.route('/Distance', methods=['POST'])
def distance():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    domain = data['tab']['inputs']['Redshift domain']
    log_plot = data['tab']['inputs']['Log scale']

    num = 200
    x = linspace(domain[0],domain[1],num).tolist()
    np_x = array(x)
    plots = []

    for key in distances:
        y = []
        x_copy = x.copy()
        for i, cosmo in enumerate(cosmos):
            line = getattr(cosmo, distances[key]['function'])(np_x).tolist()

            for j, value in enumerate(line):
                if isnan(value):
                    del line[j]
                    del x_copy[j]

            y.append(line)
        plot = {
            'type': 'plot',
            'x': x_copy,
            'y': y,
            'title': key,
            'xTitle': 'Redshift (z)',
            'yTitle': 'Distance ' + ('(' + distances[key]['unit'] + ')' if distances[key]['unit'] != '' else ''),
            'names': names
        }
        plots.append(plot)

    if (log_plot):
        logify(plots)

    return jsonify(plots)

@app.route('/Content', methods=['POST'])
def content():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    function = data['tab']['inputs']['Plot as function of']
    domain = data['tab']['inputs']['Domain']
    contents = cosmoModule["Contents of the Universe"]
    contentKeys = list(contents.keys())
    combined = data['tab']['inputs']['Compare densities']
    log_plot = data['tab']['inputs']['Log scale']

    num = 200
    x = linspace(domain[0],domain[1],num).tolist()
    if (function == 'Time (t)'):
        x = [a for a in x if a > 0 and a <= 120.869]
    elif (function == 'Scale factor (a)'):
        x = [a for a in x if a > 0]

    plots = []

    if (combined):
        rho_names = contentKeys[:7]
        omega_names = contentKeys[7:]
        for i, cosmo in enumerate(cosmos):
            rho_plot = {
                'type': 'plot',
                'x': x,
                'y': [],
                'title': 'Densities (' + names[i] + ' cosmology)',
                'xTitle': function,
                'yTitle': 'Density (M<sub>⊙</sub>h<sup>2</sup>/kpc<sup>3</sup>)',
                'names': rho_names
            }
            omega_plot = {
                'type': 'plot',
                'x': x,
                'y': [],
                'title': 'Fractional densities (' + names[i] + ' cosmology)',
                'xTitle': function,
                'yTitle': 'Fractional density',
                'names': omega_names
            }

            x_copy = x.copy()

            if (function == 'Time (t)'):
                for j in range(len(x_copy)):
                    x_copy[j] = cosmo.age(x[j], inverse = True)
            elif (function == 'Scale factor (a)'):
                for j in range(len(x_copy)):
                    x_copy[j] = 1 / x[j] - 1

            for key in rho_names:
                line = getattr(cosmo, contents[key]['function'])(array(x_copy)).tolist()
                rho_plot['y'].append(line)

            for key in omega_names:
                line = getattr(cosmo, contents[key]['function'])(array(x_copy)).tolist()
                omega_plot['y'].append(line)

            plots.append(rho_plot)
            plots.append(omega_plot)
    else:
        for key in contentKeys:
            plot = {
                'type': 'plot',
                'x': x,
                'y': [],
                'title': key,
                'xTitle': function,
                'yTitle': 'Density (' + contents[key]['unit'] + ')' if contents[key]['unit'] != '' else 'Fractional density',
                'names': names
            }
            for i, cosmo in enumerate(cosmos):

                x_copy = x.copy()

                if (function == 'Time (t)'):
                    for j in range(len(x_copy)):
                        x_copy[j] = cosmo.age(x[j], inverse = True)
                elif (function == 'Scale factor (a)'):
                    for j in range(len(x_copy)):
                        x_copy[j] = 1 / x[j] - 1

                line = getattr(cosmo, contents[key]['function'])(array(x_copy)).tolist()
                plot['y'].append(line)

            plots.append(plot)

    if (log_plot):
        logify(plots)

    return jsonify(plots)

power_spectrum_models = {
    'Sugiyama 1995': 'sugiyama95',
    'Eisenstein & Hu 1998': 'eisenstein98',
    'Eisenstein & Hu 1998 (no BAO)': 'eisenstein98_zb',
    'CAMB': 'camb',
}

@app.route('/Power Spectrum', methods=['POST'])
def powerSpectrum():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    model = power_spectrum_models[data['tab']['inputs']['Power spectrum model']]
    wave = data['tab']['inputs']['Wavenumber (k)']
    log_plot = data['tab']['inputs']['Log scale']

    num = 200
    x = linspace(wave[0],wave[1],num).tolist()
    np_x = array(x)
    y = []
    plot = {
        'type': 'plot',
        'x': x,
        'y': y,
        'title': 'Matter power spectrum',
        'xTitle': 'Wavenumber (Mpc/h)^3',
        'yTitle': 'Matter power spectrum (Mpc/h)^3',
        'names': names
    }

    plots = [plot]

    for cosmo in cosmos:
        line = cosmo.matterPowerSpectrum(np_x, model=model).tolist()
        y.append(line)

    if (log_plot):
        logify(plots)

    return jsonify(plots)

correlationPlots = [
{
    'title': 'Correlation function',
    'yTitle': 'Correlation',
    'xTitle': 'Radius (Mpc/h)',
    'function': 'correlationFunction'
},
{
    'title': 'RMS variance',
    'yTitle': 'Variance',
    'xTitle': 'Radius (Mpc/h)',
    'function': 'sigma'
}]

@app.route('/Correlation', methods=['POST'])
def correlation():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    model = power_spectrum_models[data['tab']['inputs']['Correlation model']]
    wave = data['tab']['inputs']['Radius (R)']
    log_plot = data['tab']['inputs']['Log scale']

    num = 200
    x = linspace(wave[0],wave[1],num).tolist()
    np_x = array(x)
    y = []

    plots = []
    for plotTemp in correlationPlots:
        plot = plotTemp.copy()
        plot.update({
            'type': 'plot',
            'x': x,
            'y': [],
            'names': names
        })
        plots.append(plot)

    for plot in plots:
        for cosmo in cosmos:
            line = getattr(cosmo, plot['function'])(np_x, ps_args={'model': model, 'path': None}).tolist()
            if (log_plot):
                line = [abs(number) for number in line]
            plot['y'].append(line)

    for plot in plots:
        del plot['function']

    if (log_plot):
        logify(plots)

    return jsonify(plots)

@app.route('/Peak Height', methods=['POST'])
def peakHeight():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    model = power_spectrum_models[data['tab']['inputs']['Peak height model']]
    halo = data['tab']['inputs']['Halo mass (M)']
    redshift = data['tab']['inputs']['Redshift (z)']
    combined = data['tab']['inputs']['Combine plotting']
    log_plot = data['tab']['inputs']['Log scale']

    num = 200
    x = linspace(halo[0],halo[1],num).tolist()
    np_x = array(x)
    plots = []

    if (combined):
        plots.append({
            'type': 'plot',
            'x': x,
            'y': [],
            'title': 'Peak height',
            'xTitle': 'Halo mass (M<sub>⊙</sub>/h)',
            'yTitle': 'Peak height',
            'names': names
        })

    for i, cosmo in enumerate(cosmos):
        cosmology.setCurrent(cosmo)
        line = peaks.peakHeight(np_x, redshift, ps_args={'model': model, 'path': None}).tolist()
        if (combined):
            plots[0]['y'].append(line)
        else:
            plot = {
                'type': 'plot',
                'x': x,
                'y': [line],
                'title': 'Peak height (' + names[i] + ' cosmology)',
                'xTitle': 'Halo mass (M<sub>⊙</sub>/h)',
                'yTitle': 'Peak height',
                'names': names[i]
            }
            plots.append(plot)

    logify(plots, True, log_plot)

    return jsonify(plots)

if __name__ == '__main__':
    app.run()