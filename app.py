from flask import Flask, render_template, redirect, request

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        form = request.form.to_dict()
        print(form)
        return redirect("/suggestions")
    return render_template('searchpage.html')


@app.route('/suggestions')
def suggest():
    return render_template('displaypage.html')
