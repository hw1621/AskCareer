from flask_socketio import join_room, emit, leave_room

from .app import socketio, current_user, request

connections = []


def socket_event_connection_check():
    print("SocketIO events loaded")


@socketio.on('connect')
def connection():
    connections.append(current_user.id if current_user.is_authenticated else "Anon")
    new_room = current_user.id if current_user.is_authenticated else "Anon"
    join_room(new_room)

@socketio.on('send_msg')
def send_message(data):
    print("received message:", data)
    return True


@socketio.on('disconnect')
def client_disconnected():
    if current_user.is_authenticated:
        print(current_user.id)
        connections.remove(current_user.id)
        leave_room(current_user.id)
    else:
        print("Anon")
        connections.remove("Anon")
        print(connections)
