import numpy as np
from flask import Blueprint, request, jsonify

from static.src.routes import utils

###################################################################################################

bp = Blueprint('correlation', __name__)

correlationPlots = [
{
    'title': 'Correlation function (𝜉)',
    'yTitle': 'abs(Correlation function)',
    'xTitle': 'Radius (Mpc/h)',
    'function': 'correlationFunction'
},
{
    'title': 'Variance (σ)',
    'yTitle': 'Variance',
    'xTitle': 'Radius (Mpc/h)',
    'function': 'sigma'
}]

###################################################################################################

@bp.route('/Correlation', methods=['POST'])
def correlation():
    
    data = request.json
    cosmos, names = utils.createCosmos(data['models'])
    model = utils.power_spectrum_models[data['tab']['inputs']['Power spectrum model']]
    wave = data['tab']['inputs']['Radius (R)']
    log_plot = data['tab']['inputs']['Log scale']

    x = list(utils.generateDomain(wave, log_plot))
    np_x = np.array(x)
    #y = []

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
        utils.logify(plots)

    return jsonify(plots)
