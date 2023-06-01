from flask import Flask, render_template, redirect, request
import requests

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        form = request.form.to_dict()
        print(form)
        be_info = requests.get("https://drp26backend.herokuapp.com/recommend/get_users")
        print(be_info.content)
        profiles = [{"name": i["name"]} for i in be_info.json()["profiles"]]
        return render_template("displaypage.html", profiles=profiles)
    return render_template('searchpage.html')
