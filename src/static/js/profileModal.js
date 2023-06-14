let profileModal = document.getElementById('profile-modal');

function showProfile(userId) {
    loadProfile(userId, function () {
        profileModal.style.display = "block";
    });
}

function hideProfile() {
    profileModal.style.display = "none";
    clearProfile();
}

function loadProfile(userId, _callback) {
    const url = 'https://drp26backend.herokuapp.com/profiles/' + userId;
    fetch(url).then(function getJson(response) {
        console.assert(response.ok, 'Response was not ok.')
        return response.json();
    }).then(function writeData(data) {
        var image_url = data['profilePhotoString'];
        console.log(image_url);
        document.getElementById('profile-image').src = image_url;
        document.getElementById('profile-name').innerHTML = data['name'];
        document.getElementById('profile-email').innerHTML = data['email'];
        document.getElementById('chatbtn').onclick = () => {loadChat(userId)};
        let education = data["educationHistory"];
        for (const element of education) {
            const edEntry = document.createElement("div");
            edEntry.className = "ed-entry";

            const edName = document.createElement("div");
            edName.className = "ed-name";
            const institution = element["institution"];
            const schoolName = document.createTextNode(institution);
            edName.appendChild(schoolName);
            edEntry.insertBefore(edName, null);

            const edGrade = document.createElement("div");
            edGrade.className = "ed-grade";
            const studyType = element["studyType"];
            const gradeType = document.createTextNode(studyType)
            edGrade.appendChild(gradeType);
            edEntry.insertBefore(edGrade, null);

            document.getElementById("education").insertBefore(edEntry, null);
        }

        let workHistory = data["workHistory"]
        for (const element of workHistory) {
            const workEntry = document.createElement("div");
            workEntry.className = "work-entry";

            const button = document.createElement("button");
            button.type = "button";
            button.className = "collapsible";

            const workName = document.createElement("div");
            workName.className = "work-name";
            const company = element["company"];
            const companyName = document.createTextNode(company);
            workName.appendChild(companyName);
            button.insertBefore(workName, null);

            const workTitle = document.createElement("div");
            workTitle.className = "work-title";
            const title = element["position"];
            const position = document.createTextNode(title);
            workTitle.appendChild(position);
            button.insertBefore(workTitle, null);

            workEntry.insertBefore(button, null);

            const summary = document.createElement("div");
            summary.className = "collapsible-content";
            const content = element["summary"];
            const summaryContent = document.createTextNode(content);
            summary.appendChild(summaryContent);
            workEntry.insertBefore(summary, null);

            document.getElementById("work-experience").insertBefore(workEntry, null);

            button.addEventListener("click", function() {
                this.classList.toggle("active");
                let content = this.nextElementSibling;
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
    }).then(_callback).catch(function makeError(error) {
        console.log(error);
    });
}

function clearProfile() {
    document.getElementById('profile-name').innerHTML = ' ';
    document.getElementById('profile-email').innerHTML = ' ';
    document.getElementById('education').innerHTML = ' ';
    document.getElementById('work-experience').innerHTML = ' ';
}

function getProfilePhoto(profileId) {
    console.log(profileId);
    const backend_url = 'https://drp26backend.herokuapp.com/profiles/' + profileId;
    const url = await fetch(backend_url).then(function getJson(response) {
        console.assert(response.ok, 'Response was not ok.')
        return response.json();
    }).then(function writeData(data) {
        var image_url = data['profilePhotoString'];
        return image_url;
    });
    return url;
}