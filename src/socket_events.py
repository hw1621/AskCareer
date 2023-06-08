from flask_socketio import join_room, emit, leave_room

from .app import socketio, current_user

connections = []


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
    return True


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
