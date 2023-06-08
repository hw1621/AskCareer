let modalBtn = document.getElementById("chat-modal-btn");
let modal = document.getElementById("chat-modal");

function openChatBox() {
    modalBtn.classList.toggle("active");

    let updownSymbol = document.getElementById("chat-modal-updown-symbol");
    updownSymbol.classList.toggle("bi-chevron-double-up");
    updownSymbol.classList.toggle("bi-chevron-double-down");

    let content = modalBtn.nextElementSibling;
    if (content.style.display === "block") {
        modal.style.height = "5vh";
        content.style.display = "none";
    } else {
        modal.style.height = "50vh";
        content.style.display = "block";
    }
}

modalBtn.addEventListener("click", openChatBox);

let socket = io();
socket.on('connect', () => {
    console.log('socket connected');
});

let msgBox = document.getElementById("send-box-text")

msgBox.addEventListener("keydown", function(e) {
    if (e.code === "Enter" && !e.shiftKey) {sendMsg();}
});

function sendMsg() {
    let msg = msgBox.value;
    console.log(msg);
    msgBox.value = '';

    socket.emit('send_msg', {"msg": msg}, (ack) => {
        if (ack) {
            console.log("message sent: " + msg);
        } else {
            console.log("message failed to send");
        }
    });
}