import requests
from flask_socketio import join_room, emit, leave_room

from .app import socketio, current_user

connections = []
backend_chat_url = "https://drp26backend.herokuapp.com/chat"


def socket_event_connection_check():
    print("SocketIO events loaded")


@socketio.on('connect')
def connection():
    new_room = current_user.profile_id if current_user.is_authenticated else "Anon"
    connections.append(new_room)
    join_room(new_room)


@socketio.on('send_msg')
def send_message(data):
    print("received message:", data)
    data['sender'] = current_user.profile_id
    r = requests.post(
        f"{backend_chat_url}/send_message",
        json=data,
    )
    response = r.json()
    timestamp = response["timestamp"]
    new_msg = {
        "content": data["content"],
        "by": data["sender"],
        "timestamp": timestamp
    }
    emit('new_message', new_msg, to=data['recipient'])
    response['ack'] = True
    return response


@socketio.on('request_unread')
def request_unread(_):
    r = requests.post(f"{backend_chat_url}/unread", json={"user": current_user.profile_id})
    response = r.json()
    response['ack'] = True
    return response


@socketio.on('request_load_chat')
def request_load_chat(data):
    data['requester'] = current_user.profile_id
    r = requests.post(
        f"{backend_chat_url}/load_chat",
        json=data
    )
    response = r.json()
    response['ack'] = True
    return response


@socketio.on('request_chats_overview')
def request_chats_overview(_):
    r = requests.post(f"{backend_chat_url}/chats_overview", json={"user": current_user.profile_id})
    response = r.json()
    response['ack'] = True
    return response


@socketio.on('disconnect')
def client_disconnected():
    if current_user.is_authenticated:
        print(current_user.profile_id)
        connections.remove(current_user.profile_id)
        leave_room(current_user.profile_id)
    else:
        print("Anon")
        connections.remove("Anon")
    print(connections)
