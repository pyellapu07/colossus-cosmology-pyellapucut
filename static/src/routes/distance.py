import numpy as np
from flask import Blueprint, request, jsonify

from static.src.routes import utils

###################################################################################################

bp = Blueprint('distance', __name__)

###################################################################################################

@bp.route('/Distance', methods=['POST'])
def distance():
    
    distances = utils.process_cosmo_module()['Distances']

    data = request.json
    cosmos, names = utils.createCosmos(data['models'])
    domain = data['tab']['inputs']['Redshift domain']
    log_plot = data['tab']['inputs']['Log scale']

    np_x = utils.generateDomain(domain, log_plot)
    x = list(np_x)
    plots = []

    for key in distances:
        y = []
        x_copy = x.copy()
        for i, cosmo in enumerate(cosmos):
            if (key == 'Comoving distance'):
                line = getattr(cosmo, distances[key]['function'])(np.zeros(len(np_x)), np_x).tolist()
            else:
                line = getattr(cosmo, distances[key]['function'])(np_x).tolist()

            # remove h units
            if (distances[key]['unit'] == "Mpc"):
                line = [i / cosmo.h for i in line]

            for j, value in enumerate(line):
                if np.isnan(value):
                    del line[j]
                    del x_copy[j]

            y.append(line)
        plot = {
            'type': 'plot',
            'x': x_copy,
            'y': y,
            'title': key,
            'xTitle': 'Redshift (z)',
            'yTitle': 'Distance ' + ('(' + distances[key]['unit'] + ')' if distances[key]['unit'] != '' else 'modulus'),
            'names': names
        }
        plots.append(plot)

    if (log_plot):
        utils.logify(plots[:-1], xAxis=True, yAxis=True)
        utils.logify([plots[-1]], xAxis=True, yAxis=False)

    return jsonify(plots)
