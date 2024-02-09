import flask

from static.src.routes import utils

###################################################################################################

bp = flask.Blueprint('density', __name__)

###################################################################################################

@bp.route('/Density', methods=['POST'])
def density():
    
    cosmo_module = utils.process_cosmo_module()
    data = flask.request.json
    cosmos, names = utils.createCosmos(data['models'])
    function = data['tab']['inputs']['Plot as function of']
    domain = data['tab']['inputs']['Domain']
    contents = cosmo_module["Contents of the Universe"]
    contentKeys = list(contents.keys())
    combined = data['tab']['inputs']['Compare densities']
    log_plot = data['tab']['inputs']['Log scale']
    
    x_plot, z_eval, function = utils.createTimeAxis(cosmos, function, domain, log_plot)

    plots = []

    if (combined):
        rho_names = contentKeys[:7]
        omega_names = contentKeys[7:]
        for i, cosmo in enumerate(cosmos):
            rho_plot = {
                'type': 'plot',
                'x': x_plot,
                'y': [],
                'title': 'Densities (' + names[i] + ' cosmology)',
                'xTitle': function,
                'yTitle': 'Density (M<sub>⊙</sub>/kpc<sup>3</sup>)',
                'names': rho_names
            }
            omega_plot = {
                'type': 'plot',
                'x': x_plot,
                'y': [],
                'title': 'Fractional densities (' + names[i] + ' cosmology)',
                'xTitle': function,
                'yTitle': 'Fractional density (Ω<sub>X</sub>)',
                'names': omega_names
            }

            for key in rho_names:
                line = getattr(cosmo, contents[key]['function'])(z_eval[i])
                line *= cosmo.h**2
                rho_plot['y'].append(line)

            for key in omega_names:
                line = getattr(cosmo, contents[key]['function'])(z_eval[i])
                omega_plot['y'].append(line)

            plots.append(rho_plot)
            plots.append(omega_plot)
    
    else:
        for key in contentKeys:
            plot = {
                'type': 'plot',
                'x': x_plot,
                'y': [],
                'title': key,
                'xTitle': function,
                'yTitle': 'Density (' + contents[key]['unit'] + ')' if contents[key]['unit'] != '' else 'Fractional density',
                'names': names
            }
            for i, cosmo in enumerate(cosmos):
                line = getattr(cosmo, contents[key]['function'])(z_eval[i])
                line *= cosmo.h**2
                plot['y'].append(line)
            plots.append(plot)

    if (log_plot):
        utils.logify(plots)
    utils.prepareJSON(plots)
    
    return flask.jsonify(plots)

###################################################################################################
