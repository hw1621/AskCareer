from json import JSONDecodeError

import boto3
from flask import Flask, render_template, request, make_response, redirect
import requests
import json

from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, current_user, logout_user, login_required
from flask_socketio import SocketIO

from src.blueprints.chats.chat_routes import chat
from src.s3 import save_to_s3

app = Flask(__name__)
app.secret_key = 'drp26secretkey'
app.register_blueprint(chat, url_prefix='/chat')
socketio = SocketIO(app)
connected = []
login_manager = LoginManager()
login_manager.session_protection = "strong"
login_manager.init_app(app)
cors = CORS(
    app,
    resources={
        r"/profiles/*": {
            "origins": [
                "https://drp26.herokuapp.com",
                "http://localhost:5000",
                "https://localhost:5000",
            ]
        }
    }
)

CLIENT_ID = '1067444981581-lmgjcqdqb7i9g17ai0fhdh6nind11ljo.apps.googleusercontent.com'

create_profile_route = "/create-profile"


def profile_required(func):
    def wrapper(*args, **kwargs):
        r = requests.get(f"https://drp26backend.herokuapp.com/profiles/{current_user.profile_id}")
        if r.status_code != 200:
            return redirect(create_profile_route)
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper


class User(UserMixin):
    def __init__(self, uid, profile_id):
        self.id = uid
        self.profile_id = profile_id


@login_manager.user_loader
def load_user(user_id):
    url = "https://drp26backend.herokuapp.com/loaduser/" + user_id
    r = requests.get(url)
    try:
        profile_id = json.loads(r.text)['profileId']
    except JSONDecodeError as e:
        print(e)
        return None
    return User(user_id, profile_id)


@app.route('/', methods=['GET', 'POST'])
def index():
    if not current_user.is_authenticated:
        return render_template('home.html')
    r = requests.get(f"https://drp26backend.herokuapp.com/profiles/{current_user.profile_id}")
    if r.status_code != 200:
        return redirect(create_profile_route)
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


def process_profile(form_data):
    profile_info = dict(form_data.to_dict())
    image_url = " "
    if 'profile-photo' in request.files and request.files['profile-photo'] is not None and \
            request.files['profile-photo'].filename != '':
        image = request.files['profile-photo']

        # upload to S3
        bucket_name = 'drp26profilephotos'
        image_url = save_to_s3(image, bucket_name, str(current_user.profile_id))

    profile_info['profilePhotoString'] = image_url
    for i in (
        ['title', 'company', 'start-date', 'end-date', 'summary', 'school-name',
         'degree', 'start-date-edu', 'end-date-edu']):
        profile_info[i] = form_data.getlist(i)
    requests.post(
        "https://drp26backend.herokuapp.com/uploadform",
        json={"profile-info": profile_info, "profile-id": str(current_user.profile_id)}
    )


@app.route(create_profile_route, methods=['GET', 'POST'])
@login_required
def create_profile():
    r = requests.get(f"https://drp26backend.herokuapp.com/profiles/{current_user.profile_id}")
    if r.status_code == 200:
        return redirect('/edit-profile')
    if request.method == "POST":
        process_profile(request.form)
        return redirect('/')
    else:
        return render_template('profile.html', new_profile=True)


@app.route('/edit-profile', methods=['GET', 'POST'])
@login_required
@profile_required
def edit_profile():
    if request.method == "POST":
        process_profile(request.form)
        return redirect('/edit-profile')
    else:
        return render_template('profile.html', new_profile=False)


@app.route('/signout')
@login_required
@profile_required
def signout():
    logout_user()
    return redirect('https://drp26.herokuapp.com/')


@app.route('/settings', methods=['GET', 'POST'])
@login_required
@profile_required
def setting():
    if request.method == 'GET':
        content = {'user_id': str(current_user.id), 'profile_id': str(current_user.profile_id)}
        r = requests.post("https://drp26backend.herokuapp.com/get_settings", json=content)
        return render_template("settings.html", settings=r.json())
    else:
        settings = request.form.to_dict()
        # Currently consider the data received is in a form, need to modify later based on frontend
        backend_url = "https://drp26backend.herokuapp.com/save_settings"
        profile_id = str(current_user.profile_id)
        print(settings)
        requests.post(backend_url, json={'profile_id': profile_id, 'settings': settings})
        return render_template("settings.html", settings=settings)


# @app.route('/test')
# def test_page():
#     return render_template("searchpage.html")


if __name__ == '__main__':
    socketio.run(app, debug=True)
