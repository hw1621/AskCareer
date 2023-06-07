from flask import Flask, render_template, request, make_response, redirect
import requests
import json
from flask_login import LoginManager, UserMixin, login_user, current_user

app = Flask(__name__)
app.secret_key = 'drp26secretkey'
login_manager = LoginManager()
login_manager.session_protection = "strong"
login_manager.init_app(app)

CLIENT_ID = '1067444981581-lmgjcqdqb7i9g17ai0fhdh6nind11ljo.apps.googleusercontent.com'


class User(UserMixin):
    def __init__(self, uid, profile_id):
        self.id = uid
        self.profile_id = profile_id


@login_manager.user_loader
def load_user(user_id):
    url = "https://drp26backend.herokuapp.com/loaduser/" + user_id
    print(url)
    r = requests.get("https://drp26backend.herokuapp.com/loaduser/" + user_id)
    print(r.text)
    profile_id = json.loads(r.text)['profileId']
    return User(user_id, profile_id)


@app.route('/', methods=['GET', 'POST'])
def index():
    if not current_user.is_authenticated:
        return render_template('home.html')
    if request.method == 'POST':
        form = request.form.to_dict()
        try:
            assert "job-title" in form, "job-title not in form"
            assert "job-company" in form, "company not in form"
            assert "job-summary" in form, "job-description not in form"
        except AssertionError as e:
            return str(e), 500
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


@app.route('/signin', methods=['POST'])
def signin():
    token = request.form.to_dict()['credential']
    backend_url = "https://drp26backend.herokuapp.com/signin"
    response = requests.post(backend_url, token)
    if response.json()["authenticated"]:
        r = response.json()
        uid = r["userId"]
        profile_id = r["profileId"]
        login_user(User(uid, profile_id))
        return redirect("https://drp26.herokuapp.com/")
    else:
        return redirect("https://drp26.herokuapp.com/")






