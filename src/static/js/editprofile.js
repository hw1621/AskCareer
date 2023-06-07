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
    } else {
        document.getElementById("work-experience").style.display = "block";
        document.getElementById("work-buttons").style.display = "block";
    }
}