from flask import Flask, render_template, request
import requests

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        form = request.form.to_dict()
        try:
            assert "job-title" in form, "job-title not in form"
            assert "company" in form, "company not in form"
            assert "jd" in form, "job-description not in form"
        except AssertionError as e:
            return str(e), 500
        print(form)
        be_info = requests.get("https://drp26backend.herokuapp.com/recommend/get_users")
        print(be_info.content)
        profiles = be_info.json()['profiles']
        return render_template("displaypage.html", profiles=profiles)
    return render_template('searchpage.html')
