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

    z_all = utils.generateDomain(domain, log_plot, bins = 500)
    plots = []

    for key in distances:
        y = []
        z = np.array(z_all)
        mask = np.ones_like(z, bool)
        for cosmo in cosmos:
            # This is a bit of a hack to make the code faster. Currently, Colossus' comoving 
            # distance function is slower because it takes both z_min and z_max, whereas the 
            # luminosity distance comes from a lookup table.
            if (key == 'Comoving distance'):
                line = cosmo.luminosityDistance(z) / (1.0 + z)
            else:
                line = getattr(cosmo, distances[key]['function'])(z)
            if (distances[key]['unit'] == "Mpc"):
                line /= cosmo.h
            y.append(line)
            mask &= np.logical_not(np.isnan(line))

        z = z[mask]
        for i in range(len(cosmos)):
            y[i] = y[i][mask]
        
        plot = {
            'type': 'plot',
            'x': z,
            'y': y,
            'title': key,
            'xTitle': 'Redshift (z)',
            'yTitle': 'Distance ' + ('(' + distances[key]['unit'] + ')' if distances[key]['unit'] != '' else 'modulus'),
            'names': names
        }
        plots.append(plot)

    if (log_plot):
        utils.logify(plots[:-1])
        utils.logify([plots[-1]], y_axis = False)
    utils.prepareJSON(plots)
    
    return flask.jsonify(plots)

###################################################################################################
