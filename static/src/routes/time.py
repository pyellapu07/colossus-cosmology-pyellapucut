import numpy as np
from flask import Blueprint, request, jsonify

from .utils import createCosmos, logify, generateDomain

bp = Blueprint('time', __name__)

timePlots = [
{
    'title': 'Age of the Universe',
    'yTitle': 'Age (Gyr)',
},
{
    'title': 'Hubble expansion rate',
    'yTitle': 'Hubble rate (km/s/Mpc)',
}]

@bp.route('/Time', methods=['POST'])
def time():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    function = data['tab']['inputs']['Plot as function of']
    domain = data['tab']['inputs']['Domain']
    log_plot = data['tab']['inputs']['Log scale']
    zPlusOne = log_plot and function == 'Redshift (z)'

    x_eval = generateDomain(domain, log_plot)
    if (function == 'Time (t)'):
        x_eval = [a for a in x_eval if a > 0.002 and a <= 120.869]
    elif (function == 'Scale factor (a)'):
        x_eval = [a for a in x_eval if a > 0]

    if zPlusOne:
        function = "Redshift (z + 1)"
        domain[0] = domain[0] + 1
        domain[1] = domain[1] + 1
        x_plot = [x_ + 1.0 for x_ in x_eval]
    else:
        x_plot = x_eval

    plots = []
    for plotTemp in timePlots:
        plot = plotTemp.copy()
        plot.update({
            'type': 'plot',
            'x': x_plot,
            'y': [],
            'xTitle': function,
            'names': names
        })
        plots.append(plot)

    for cosmo in cosmos:
        redshift = x_eval

        # plot 1

        # converts the domain back to redshift
        if (function == 'Time (t)'):
            redshift = cosmo.age(np.array(x_plot), inverse = True)
        elif (function == 'Scale factor (a)'):
            redshift = [1 / (x_plot[j] + 1) for j in range(len(x_plot))]

        line = cosmo.Hz(np.array(redshift)).tolist()
        plots[1]['y'].append(line)

        # plot 0

        if (function == 'Redshift (z)' or function == 'Scale factor (a)' ):
            line = cosmo.age(np.array(redshift)).tolist()
        elif (function == 'Time (t)'):
            line = [1 / (1 + redshift[j]) for j in range(len(redshift))]
            plots[0]['yTitle'] = 'Scale factor (a)'
        plots[0]['y'].append(line)

    if (log_plot):
        logify(plots)

    return jsonify(plots)
