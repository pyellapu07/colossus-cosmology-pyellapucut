import numbers
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
                    if (prop["function"] == "comovingDistance"):
                        result = getattr(cosmo, prop["function"])(0, redshift)
                    else:
                        result = getattr(cosmo, prop["function"])(redshift)

                    # convert ndarray to numbers
                    if type(result) is ndarray:
                        result = result.tolist()

                    # remove h units
                    if (prop["unit"] == "Mpc"):
                        result = result * cosmo.h
                    elif (prop["unit"] == "M<sub>⊙</sub>/kpc<sup>3</sup>"):
                        result = result / cosmo.h**2

                    # hardcoded to skip distance modulus for negative results 
                    if prop["function"] == "distanceModulus" and result < 0: 
                        result = "—"
                    # hardcoded to set to zero if result is very small
                    elif (prop["function"] == "luminosityDistance" or prop["function"] == "angularDiameterDistance" or prop["function"] == "lookbackTime") and redshift == 0:
                        result = 0
                    
                    # format numbers
                    if isinstance(result, numbers.Number):
                        if (isnan(result) == True):
                            result = "—"
                        else:
                            result = sigfig(result)
                            if result != 0 and (abs(result) > 100 or abs(result) < 0.01):
                                result = "{:0.3e}".format(result)

                row.append(result)

            csv.append(row)

    return jsonify([table])
