// let metas = document.getElementsByTagName('meta')
// let profileId = metas.namedItem("user_profile_id").content
let profileId = "6f1c38f0-cb79-4d4c-b4db-acc7fec56934";

function fillProfile() {
    const url = 'https://drp26backend.herokuapp.com/profiles/' + profileId;
    fetch(url).then(function getJson(response) {
        return response.json();
    }) .then(function writeData(data) {
        document.getElementById("name").value = data["name"];
        document.getElementById("email").value = data["email"];

        const educationFields = data["educationHistory"];
        for (let i = 1; i < educationFields.length; i++) {
            createEducationField();
            document.getElementsByName("school-name")[i].value = educationFields[i]["institution"];
            document.getElementsByName("degree")[i].value = educationFields[i]["studyType"];
            document.getElementsByName("start-date-edu")[i].value = educationFields[i]["start"];
            document.getElementsByName("end-date-edu")[i].value = educationFields[i]["end"];
        }
        document.getElementsByName("school-name")[0].value = educationFields[0]["institution"];
        document.getElementsByName("degree")[0].value = educationFields[0]["studyType"];
        document.getElementsByName("start-date-edu")[0].value = educationFields[0]["start"];
        document.getElementsByName("end-date-edu")[0].value = educationFields[0]["end"];

        const workFields = data["workHistory"];
        for (let i = 1; i < workFields.length; i++) {
            createWorkField();
            document.getElementsByName("company")[i].value = workFields[i]["company"];
            document.getElementsByName("title")[i].value = workFields[i]["position"];
            document.getElementsByName("summary")[i].value = workFields[i]["summary"];
            document.getElementsByName("start-date")[i].value = workFields[i]["start"];
            document.getElementsByName("end-date")[i].value = workFields[i]["end"];
        }
        document.getElementsByName("company")[0].value = workFields[0]["company"];
        document.getElementsByName("title")[0].value = workFields[0]["position"];
        document.getElementsByName("summary")[0].value = workFields[0]["summary"];
        document.getElementsByName("start-date")[0].value = workFields[0]["start"];
        document.getElementsByName("end-date")[0].value = workFields[0]["end"];
    })
}

fillProfile();

function createWorkField() {
    const node = document.getElementById("work-experience").childNodes[1];
    const clone = node.cloneNode(true);
    let inputs = clone.getElementsByTagName("input");
    for (const element of inputs) {
        element.value = "";
    }
    for (const element of clone.getElementsByTagName("textarea")) {
        element.value = "";
    }
    document.getElementById("work-experience").appendChild(clone);
}

function createEducationField() {
    const child = document.getElementById("education").childNodes[1];
    const clone = child.cloneNode(true);
    let inputs = clone.getElementsByTagName("input");
    for (const element of inputs) {
        element.value = "";
    }
    for (const element of clone.getElementsByTagName("textarea")) {
        element.value = "";
    }
    document.getElementById("education").appendChild(clone);
}

function deleteEducationField() {
    const length = document.getElementById("education").childNodes.length;
    const lastEduField = document.getElementById("education").childNodes[length-1];
    if (length > 2) {
        console.log(length);
        lastEduField.remove();
    }
}

function deleteWorkField() {
    const length = document.getElementById("work-experience").childNodes.length;
    const lastEduField = document.getElementById("work-experience").childNodes[length-1];
    if (length > 2) {
        console.log(length);
        lastEduField.remove();
    }
}

function hideWorkEntry() {
    if (document.getElementById("not-experienced").checked) {
        document.getElementById("work-experience").style.display = "none";
        document.getElementById("work-buttons").style.display = "none";
        const names = document.getElementsByName("company");
        for (let i = 0; i < names.length; i++) {
            names[i].required = false;
        }
        const titles = document.getElementsByName("title");
        for (let i = 0; i < titles.length; i++) {
            titles[i].required = false;
        }
        const summaries = document.getElementsByName("summary");
        for (let i = 0; i < summaries.length; i++) {
            summaries[i].required = false;
        }
        const startDates = document.getElementsByName("start-date");
        for (let i = 0; i < startDates.length; i++) {
            startDates[i].required = false;
        }
        const endDates = document.getElementsByName("end-date");
        for (let i = 0; i < endDates.length; i++) {
            endDates[i].required = false;
        }
    } else {
        document.getElementById("work-experience").style.display = "block";
        document.getElementById("work-buttons").style.display = "block";
    }
}