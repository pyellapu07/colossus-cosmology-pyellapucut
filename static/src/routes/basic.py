from flask import Blueprint, request, jsonify
from numpy import ndarray, isnan
from .utils import createCosmos, sigfig, process_cosmo_module


bp = Blueprint('basic', __name__)

@bp.route('/Basic', methods=['POST'])
def basic():
    cosmo_module = process_cosmo_module()

    data = request.json
    cosmos, names = createCosmos(data['models'])
    redshift = data['tab']['inputs']['Redshift (z)']

    csv = []
    table = {
        'type': 'table',
        'csv': csv
    }

    names.insert(0, '')
    names.insert(0, '')
    csv.append(names)

    for section_name in cosmo_module:
        section_header = [section_name]
        csv.append(section_header)

        section = cosmo_module[section_name]

        for key in section:
            row = [key]
            prop = section[key]

            for cosmo in cosmos:
                result = "—"

                if (prop["future"] or redshift >= 0):
                    result = getattr(cosmo, prop["function"])(redshift)

                    if isnan(result):
                        result = "—"
                    else:
                        if type(result) is ndarray:
                            result = result.tolist()
                        if result in [float("-inf"),float("inf")]:
                            result = str(result)
                        elif result < 0 and prop["function"] == "distanceModulus":
                            result = "—"
                        else:
                            if (prop["function"] == "comovingDistance"):
                                result = result * -1 # hardcoded to flip sign... not sure why

                            result = sigfig(result)
                            if result != 0 and (abs(result) > 100 or abs(result) < 0.01):
                                result = "{:0.3e}".format(result)

                row.append(result)

            csv.append(row)

    return jsonify([table])
