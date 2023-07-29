from flask import Blueprint, request, jsonify
from numpy import linspace, array
from .utils import createCosmos, logify, process_cosmo_module

bp = Blueprint('density', __name__)

@bp.route('/Density', methods=['POST'])
def density():
    cosmo_module = process_cosmo_module()
    data = request.json
    cosmos, names = createCosmos(data['models'])
    function = data['tab']['inputs']['Plot as function of']['label']
    domain = data['tab']['inputs']['Domain']
    contents = cosmo_module["Contents of the Universe"]
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
