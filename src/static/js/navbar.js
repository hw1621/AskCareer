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
        console.log(event.target);
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