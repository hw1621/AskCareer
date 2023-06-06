from flask import Flask, render_template, request, make_response, redirect
import requests
import json

app = Flask(__name__)

CLIENT_ID = '1067444981581-lmgjcqdqb7i9g17ai0fhdh6nind11ljo.apps.googleusercontent.com'

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        form = request.form.to_dict()
        try:
            assert "job-title" in form, "job-title not in form"
            assert "job-company" in form, "company not in form"
            assert "job-summary" in form, "job-description not in form"
        except AssertionError as e:
            return str(e), 500
        print(form)
        be_info = requests.get(
            "https://drp26backend.herokuapp.com/recommend/get_users",
            params=form
        )
        profiles = json.loads(be_info.text)['profiles']
        # remove duplication while keeping order
        seen = set()
        profiles_dedup = []
        for i in profiles:
            if i['uuid'] not in seen:
                seen.add(i['uuid'])
                profiles_dedup.append(i)
        return render_template("displaypage.html", profiles=profiles_dedup)
    response = make_response(render_template('searchpage.html'))
    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin-allow-popups'
    return response

@app.route('/signin', methods = ['POST'])
def signin():
    token = request.form.to_dict()['credential']
    backendURL = "https://drp26backend.herokuapp.com/signin"
    response = requests.post(backendURL, token)
    if response.json()["authenticated"]:
        return redirect("https://drp26.herokuapp.com/", code=200)
    else:
        return redirect("https://drp26.herokuapp.com/", code=403)






