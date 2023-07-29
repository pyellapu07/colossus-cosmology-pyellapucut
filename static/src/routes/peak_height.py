from flask import Blueprint, request, jsonify
from numpy import array, linspace
from .utils import createCosmos, power_spectrum_models, logify
from colossus.cosmology import cosmology
from colossus.lss import peaks

bp = Blueprint('peak_height', __name__)

@bp.route('/Peak Height', methods=['POST'])
def peakHeight():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    model = power_spectrum_models[data['tab']['inputs']['Peak height model']['label']]
    halo = data['tab']['inputs']['Halo mass (M)']
    redshift = data['tab']['inputs']['Redshift (z)']
    combined = data['tab']['inputs']['Combine plotting']
    log_plot = data['tab']['inputs']['Log scale']

    num = 200
    x = linspace(halo[0],halo[1],num).tolist()
    np_x = array(x)
    plots = []

    if (combined):
        plots.append({
            'type': 'plot',
            'x': x,
            'y': [],
            'title': 'Peak height',
            'xTitle': 'Halo mass (M<sub>⊙</sub>/h)',
            'yTitle': 'Peak height',
            'names': names
        })

    for i, cosmo in enumerate(cosmos):
        cosmology.setCurrent(cosmo)
        line = peaks.peakHeight(np_x, redshift, ps_args={'model': model, 'path': None}).tolist()
        if (combined):
            plots[0]['y'].append(line)
        else:
            plot = {
                'type': 'plot',
                'x': x,
                'y': [line],
                'title': 'Peak height (' + names[i] + ' cosmology)',
                'xTitle': 'Halo mass (M<sub>⊙</sub>/h)',
                'yTitle': 'Peak height',
                'names': names[i]
            }
            plots.append(plot)

    logify(plots, True, log_plot)

    return jsonify(plots)

