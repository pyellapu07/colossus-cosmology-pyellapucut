from flask import Flask, render_template, request, jsonify
from colossus.cosmology import cosmology
from numpy import ndarray

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

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

basicTable = {
    'Time and expansion': {
        'Age': 'age',
        'Lookback time': 'lookbackTime',
        'Hubble parameter': 'Hz',
        'Linear growth factor': 'growthFactor'
    },
    'Distances': {
        'Comoving distance': 'comovingDistance',
        'Luminosity distance': 'luminosityDistance',
        'Angular diameter distance': 'angularDiameterDistance',
        'Distance modulus': 'distanceModulus',
    },
    'Contents of the Universe': {
        'Critical density': 'rho_c',
        'Matter density': 'rho_m',
        'Baryon density': 'rho_b',
        'Dark energy density': 'rho_de',
        # if relativistic
        'Relativistic density': 'rho_r',
        'Neutrino density': 'rho_nu',
        'Photon density': 'rho_gamma',
        # end
        # Fractional
        'Fractional matter density': 'Om',
        'Fractional baryon density': 'Ob',
        'Fractional dark energy density': 'Ode',
        'Fractional curvature density': 'Ok',
        # if relativistic
        'Fractional relativistic density': 'Or',
        'Fractional neutrinos density': 'Onu',
        'Fractional photon density': 'Ogamma',
        #end
    },
}

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
            function = section[func]

            for cosmo in cosmos:
                result = getattr(cosmo, function)(redshift)
                if type(result) is ndarray:
                    result = result.tolist()

                row.append(result)

            csv.append(row)

    return jsonify([table])

if __name__ == '__main__':
    app.run()
