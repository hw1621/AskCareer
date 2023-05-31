from flask import Flask, render_template, redirect, request

app = Flask(__name__)

@app.route('/')
def index():
    args = request.args.to_dict()
    if (args.get("job-title") is not None):
        return redirect("/suggestions")
    return render_template('searchpage.html')

@app.route('/suggestions')
def suggest():
    return render_template('displaypage.html')