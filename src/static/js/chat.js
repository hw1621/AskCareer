let modalBtn = document.getElementById("chat-modal-btn");
let modal = document.getElementById("chat-modal");

let metas = document.getElementsByTagName('meta')
let profileId = metas.namedItem("user_profile_id").content

let socket = io();

refreshNavBar();
fetchOverview();

let currentChat = "";
if (getCookie('currentChat') !== null) {
    currentChat = getCookie('currentChat');
    refreshChat();
    document.getElementById("profile-photo-in-chat").onclick = () => {
        if(profileModal.style.display !== "block") {
            showProfile(currentChat);
        }
    }
    getProfilePhoto(currentChat).then((image_url) => {
        document.getElementById("profile-photo-in-chat").src = image_url;
        modal.style.display = "block";
    }).catch((error) => {
        console.log(error);
    });
}
if (currentChat === "") {
    modal.style.display="none";
}

modalBtn.addEventListener(
    "click", (event) => {
        let profileEl = document.getElementById("profile-photo-in-chat");
        if (!profileEl.contains(event.target)) {
            openChatBox();
        }
    }
);

socket.on('connect', () => {
    console.log('socket connected');
});

socket.on('new_message', (data) => {
    refreshNavBar();
    console.log(data)
    if (data["by"] === currentChat) {
        displayMessage(data);
        readChat();
        refreshNavBar();
    }
    fetchOverview();
});

let msgBox = document.getElementById("send-box-text")

msgBox.addEventListener("keydown", function(e) {
    if (e.code === "Enter" && !e.shiftKey) {sendMsg();}
});

function getCookie(currentChat) {
    let cookieArr = document.cookie.split(";");
    for (const element of cookieArr) {
        let cookiePair = element.split("=");
        if(currentChat === cookiePair[0].trim()) {
            return decodeURIComponent((cookiePair[1]))
        }
    }
    return null;
}
function openChatBox() {
    if (currentChat !== "") {
        modalBtn.classList.toggle("active");

        let updownSymbol = document.getElementById("chat-modal-updown-symbol");
        updownSymbol.classList.toggle("bi-chevron-double-up");
        updownSymbol.classList.toggle("bi-chevron-double-down");

        let content = document.getElementById("chat-content");
        if (content.style.display === "block") {
            modal.style.height = "5vh";
            content.style.display = "none";
        } else {
            modal.style.height = "50vh";
            content.style.display = "block";
        }

        readChat();
        refreshNavBar();
    }
}

function loadChat(profile) {
    let encodeProfile = encodeURIComponent(profile);
    document.cookie = "currentChat=" + encodeProfile + ";" + "max-age=86400; path=/;"
    console.log(document.cookie.toString())
    currentChat = profile;
    refreshChat();
    openChatBox();
    console.log(currentChat);
    document.getElementById("profile-photo-in-chat").onclick = () => {
        if(profileModal.style.display !== "block") {
            showProfile(profile);
        }
    }
    getProfilePhoto(profile).then((image_url) => {
        document.getElementById("profile-photo-in-chat").src = image_url;
        modal.style.display = "block";
    }).catch((error) => {console.log(error);});
}

function displayMessage(message) {
    // message object = {"by": "person-profileid", "content": "text", "timestamp": "time"}
    let chatArea = document.getElementById("chat-message-div");
    let msg = document.createTextNode(message["content"]);
    let msgField = document.createElement("div");
    console.log(message);
    msgField.className = "msg-field";
    if (profileId === message["by"]) {
        msgField.classList.add("right-msg");
    } else {
        msgField.classList.add("left-msg");
    }
    msgField.appendChild(msg);
    let firstMessage = chatArea.children[0];
    chatArea.insertBefore(msgField, firstMessage);
}

function readChat(_callback = (_) => {}) {
    socket.emit('request_load_chat', {other: currentChat}, _callback);
}

function refreshChat() {
    const url = 'https://drp26backend.herokuapp.com/profiles/' + currentChat;
    fetch(url).then(function getJson(response) {
        console.assert(response.ok, 'Response was not ok.')
        return response.json();
    }).then(function(profileData) {
        let name = profileData["name"];
        document.getElementById("chat-name").innerHTML = name;
    }).catch((err) => {console.log(err);});
    readChat((data) => {
        console.log(data);
        let chatMessageDiv = document.getElementById("chat-message-div");
        chatMessageDiv.innerHTML = "";
        for (const i of data["messages"]) {
            displayMessage(i);
        }
    });
}

function refreshNavBar() {
    socket.emit('request_unread', {}, (data) => {
        numberUnreadMessages(data["unread"]);
    });
}

function fetchOverview() {
    socket.emit('request_chats_overview', {}, loadChatOverview);
}

function sendMsg() {
    let msg = msgBox.value;
    if (currentChat !== "" && msg !== "") {
        console.log(msg);
        msgBox.value = '';
        displayMessage({"by": profileId, "content": msg, "timestamp": "time"})

        socket.emit('send_msg', {"content": msg, "recipient": currentChat}, (ack) => {
            if (ack["ack"]) {
                console.log("message sent: " + msg);
            } else {
                console.log("message failed to send");
            }
        });
    }
    fetchOverview();
}