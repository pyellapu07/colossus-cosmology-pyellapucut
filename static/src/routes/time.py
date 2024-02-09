import numpy as np
import flask

from static.src.routes import utils

###################################################################################################

bp = flask.Blueprint('time', __name__)

timePlots = [
{
    'title': 'Age of the Universe',
    'yTitle': 'Age (Gyr)',
},
{
    'title': 'Hubble expansion rate',
    'yTitle': 'Hubble rate (km/s/Mpc)',
}]

###################################################################################################

@bp.route('/Time', methods=['POST'])
def time():
    
    data = flask.request.json
    cosmos, names = utils.createCosmos(data['models'])
    function = data['tab']['inputs']['Plot as function of']
    domain = data['tab']['inputs']['Domain']
    log_plot = data['tab']['inputs']['Log scale']
    
    x_plot, z_eval, function = utils.createTimeAxis(cosmos, function, domain, log_plot)
 
    plots = []
    for plotTemp in timePlots:
        plot = plotTemp.copy()
        plot.update({
            'type': 'plot',
            'x': x_plot,
            'y': [],
            'xTitle': function,
            'names': names
        })
        plots.append(plot)

    for i, cosmo in enumerate(cosmos):

        # Plot age of Universe, t. If the x-axis is t, we plot a(t)
        if function in ['Redshift (z)', 'Scale factor (a)', '(z + 1)']:
            line = cosmo.age(z_eval[i])
        elif function == 'Time (t)':
            line = 1.0 / (1.0 + z_eval[i])
            plots[0]['yTitle'] = 'Scale factor (a)'
        else:
            raise Exception('Unknown function, %s.' % function)
        plots[0]['y'].append(line)
 
        # Plot Hubble rate H(z)
        line = cosmo.Hz(np.array(z_eval[i]))
        plots[1]['y'].append(line)
        
    if (log_plot):
        utils.logify(plots)
    utils.prepareJSON(plots)
    
    return flask.jsonify(plots)

###################################################################################################
