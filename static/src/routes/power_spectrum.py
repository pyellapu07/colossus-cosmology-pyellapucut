#import numpy as np
from flask import Blueprint, request, jsonify

from static.src.routes import utils

###################################################################################################

bp = Blueprint('power_spectrum', __name__)

###################################################################################################

@bp.route('/Power Spectrum', methods=['POST'])
def powerSpectrum():
    
    data = request.json
    cosmos, names = utils.createCosmos(data['models'])
    model = utils.power_spectrum_models[data['tab']['inputs']['Power spectrum model']]
    domain = data['tab']['inputs']['Scale']
    log_plot = data['tab']['inputs']['Log scale']

    k = utils.generateDomain(domain, log_plot, 10000)
    z = utils.generateDomain([-0.5, 10.0], False, 200)
    a = 1.0 / (1.0 + z)
    
    y1, y2, y3 = [], [], []
    matter_power_spectrum_plot = {
        'type': 'plot',
        'x': k,
        'y': y1,
        'title': 'Matter power spectrum',
        'xTitle': 'Wavenumber k (Mpc<sup>-1</sup>)',
        'yTitle': 'P (Mpc<sup>3</sup>)',
        'names': names
    }
    linear_growth_factor_plot = {
        'type': 'plot',
        'x': a,
        'y': y2,
        'title': 'Linear growth factor',
        'xTitle': 'Scale factor (a)',
        'yTitle': 'Linear growth factor (D<sub>+</sub>)',
        'names': names
    }
    power_spectrum_slope_plot = {
        'type': 'plot',
        'x': k,
        'y': y3,
        'title': 'Power spectrum slope',
        'xTitle': 'Wavenumber k (Mpc<sup>-1</sup>)',
        'yTitle': 'Slope (d ln(P) / d ln(k))',
        'names': names
    }

    plots = [matter_power_spectrum_plot, linear_growth_factor_plot, power_spectrum_slope_plot]

    for cosmo in cosmos:
        cosmo_k = k * cosmo.h

        line = cosmo.matterPowerSpectrum(cosmo_k, model=model)
        line /= cosmo.h**3
        y1.append(line)

        line = cosmo.growthFactor(z)
        y2.append(line)

        line = cosmo.matterPowerSpectrum(cosmo_k, model=model, derivative=True)
        y3.append(line)

    if (log_plot):
        utils.logify(plots[:-1], xAxis=True, yAxis=True)
        utils.logify([plots[-1]], xAxis=True, yAxis=False)
    utils.prepareJSON(plots)
    
    return jsonify(plots)
