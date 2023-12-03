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

    domain = generateDomain(domain, log_plot, 10000)
    y, y2, y3 = [], [], []
    x, x2 = [], [1 / (domain[j] + 1) for j in range(len(domain))]
    matter_power_spectrum_plot = {
        'type': 'plot',
        'x': x,
        'y': y,
        'title': 'Matter power spectrum',
        'xTitle': 'Wavenumber (Mpc)<sup>3</sup>',
        'yTitle': 'Matter power spectrum (Mpc)<sup>3</sup>',
        'names': names
    }
    linear_growth_factor_plot = {
        'type': 'plot',
        'x': x2,
        'y': y2,
        'title': 'Linear growth factor',
        'xTitle': 'Scale factor (a)',
        'yTitle': 'Linear growth factor (D<sub>+</sub>)',
        'names': names
    }
    power_spectrum_slope_plot = {
        'type': 'plot',
        'x': x,
        'y': y3,
        'title': 'Power spectrum slope',
        'xTitle': 'Wavenumber (Mpc)<sup>3</sup>',
        'yTitle': 'Slope (d ln(P) / d ln(k))',
        'names': names
    }

    plots = [matter_power_spectrum_plot, linear_growth_factor_plot, power_spectrum_slope_plot]

    for cosmo in cosmos:
        # remove h units
        cosmo_x = [i / cosmo.h ** 3 for i in domain]
        x.append(cosmo_x)

        line = cosmo.matterPowerSpectrum(array(cosmo_x), model=model).tolist()
        # remove h units
        line = [i / cosmo.h ** 3 for i in line]

        y.append(line)

        line = cosmo.growthFactor(array(x2)).tolist()
        y2.append(line)

        line = cosmo.matterPowerSpectrum(array(cosmo_x), model=model, derivative=True).tolist()
        y3.append(line)

    if (log_plot):
        logify(plots, xAxis=True, yAxis=False)

    return jsonify(plots)
