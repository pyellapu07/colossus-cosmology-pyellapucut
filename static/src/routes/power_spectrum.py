import flask

from static.src.routes import utils

###################################################################################################

bp = flask.Blueprint('power_spectrum', __name__)

###################################################################################################

@bp.route('/Power Spectrum', methods=['POST'])
def powerSpectrum():
    
    data = flask.request.json
    cosmos, names = utils.createCosmos(data['models'])
    model = utils.power_spectrum_models[data['tab']['inputs']['Power spectrum model']]
    domain = data['tab']['inputs']['Scale']
    log_plot = data['tab']['inputs']['Log scale']

    k = utils.generateDomain(domain, log_plot, 10000)
    if log_plot:
        a = utils.generateDomain([1E-2, 20.0], True, 200)
    else:
        a = utils.generateDomain([1E-2, 4.0], False, 200)
    z = 1.0 / a - 1.0
    
    y_P, y_slope, y_D = [], [], []

    for cosmo in cosmos:
        cosmo_k = k / cosmo.h
        model_use = utils.getPowerSpectrumModel(cosmo, model)
        line = cosmo.matterPowerSpectrum(cosmo_k, model = model_use)
        line /= cosmo.h**3
        y_P.append(line)
        line = cosmo.matterPowerSpectrum(cosmo_k, model = model_use, derivative = True)
        y_slope.append(line)
        line = cosmo.growthFactor(z)
        y_D.append(line)

    matter_power_spectrum_plot = {
        'type': 'plot',
        'x': k,
        'y': y_P,
        'title': 'Matter power spectrum',
        'xTitle': 'Wavenumber k (Mpc<sup>-1</sup>)',
        'yTitle': 'P (Mpc<sup>3</sup>)',
        'names': names
    }
    power_spectrum_slope_plot = {
        'type': 'plot',
        'x': k,
        'y': y_slope,
        'title': 'Power spectrum slope',
        'xTitle': 'Wavenumber k (Mpc<sup>-1</sup>)',
        'yTitle': 'Slope (d ln(P) / d ln(k))',
        'names': names
    }
    linear_growth_factor_plot = {
        'type': 'plot',
        'x': a,
        'y': y_D,
        'title': 'Linear growth factor',
        'xTitle': 'Scale factor (a)',
        'yTitle': 'Linear growth factor (D<sub>+</sub>)',
        'names': names
    }

    plots = [matter_power_spectrum_plot, power_spectrum_slope_plot, linear_growth_factor_plot]

    if (log_plot):
        utils.logify([plots[0]])
        utils.logify([plots[1]], y_axis = False)
        utils.logify([plots[2]])
    utils.prepareJSON(plots)
    
    return flask.jsonify(plots)

###################################################################################################
