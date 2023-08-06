from flask import Blueprint, request, jsonify
from numpy import array
from .utils import createCosmos, generateDomain, logify, power_spectrum_models

bp = Blueprint('power_spectrum', __name__)

@bp.route('/Power Spectrum', methods=['POST'])
def powerSpectrum():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    model = power_spectrum_models[data['tab']['inputs']['Power spectrum model']]
    domain = data['tab']['inputs']['Scale']
    log_plot = data['tab']['inputs']['Log scale']

    x = generateDomain(domain, log_plot)
    y = []
    y2 = []
    matter_power_spectrum_plot = {
        'type': 'plot',
        'x': x,
        'y': y,
        'title': 'Matter power spectrum',
        'xTitle': 'Wavenumber (Mpc/h)<sup>3</sup>',
        'yTitle': 'Matter power spectrum (Mpc/h)<sup>3</sup>',
        'names': names
    }
    linear_growth_factor_plot = {
        'type': 'plot',
        'x': x,
        'y': y2,
        'title': 'Linear growth factor',
        'xTitle': 'Scale factor (a)',
        'yTitle': 'Linear growth factor (D<sub>+</sub>)',
        'names': names
    }

    plots = [matter_power_spectrum_plot, linear_growth_factor_plot]

    for cosmo in cosmos:
        line = cosmo.matterPowerSpectrum(array(x), model=model).tolist()
        y.append(line)

        redshift = [1 / (x[j] + 1) for j in range(len(x))]
        print(redshift)
        line = cosmo.growthFactor(array(redshift)).tolist()
        y2.append(line)

    if (log_plot):
        logify(plots)

    return jsonify(plots)
