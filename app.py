from flask import Flask, render_template, request
from static.src.routes import basic, time, distance, density, power_spectrum, correlation, peak_height

'''
(!) responses are returned as an array of tables or plots

table data structure: 
{
    'type': 'table',
    'csv': [ [row 1 values], [row 2 values], [row 3 values]]
}

plot data structure:
{
    'type': 'plot',
    'x': [],
    'y': [[line1], [line2], [line3]]
}
'''

app = Flask(__name__, static_folder='static')

# Each of your routes would be a blueprint that you imported
app.register_blueprint(basic.bp)
app.register_blueprint(time.bp)
app.register_blueprint(distance.bp)
app.register_blueprint(density.bp)
app.register_blueprint(power_spectrum.bp)
app.register_blueprint(correlation.bp)
app.register_blueprint(peak_height.bp)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()