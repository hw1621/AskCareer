import base64

import boto3
from flask import Flask, render_template, request, make_response, redirect
import requests
import json

from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, current_user, logout_user
from flask_socketio import SocketIO

from src.blueprints.chats.chat_routes import chat

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


class User(UserMixin):
    def __init__(self, uid, profile_id):
        self.id = uid
        self.profile_id = profile_id


@login_manager.user_loader
def load_user(user_id):
    url = "https://drp26backend.herokuapp.com/loaduser/" + user_id
    try:
        r = requests.get(url)
        profile_id = json.loads(r.text)['profileId']
    except Exception:
        print(url)
        return None
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


@app.route('/edit-profile', methods=['GET', 'POST'])
def edit_profile():
    if request.method == "POST":
        formData = request.form
        profileInfo = dict(formData.to_dict())
        if 'profile-photo' in request.files and request.files['profile-photo'] is not None:
            image = request.files['profile-photo']
            image_string = base64.b64encode(image.read()).decode("utf-8")

            #upload to S3
            bucket_name = 'drp26profilephotos'
            s3_key = 'uploads/' + image.filename
            s3_client = boto3.client('s3')
            s3_client.upload_fileobj(image, bucket_name, s3_key)
            return 'Image uploaded to S3 successfully'
        else:
            image_string ="/9j/4AAQSkZJRgABAAEASABIAAD//gAhTEVORUwgT25HdWFyZCBDaHJvbWFrZXk9MCwyMCwzMP/b%0AAIQACAUGBwYFCAcGBwkICAkMFA0MCwsMGBESDhQdGR4eHBkcGyAkLicgIisiGxwoNigrLzEzNDMf%0AJjg8ODI8LjIzMQEICQkMCgwXDQ0XMSEcITExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEx%0AMTExMTExMTExMTExMTExMTEx/8QBogAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoLAQADAQEB%0AAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQci%0AcRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpj%0AZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfI%0AycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+hEAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSEx%0ABhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElK%0AU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3%0AuLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/8AAEQgB6AFuAwEhAAIRAQMR%0AAf/aAAwDAQACEQMRAD8A4jFJ0NB0js+9C+hoARVwafQAnelHFACEUCpAQgZpwPQUAAHNSBe9A4hj%0AninYpFCYxSYoAR8joPzoXjrxQAjc/SgdOOKBWDO3oaeGb1xQCDzGH8Tfn/8AXpBJID99h9GP+NAW%0AHLczIwIlkwP9o/404Xc4HyzSgf75/wAaYrAL68U8XU4/4Gf8aBqN+Dxe3A/7aH/GgViRdW1EcC+u%0Af+/p/wAakTWdTHAv7kf9tT/jQCQ/+3NV7ajdD/tqaeNe1gdNTuv+/hpFcgq+I9aU/Lqd0P8Atoak%0AHifXAP8AkKXWf9//AOtQHIC+K9dH/MUuf++//rU8eL9fXpqk/wD30P8ACmTyCjxl4hH/ADE5/wAx%0A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"
        profileInfo['profilePhotoString'] = image_string
        for i in (
                ['title', 'company', 'start-date', 'end-date', 'summary', 'school-name',
                 'degree',
                 'start-date-edu', 'end-date-edu']):
            profileInfo[i] = formData.getlist(i)
        profileId = str(current_user.profile_id)
        response = requests.post(
            "https://drp26backend.herokuapp.com/uploadform",
            json={"profile-info": profileInfo, "profile-id": profileId}
        )
        return redirect('https://drp26.herokuapp.com/')
    else:
        return render_template('profile.html')

@app.route('/signout')
def signout():
    logout_user()
    return redirect('https://drp26.herokuapp.com/')


if __name__ == '__main__':
    socketio.run(app, debug=True)
