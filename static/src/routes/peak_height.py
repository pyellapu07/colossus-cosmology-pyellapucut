#import numpy as np
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

    x = list(utils.generateDomain([10 ** halo[0], 10 ** halo[1]], True))
    plot = {
        'type': 'plot',
        'x': x,
        'y': [],
        'title': 'Peak height',
        'xTitle': 'Halo mass (M<sub>⊙</sub>)',
        'yTitle': 'Peak height',
        'names': names
    }
    plots = [plot]

    for cosmo in enumerate(cosmos):
        cosmology.setCurrent(cosmo)
        line = peaks.peakHeight(x * cosmo.h, redshift, ps_args={'model': model, 'path': None})
        plot['y'].append(line)

    utils.logify(plots, True, False)
    utils.prepareJSON(plots)
    
    return jsonify(plots)
