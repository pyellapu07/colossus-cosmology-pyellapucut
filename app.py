import json
import os
from math import log10, floor
from flask import Flask, render_template, request, jsonify
from colossus.cosmology import cosmology
from numpy import ndarray, isnan, linspace, array

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

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

filename = os.path.join(app.static_folder, 'src/config', 'basicTable.json')

with open(filename, 'r+', encoding="utf-8") as json_data:
    basicTable = json.load(json_data)

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

    for sectionName in basicTable:
        sectionHeader = [sectionName]
        csv.append(sectionHeader)

        section = basicTable[sectionName]

        for func in section:
            row = [func]
            prop = section[func]

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

@app.route('/Time', methods=['POST'])
def time():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    function = data['tab']['inputs']['Function']
    domain = data['tab']['inputs']['Domain']

    num = 50
    x = linspace(domain[0],domain[1],num).tolist()
    if (function == 'Time (t)'):
        x = [a for a in x if a > 0 and a <= 120.869]
    elif (function == 'Scale factor (a)'):
        x = [a for a in x if a > 0]

    converted_x = [x.copy() for i in range(len(cosmos))]

    hy = []
    hz_plot = {
        'type': 'plot',
        'x': x,
        'y': hy,
        'title': 'Hubble Expansion Rate',
        'xTitle': function,
        'yTitle': 'Hubble parameter (H)',
        'names': names
    }

    ay = []

    age_plot = {
        'type': 'plot',
        'x': x,
        'y': ay,
        'title': 'Age of the Universe',
        'xTitle': function,
        'yTitle': 'Age (Gigayears)',
        'names': names
    }

    for i, cosmo in enumerate(cosmos):

        converted_xi = converted_x[i]

        if (function == 'Time (t)'):
            converted_xi = converted_xi
            for j in range(len(converted_xi)):
                converted_xi[j] = cosmo.age(x[j], inverse = True)
        elif (function == 'Scale factor (a)'):
            converted_xi = converted_xi
            for j in range(len(converted_xi)):
                converted_xi[j] = 1 / x[j] - 1

        line = cosmo.Hz(array(converted_xi)).tolist()
        hy.append(line)

        aline = 0

        if (function == 'Redshift (z)'):
            aline = cosmo.age(array(converted_xi)).tolist()
        elif (function == 'Time (t)'):
            aline = converted_xi
            age_plot['yTitle'] = 'Redshift (z)'
        else: # Scale factor (a)
            aline = cosmo.age(array(converted_xi)).tolist()
        ay.append(aline)

    return jsonify([age_plot, hz_plot])

if __name__ == '__main__':
    app.run()