from flask import Blueprint, request, jsonify
from numpy import array, linspace
from .utils import createCosmos, power_spectrum_models, logify

bp = Blueprint('correlation', __name__)

correlationPlots = [
{
    'title': 'Correlation function',
    'yTitle': 'Correlation',
    'xTitle': 'Radius (Mpc/h)',
    'function': 'correlationFunction'
},
{
    'title': 'RMS variance',
    'yTitle': 'Variance',
    'xTitle': 'Radius (Mpc/h)',
    'function': 'sigma'
}]

@bp.route('/Correlation', methods=['POST'])
def correlation():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    model = power_spectrum_models[data['tab']['inputs']['Correlation model']['label']]
    wave = data['tab']['inputs']['Radius (R)']
    log_plot = data['tab']['inputs']['Log scale']

    num = 200
    x = linspace(wave[0],wave[1],num).tolist()
    np_x = array(x)
    y = []

    plots = []
    for plotTemp in correlationPlots:
        plot = plotTemp.copy()
        plot.update({
            'type': 'plot',
            'x': x,
            'y': [],
            'names': names
        })
        plots.append(plot)

    for plot in plots:
        for cosmo in cosmos:
            line = getattr(cosmo, plot['function'])(np_x, ps_args={'model': model, 'path': None}).tolist()
            if (log_plot):
                line = [abs(number) for number in line]
            plot['y'].append(line)

    for plot in plots:
        del plot['function']

    if (log_plot):
        logify(plots)

    return jsonify(plots)
