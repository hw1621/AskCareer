from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('searchpage.html')

@app.route('/suggestions')
def suggest():
    return render_template('displaypage.html')