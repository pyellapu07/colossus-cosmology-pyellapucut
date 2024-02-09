import numpy as np
import flask

from static.src.routes import utils

###################################################################################################

bp = flask.Blueprint('correlation', __name__)

correlationPlots = [
{
    'title': 'Correlation function (𝜉)',
    'yTitle': 'abs(Correlation function)',
    'xTitle': 'Radius (Mpc)',
    'function': 'correlationFunction'
},
{
    'title': 'Variance (σ)',
    'yTitle': 'Variance',
    'xTitle': 'Radius (Mpc)',
    'function': 'sigma'
}]

###################################################################################################

@bp.route('/Correlation', methods=['POST'])
def correlation():
    
    data = flask.request.json
    cosmos, names = utils.createCosmos(data['models'])
    model = utils.power_spectrum_models[data['tab']['inputs']['Power spectrum model']]
    range_r = data['tab']['inputs']['Radius (R)']
    log_plot = data['tab']['inputs']['Log scale']

    R = utils.generateDomain(range_r, log_plot)

    plots = []
    for plotTemp in correlationPlots:
        plot = plotTemp.copy()
        plot.update({
            'type': 'plot',
            'x': R,
            'y': [],
            'names': names
        })
        plots.append(plot)

    for plot in plots:
        for cosmo in cosmos:
            line = getattr(cosmo, plot['function'])(R * cosmo.h, ps_args = {'model': model, 'path': None})
            if (log_plot):
                line = np.abs(line)
            plot['y'].append(line)

    for plot in plots:
        del plot['function']

    if (log_plot):
        utils.logify(plots)
    utils.prepareJSON(plots)

    return flask.jsonify(plots)

###################################################################################################
