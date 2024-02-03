import numpy as np
from flask import Blueprint, request, jsonify

from colossus.cosmology import cosmology
from colossus.lss import peaks

from static.src.routes import utils

###################################################################################################

bp = Blueprint('peak_height', __name__)

###################################################################################################

@bp.route('/Peak Height', methods=['POST'])
def peakHeight():
    data = request.json
    cosmos, names = utils.createCosmos(data['models'])
    model = utils.power_spectrum_models[data['tab']['inputs']['Power spectrum model']]
    halo = data['tab']['inputs']['Halo mass (M) [10<sup>x</sup>]']
    redshift = data['tab']['inputs']['Redshift (z)']

    domain = list(utils.generateDomain([10 ** halo[0], 10 ** halo[1]], True))
    plot = {
        'type': 'plot',
        'x': [],
        'y': [],
        'title': 'Peak height',
        'xTitle': 'Halo mass (M<sub>⊙</sub>)',
        'yTitle': 'Peak height',
        'names': names
    }
    plots = [plot]

    for i, cosmo in enumerate(cosmos):
        cosmology.setCurrent(cosmo)

        plot['x'].append(domain)

        # multiply Msun by cosmo.h
        cosmo_x = [i * cosmo.h for i in domain]

        line = peaks.peakHeight(np.array(cosmo_x), redshift, ps_args={'model': model, 'path': None}).tolist()
        plot['y'].append(line)

    utils.logify(plots, True, False)
    
    return jsonify(plots)

