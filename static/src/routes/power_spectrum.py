from flask import Blueprint, request, jsonify
from numpy import linspace, array
from .utils import createCosmos, logify, power_spectrum_models

bp = Blueprint('power_spectrum', __name__)

@bp.route('/Power Spectrum', methods=['POST'])
def powerSpectrum():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    model = power_spectrum_models[data['tab']['inputs']['Power spectrum model']['label']]
    wave = data['tab']['inputs']['Wavenumber (k)']
    log_plot = data['tab']['inputs']['Log scale']

    num = 200
    x = linspace(wave[0],wave[1],num).tolist()
    np_x = array(x)
    y = []
    plot = {
        'type': 'plot',
        'x': x,
        'y': y,
        'title': 'Matter power spectrum',
        'xTitle': 'Wavenumber (Mpc/h)^3',
        'yTitle': 'Matter power spectrum (Mpc/h)^3',
        'names': names
    }

    plots = [plot]

    for cosmo in cosmos:
        line = cosmo.matterPowerSpectrum(np_x, model=model).tolist()
        y.append(line)

    if (log_plot):
        logify(plots)

    return jsonify(plots)
