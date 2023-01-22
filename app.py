import json
from math import log10, floor
from flask import Flask, render_template, request, jsonify
from colossus.cosmology import cosmology
from numpy import ndarray, isnan

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
}

'''

with open('static/src/config/basicTable.json') as json_data:
    basicTable = json.load(json_data)

@app.route('/Basic', methods=['POST'])
def basic():
    data = request.json
    models = data['models']
    cosmos = []
    redshift = data['tab']['inputs']['Redshift (z)']

    csv = []
    table = {
        'type': 'table',
        'csv': csv
    }

    header = ['']

    for model in models:
        header.append(model['name'])

        cosmo = cosmology.Cosmology(**model)
        cosmos.append(cosmo)

    csv.append(header)

    for sectionName in basicTable:
        sectionHeader = [sectionName]
        csv.append(sectionHeader)

        section = basicTable[sectionName]

        for func in section:
            row = [func]
            prop = section[func]

            for cosmo in cosmos:
                result = getattr(cosmo, prop["function"])(redshift)

                print(type(result))

                if isnan(result):
                    result = "null"
                else:
                    if type(result) is ndarray:
                        result = result.tolist()
                    print(result)
                    result = round_sig(result,4)

                row.append(result)

            csv.append(row)

    return jsonify([table])

if __name__ == '__main__':
    app.run()
