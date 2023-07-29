from flask import Blueprint, request, jsonify
from numpy import linspace, array
from .utils import createCosmos, logify

bp = Blueprint('time', __name__)

timePlots = [
{
    'title': 'Age of the Universe',
    'yTitle': 'Age (Gigayears)',
},
{
    'title': 'Hubble expansion rate',
    'yTitle': 'Hubble parameter (H)',
}]

@bp.route('/Time', methods=['POST'])
def time():
    data = request.json
    cosmos, names = createCosmos(data['models'])
    function = data['tab']['inputs']['Plot as function of']["label"]
    domain = data['tab']['inputs']['Domain']
    log_plot = data['tab']['inputs']['Log scale']

    num = 200
    x = linspace(domain[0],domain[1],num).tolist()
    if (function == 'Time (t)'):
        x = [a for a in x if a > 0 and a <= 120.869]
    elif (function == 'Scale factor (a)'):
        x = [a for a in x if a > 0]

    plots = []
    for plotTemp in timePlots:
        plot = plotTemp.copy()
        plot.update({
            'type': 'plot',
            'x': x,
            'y': [],
            'xTitle': function,
            'names': names
        })
        plots.append(plot)

    for cosmo in cosmos:
        x_copy = x.copy()

        if (function == 'Time (t)'):
            for j in range(len(x_copy)):
                x_copy[j] = cosmo.age(x[j], inverse = True)
        elif (function == 'Scale factor (a)'):
            for j in range(len(x_copy)):
                x_copy[j] = 1 / x[j] - 1

        line = cosmo.Hz(array(x_copy)).tolist()
        plots[1]['y'].append(line)

        if (function == 'Redshift (z)' or function == 'Scale factor (a)' ):
            line = cosmo.age(array(x_copy)).tolist()
        elif (function == 'Time (t)'):
            line = x_copy
            plots[0]['yTitle'] = 'Redshift (z)'
        plots[0]['y'].append(line)

    if (log_plot):
        logify(plots)

    return jsonify(plots)
