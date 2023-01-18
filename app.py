from flask import Flask, render_template, request, jsonify
from cachelib import FileSystemCache
from colossus.cosmology import cosmology

# cache = FileSystemCache('cache')
app = Flask(__name__) # Creating our Flask Instance

@app.route('/', methods=['GET'])
def index():
    """ Displays the index page accessible at '/' """

    return render_template('index.html')

@app.route('/output', methods=['POST'])
def test():
    data = request.json
    response = {}

    for model in data['models']:
        modelData = {}
        cosmo = cosmology.setCosmology('myCosmo', **model)
        modelData['age'] = cosmo.age(0.0).tolist()
        response.append(modelData)

    return jsonify(response);

if __name__ == '__main__':
    app.run()
