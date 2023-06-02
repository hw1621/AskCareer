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