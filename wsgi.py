from src.app import app, socketio
from src import socket_events

if __name__ == '__main__':
    socket_events.socket_event_connection_check()
    socketio.run(app, debug=True)
