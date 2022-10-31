from flask import Flask, render_template, request, jsonify
from colossus.cosmology import cosmology

Flask_App = Flask(__name__) # Creating our Flask Instance

@Flask_App.route('/', methods=['GET'])
def index():
    """ Displays the index page accessible at '/' """

    return render_template('index.html')

@Flask_App.route('/test', methods=['GET'])
def test():
    cosmo = cosmology.setCosmology('planck18')
    return jsonify({"age": cosmo.age(0.0).tolist()});

if __name__ == '__main__':
    Flask_App.debug = True
    Flask_App.run()
