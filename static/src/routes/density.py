import numpy as np
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

    if combined:
        
        # Plot one plot each for rho and Omega and for each cosmology. We make cosmology-dependent
        # decisions such as which species to plot for each plot separately.
        rho_names = contentKeys[:8]
        omega_names = contentKeys[8:]
        
        for i, cosmo in enumerate(cosmos):

            # Compute densities. We do not plot densities that are identically zero since they
            # mess up log plots and crowd the plot in general. Curvature is the only density that
            # can be positive or negative.
            #
            # We run the same loop twice for density and fractional density since many functions
            # are the same.
            for j in range(2):

                plot = {
                    'type': 'plot',
                    'xTitle': function
                }
                if j == 0:
                    keys = rho_names
                    plot['title'] = 'Densities (' + names[i] + ' cosmology)'
                    plot['yTitle'] = 'Density (M<sub>⊙</sub>/kpc<sup>3</sup>)'
                else:
                    keys = omega_names
                    plot['title'] = 'Fractional densities (' + names[i] + ' cosmology)'
                    plot['yTitle'] = 'Fractional density (Ω<sub>X</sub>)'
                
                plot_y = []
                labels = []
                for key in keys:
                    if (not cosmo.relspecies) and (key in ['Relativistic density', 'Neutrino density', \
                                    'Photon density', 'Fractional relativistic density', \
                                    'Fractional neutrino density', 'Fractional photon density']):
                        continue
                    line = getattr(cosmo, contents[key]['function'])(z_eval[i])
                    if key in ['Curvature density', 'Fractional curvature density']:
                        if cosmo.flat:
                            continue
                        else:
                            if log_plot:
                                line = np.abs(line)
                    if j == 0:
                        line *= cosmo.h**2
                    plot_y.append(line)
                    if j == 0:
                        labels.append(key[:-8])
                    else:
                        labels.append(key[11:-8].capitalize())

                plot['x'] = x_plot
                plot['y'] = plot_y
                plot['names'] = labels
                plots.append(plot)
        
    else:
        
        # Plot one plot per component. In this case, cosmologies are grouped in a plot, so we need
        # to first figure out which components to plot for ANY cosmology.
        plot_curvature = False
        plot_relspecies = False
        for cosmo in cosmos:
            if not cosmo.flat:
                plot_curvature = True
            if cosmo.relspecies:
                plot_relspecies = True

        for key in contentKeys:
        
            if (key in ['Curvature density', 'Fractional curvature density']) and (not plot_curvature):
                continue
            if (key in ['Relativistic density', 'Neutrino density', 'Photon density', \
                        'Fractional relativistic density', 'Fractional neutrino density', \
                        'Fractional photon density']) and (not plot_relspecies):
                continue
            
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
