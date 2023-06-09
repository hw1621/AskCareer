import requests
from flask import Blueprint, request
from flask_login import login_required, current_user

chat = Blueprint('chat', __name__)

backend_chat_url = "https://drp26backend.herokuapp.com/chat"


@chat.route('/unread')
@login_required
def check_unread():
    r = requests.post(f"{backend_chat_url}/unread", json={"user": current_user.profile_id})
    return {r.json()}


@chat.route('/chats_overview')
@login_required
def chat_overview():
    r = requests.post(f"{backend_chat_url}/chat/chats_overview", json={"user": current_user.profile_id})
    return r.json()


@chat.route('/load_chat', methods=["POST"])
def load_chat():
    data = {
        "requester": current_user.profile_id,
        "other": request.json["requester"]
    }
    r = requests.post(
        f"{backend_chat_url}/load_chat",
        json=data
    )
    return r.json()

