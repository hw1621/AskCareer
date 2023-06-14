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
