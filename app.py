from flask import Flask, render_template, request, jsonify
from cachelib import FileSystemCache
from colossus.cosmology import cosmology

cache = FileSystemCache('cache')
app = Flask(__name__) # Creating our Flask Instance

@app.route('/', methods=['GET'])
def index():
    """ Displays the index page accessible at '/' """

    return render_template('index.html')

@app.route('/test', methods=['POST'])
def test():
    models = request.json
    data = []

    for model in models:
        modelData = {}
        cosmo = cosmology.setCosmology('myCosmo', **model)
        modelData["age"] = cosmo.age(0.0).tolist();
        data.append(modelData)

    return jsonify(data);

if __name__ == '__main__':
    app.run()
