import numpy as np
import flask

from static.src.routes import utils

###################################################################################################

bp = flask.Blueprint('distance', __name__)

###################################################################################################

@bp.route('/Distance', methods=['POST'])
def distance():
    
    distances = utils.process_cosmo_module()['Distances']

    data = flask.request.json
    cosmos, names = utils.createCosmos(data['models'])
    domain = data['tab']['inputs']['Redshift domain']
    log_plot = data['tab']['inputs']['Log scale']

    x = utils.generateDomain(domain, log_plot)
    plots = []

    for key in distances:
        y = []
        x_copy = np.array(x)
        for cosmo in cosmos:
            if (key == 'Comoving distance'):
                line = getattr(cosmo, distances[key]['function'])(np.zeros_like(x_copy), x_copy)
            else:
                line = getattr(cosmo, distances[key]['function'])(x_copy)
            if (distances[key]['unit'] == "Mpc"):
                line /= cosmo.h

            # TODO
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
        utils.logify(plots[:-1])
        utils.logify([plots[-1]], x_axis = True, y_axis = False)
    utils.prepareJSON(plots)
    
    return flask.jsonify(plots)

###################################################################################################
