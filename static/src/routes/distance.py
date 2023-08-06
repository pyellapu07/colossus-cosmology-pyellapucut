from flask import Blueprint, request, jsonify
from numpy import linspace, array, isnan
from .utils import createCosmos, logify, process_cosmo_module, generateDomain

bp = Blueprint('distance', __name__)

@bp.route('/Distance', methods=['POST'])
def distance():
    distances = process_cosmo_module()['Distances']

    data = request.json
    cosmos, names = createCosmos(data['models'])
    domain = data['tab']['inputs']['Redshift domain']
    log_plot = data['tab']['inputs']['Log scale']

    x = generateDomain(domain, log_plot)
    np_x = array(x)
    plots = []

    for key in distances:
        y = []
        x_copy = x.copy()
        for i, cosmo in enumerate(cosmos):
            line = getattr(cosmo, distances[key]['function'])(np_x).tolist()

            for j, value in enumerate(line):
                if isnan(value):
                    del line[j]
                    del x_copy[j]

            y.append(line)
        plot = {
            'type': 'plot',
            'x': x_copy,
            'y': y,
            'title': key,
            'xTitle': 'Redshift (z)',
            'yTitle': 'Distance ' + ('(' + distances[key]['unit'] + ')' if distances[key]['unit'] != '' else ''),
            'names': names
        }
        plots.append(plot)

    if (log_plot):
        logify(plots)

    return jsonify(plots)
