import flask

from colossus.cosmology import cosmology
from colossus.lss import peaks

from static.src.routes import utils

###################################################################################################

bp = flask.Blueprint('peak_height', __name__)

###################################################################################################

@bp.route('/Peak Height', methods=['POST'])
def peakHeight():
    
    data = flask.request.json
    cosmos, names = utils.createCosmos(data['models'])
    model = utils.power_spectrum_models[data['tab']['inputs']['Power spectrum model']]
    range_logm = data['tab']['inputs']['Halo mass (M) [10<sup>x</sup>]']
    z = data['tab']['inputs']['Redshift (z)']

    M = utils.generateDomain([10**range_logm[0], 10**range_logm[1]], True, 200)
    
    plot = {
        'type': 'plot',
        'x': M,
        'y': [],
        'title': 'Peak height',
        'xTitle': 'Halo mass (M<sub>⊙</sub>)',
        'yTitle': 'Peak height',
        'names': names
    }
    plots = [plot]

    for cosmo in cosmos:
        cosmology.setCurrent(cosmo)
        line = peaks.peakHeight(M * cosmo.h, z, ps_args = {'model': model})
        plot['y'].append(line)

    utils.logify(plots, True, False)
    utils.prepareJSON(plots)
    
    return flask.jsonify(plots)

###################################################################################################
