let profileID = document.getElementsByTagName('meta').namedItem("user_profile_id").content

function fillProfile() {
    const url = 'https://drp26backend.herokuapp.com/profiles/' + profileID;
    fetch(url).then(
        (response) => response.json()
    ).then(function writeData(data) {
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
        if (data["hasExperience"] === true) {
            document.getElementById("experienced").checked = true;
            document.getElementById("not-experienced").checked = false;
            const workFields = data["workHistory"];
            if (!(workFields === undefined || workFields === null || workFields.length === 0)) {
                for (let i = 1; i < workFields.length; i++) {
                    createWorkField();
                    document.getElementsByName("company")[i + 1].value = workFields[i]["company"];
                    document.getElementsByName("title")[i + 1].value = workFields[i]["position"];
                    document.getElementsByName("summary")[i + 1].value = workFields[i]["summary"];
                    document.getElementsByName("start-date")[i + 1].value = workFields[i]["start"];
                    document.getElementsByName("end-date")[i + 1].value = workFields[i]["end"];
                }
                document.getElementsByName("company")[1].value = workFields[0]["company"];
                document.getElementsByName("title")[1].value = workFields[0]["position"];
                document.getElementsByName("summary")[1].value = workFields[0]["summary"];
                document.getElementsByName("start-date")[1].value = workFields[0]["start"];
                document.getElementsByName("end-date")[1].value = workFields[0]["end"];
            }
        } else {
            document.getElementById("not-experienced").checked = true;
            document.getElementById("experienced").checked = false;
            hideWorkEntry();
        }
    }).catch(function (error) {
        console.log(error);
    });
}

fillProfile();

function createWorkField() {
    const node = document.getElementById("clone-work-experience").childNodes[1];
    console.log(node);
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
        lastEduField.remove();
    }
}

function hideWorkEntry() {
    if (document.getElementById("not-experienced").checked) {
        if (document.getElementById("work-experience") !== null) {
            document.getElementById("work-experience").remove();
        }
    } else if (document.getElementById("work-experience") === null) {
        const node = document.getElementById("clone-work-experience");
        const clone = node.cloneNode(true);
        clone.id = "work-experience";
        clone.style.display = "block";
        document.getElementById("form").insertBefore(clone, document.getElementById("work-buttons"));
    }
}

hideWorkEntry();