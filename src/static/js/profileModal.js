function showProfile(userId) {
    loadProfile(userId, function () {
        document.querySelector('dialog').showModal();
    });
}

function hideProfile() {
    document.querySelector('dialog').close();
    clearProfile();
}

function loadProfile(userId, _callback) {
    const url = 'https://drp26backend.herokuapp.com/profiles/' + userId;
    fetch(url).then(function getJson(response) {
        console.assert(response.ok, 'Response was not ok.')
        return response.json();
    }).then(function writeData(data) {
        document.getElementById('profile-name').innerHTML = data['name'];
        document.getElementById('profile-email').innerHTML = data['email'];
    }).catch(function makeError(error) {
        console.log(error);
    }).then(_callback);
}
function clearProfile() {
    document.getElementById('profile-name').innerHTML = ' ';
    document.getElementById('profile-email').innerHTML = ' ';
    document.getElementById('profile-info').innerHTML = ' ';
}

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
    if (content.style.maxHeight){
        content.style.padding = "0";
        content.style.maxHeight = null;
    } else {
        content.style.padding = "0.3vw";
        content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}