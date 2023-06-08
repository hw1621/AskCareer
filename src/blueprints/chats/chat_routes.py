import requests
from flask import Blueprint, request
from flask_login import login_required, current_user

chat = Blueprint('chat', __name__, url_prefix='/chat')

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
def chats_overview():
    data = {
        "requester": current_user.profile_id,
        "other": request.json()["requester"]
    }
    r = requests.post(
        f"{backend_chat_url}/load_chat",
        json=data
    )
    return r.json()


@chat.route('/send_message', methods=["POST"])
@login_required
def send_message():
    data = request.json().to_dict()
    data['sender'] = current_user.profile_id
    r = requests.post(
        f"{backend_chat_url}/send_message",
        json=data
    )
    #  TODO: send a new_message event to recipient's socket
    return r.json()
