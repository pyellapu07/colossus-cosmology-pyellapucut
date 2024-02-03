import numpy as np
from flask import Blueprint, request, jsonify

from .utils import createCosmos, logify, process_cosmo_module, generateDomain

bp = Blueprint('density', __name__)

@bp.route('/Density', methods=['POST'])
def density():
    cosmo_module = process_cosmo_module()
    data = request.json
    cosmos, names = createCosmos(data['models'])
    function = data['tab']['inputs']['Plot as function of']
    domain = data['tab']['inputs']['Domain']
    contents = cosmo_module["Contents of the Universe"]
    contentKeys = list(contents.keys())
    combined = data['tab']['inputs']['Compare densities']
    log_plot = data['tab']['inputs']['Log scale']
    zPlusOne = (log_plot and function == 'Redshift (z)')

    x_eval = generateDomain(domain, log_plot)
    if (function == 'Time (t)'):
        x_eval = [a for a in x_eval if a > 0.002 and a <= 120.869]
    elif (function == 'Scale factor (a)'):
        x_eval = [a for a in x_eval if a > 0]

    if zPlusOne:
        function = "Redshift (z + 1)"
        domain[0] = domain[0] + 1
        domain[1] = domain[1] + 1
        x_plot = [x + 1.0 for x in x_eval]
    else:
        x_plot = x_eval

    plots = []

    if (combined):
        rho_names = contentKeys[:7]
        omega_names = contentKeys[7:]
        for i, cosmo in enumerate(cosmos):
            rho_plot = {
                'type': 'plot',
                'x': x_plot,
                'y': [],
                'title': 'Densities (' + names[i] + ' cosmology)',
                'xTitle': function,
                'yTitle': 'Density (M<sub>⊙</sub>/kpc<sup>3</sup>)',
                'names': rho_names
            }
            omega_plot = {
                'type': 'plot',
                'x': x_plot,
                'y': [],
                'title': 'Fractional densities (' + names[i] + ' cosmology)',
                'xTitle': function,
                'yTitle': 'Fractional density (Ω<sub>X</sub>)',
                'names': omega_names
            }

            x_copy = x_eval.copy()

            if (function == 'Time (t)'):
                for j in range(len(x_copy)):
                    x_copy[j] = cosmo.age(x_plot[j], inverse = True)
            elif (function == 'Scale factor (a)'):
                for j in range(len(x_copy)):
                    x_copy[j] = 1 / x_plot[j] - 1

            for key in rho_names:
                line = getattr(cosmo, contents[key]['function'])(np.array(x_copy)).tolist()
                # remove h units
                line = [i * cosmo.h**2 for i in line]
                rho_plot['y'].append(line)

            for key in omega_names:
                line = getattr(cosmo, contents[key]['function'])(np.array(x_copy)).tolist()
                omega_plot['y'].append(line)

            plots.append(rho_plot)
            plots.append(omega_plot)
    else:
        for key in contentKeys:
            plot = {
                'type': 'plot',
                'x': x_plot,
                'y': [],
                'title': key,
                'xTitle': function,
                'yTitle': 'Density (' + contents[key]['unit'] + ')' if contents[key]['unit'] != '' else 'Fractional density',
                'names': names
            }
            for i, cosmo in enumerate(cosmos):

                x_copy = x_eval.copy()

                if (function == 'Time (t)'):
                    for j in range(len(x_copy)):
                        x_copy[j] = cosmo.age(x_eval[j], inverse = True)
                elif (function == 'Scale factor (a)'):
                    for j in range(len(x_copy)):
                        x_copy[j] = 1 / x_eval[j] - 1

                line = getattr(cosmo, contents[key]['function'])(np.array(x_copy)).tolist()
                line = [i * cosmo.h**2 for i in line]
                plot['y'].append(line)

            plots.append(plot)

    if (log_plot):
        logify(plots)

    return jsonify(plots)
