import json
import os
from flask import Flask, render_template, request, jsonify
from math import log10, floor
from numpy import ndarray, isnan, linspace, array
from colossus.cosmology import cosmology
from colossus.lss import peaks

def round_sig(x, sig=4):
    if x == 0:
        return x
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

filename = os.path.join(app.static_folder, 'src/config', 'cosmoModule.json')

with open(filename, 'r+', encoding="utf-8") as json_data:
    cosmoModule = json.load(json_data)

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
                result = getattr(cosmo, prop["function"])(redshift)

                if isnan(result):
                    result = "null"
                else:
                    if type(result) is ndarray:
                        result = result.tolist()
                    if result in [float("-inf"),float("inf")]:
                        result = str(result)
                    else:
                        result = round_sig(result,4)

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
        x = [log10(i) for i in x if i > 0]
        for plot in plots:
            plot['x'] = x
            plot['y'] = [[log10(i) for i in j if i > 0] for j in plot['y']]
            plot['title'] += ' (log10)'
            plot['xTitle'] = 'Log ' + plot['xTitle']
            plot['yTitle'] = 'Log ' + plot['yTitle']

    return jsonify(plots)

distances = cosmoModule['Distances']

@app.route('/Distance', methods=['POST'])
def distance():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    domain = data['tab']['inputs']['Redshift domain']

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

    return jsonify(plots)

@app.route('/Content', methods=['POST'])
def content():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    function = data['tab']['inputs']['Plot as function of']
    domain = data['tab']['inputs']['Domain']
    contents = cosmoModule["Contents of the Universe"]
    contentKeys = list(contents.keys())
    combined = data['tab']['inputs']['Combined plotting']

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
                'title': 'Densities of ' + names[i],
                'xTitle': function,
                'yTitle': 'Density (M<sub>⊙</sub>h<sup>2</sup>/kpc<sup>3</sup>)',
                'names': rho_names
            }
            omega_plot = {
                'type': 'plot',
                'x': x,
                'y': [],
                'title': 'Fractional densities of ' + names[i],
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

    return jsonify(plots)

@app.route('/Power Spectrum', methods=['POST'])
def powerSpectrum():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    model = data['tab']['inputs']['Model']
    wave = data['tab']['inputs']['Wavenumber (k)']

    num = 200
    x = linspace(wave[0],wave[1],num).tolist()
    np_x = array(x)
    y = []
    plot = {
        'type': 'plot',
        'x': x,
        'y': y,
        'title': 'Matter power spectrum',
        'xTitle': 'Wavenumber (h/Mpc)',
        'yTitle': 'Matter power spectrum',
        'names': names
    }

    plots = [plot]

    for cosmo in cosmos:
        line = cosmo.matterPowerSpectrum(np_x, model=model).tolist()
        y.append(line)

    return jsonify(plots)

correlationPlots = [
{
    'title': 'Correlation function',
    'yTitle': 'Correlation (Mpc/h)',
    'xTitle': 'Radius (Mpc/h)',
    'function': 'correlationFunction'
},
{
    'title': 'RMS variance',
    'yTitle': 'Variance (Mpc/h)',
    'xTitle': 'Radius (Mpc/h)',
    'function': 'sigma'
}]

@app.route('/Correlation', methods=['POST'])
def correlation():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    model = data['tab']['inputs']['Model']
    wave = data['tab']['inputs']['Radius (R)']

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
            line = getattr(cosmo, plot['function'])(np_x).tolist()
            plot['y'].append(line)

    for plot in plots:
        del plot['function']
    return jsonify(plots)

@app.route('/Peak Height', methods=['POST'])
def peakHeight():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    model = data['tab']['inputs']['Model']
    halo = data['tab']['inputs']['Halo mass (M)']
    redshift = data['tab']['inputs']['Redshift (z)']
    combined = data['tab']['inputs']['Combined plotting']

    num = 200
    x = linspace(halo[0],halo[1],num).tolist()
    np_x = array(x)
    y = []
    plot = {
        'type': 'plot',
        'x': x,
        'y': y,
        'title': 'Peak height',
        'xTitle': 'Halo mass (M<sub>⊙</sub>/h)',
        'yTitle': 'Peak height (M<sub>⊙</sub>/h)',
        'names': names
    }

    plots = [plot]

    for cosmo in cosmos:
        cosmology.setCurrent(cosmo)
        line = peaks.peakHeight(np_x, redshift).tolist()
        y.append(line)

    return jsonify(plots)

if __name__ == '__main__':
    app.run()