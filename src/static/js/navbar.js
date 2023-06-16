const dropdowns = document.getElementsByClassName("dropdown navbar-item");

for (const element of dropdowns) {
    let dropbtn = element.getElementsByClassName("dropbtn")[0];
    dropbtn.addEventListener("click", function () {
        let dropdownContent = this.nextElementSibling;
        dropbtn.classList.toggle("active");
        dropdownContent.classList.toggle("show");
        for (const element of dropdowns) {
            if (element !== this.parentElement) {
                let dropbtn = element.getElementsByClassName("dropbtn")[0];
                if (dropbtn.classList.contains('active')) {
                    dropbtn.classList.remove('active');
                }
                let dropdownContent = element.getElementsByClassName("dropdown-content")[0];
                if (dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                }
            }
        }
    });
}

window.addEventListener("click",  function (event) {
    if (event.target.closest('.dropbtn') == null) {
        for (const element of dropdowns) {
            let dropbtn = element.getElementsByClassName("dropbtn")[0];
            if (dropbtn.classList.contains('active')) {
                dropbtn.classList.remove('active');
            }
            let dropdownContent = dropbtn.nextElementSibling;
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        }
    }
});

function numberUnreadMessages(unread) {
    let badge = document.getElementById("navbar-msg-badge");
    let num = document.getElementById("navbar-badge-num-unread")
    if (unread === 0) {
        badge.style.display="none";
    } else {
        console.log("unread: " + unread);
        num.textContent = unread;
        badge.style.display="block";
    }
}

function loadChatOverview(data) {
    let chatOverview = document.getElementById("chat-drop-content");
    if (data["overview"].length !== 0) {
        chatOverview.innerHTML = "";
    }
    for (const i of data["overview"]) {
        let message = i["last"]["content"];
        if (message.length > 15) {
            message = message.substring(0, 15) + "...";
        }
        let htmlCode =      "<div class=\"chat-overview-head\">\n" +
                                        "<div class=\"chat-overview-img-container\">\n" +
                                            `<img class="chat-overview-img" alt="" src="${i["otherPersonImage"]}"/>\n` +
                                        "</div>\n" +
                                        "<div class=\"chat-overview-text\">\n" +
                                            `<div class="chat-overview-name">${i["otherPersonName"]}</div>\n` +
                                            `<div class="chat-overview-last-msg">${message}</div>\n` +
                                        "</div>\n" +
                                    "</div>\n" +
                                    "<div class=\"chat-overview-notifications\">\n" +
                                        `<div class="chat-overview-notification-badge">${i["unread"]}</div>\n` +
                                    "</div>\n"
        let newDiv = document.createElement("div");
        newDiv.classList.add("single-chat-overview");
        newDiv.onclick = function() {loadChat(i["otherPerson"])};
        newDiv.innerHTML = htmlCode;
        newDiv.getElementsByClassName("chat-overview-notification-badge")[0].style.display = i["unread"] === 0 ? "none" : "block";
        chatOverview.insertBefore(newDiv, null);
    }
}

let myProfileId = "{{current_user.profile_id}}"
const backend_url = 'https://drp26backend.herokuapp.com/profiles/' + myProfileId;
fetch(backend_url).then(function getJson(response) {
    console.assert(response.ok, 'Response was not ok.');
    return response.json();
    }).then(function writeData(data) {
    let image_url = data['profilePhotoString'];
    return image_url;
}).then((image_url) => {
    document.getElementById("profile-photo-in-navbar").src = image_url;
}).catch((error) => {console.log(error)});