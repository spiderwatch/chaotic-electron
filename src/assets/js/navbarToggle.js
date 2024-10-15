let isActive = false;

function toggleNav() {
    const navbarMenu = document.querySelector("#navbarMenu");
    const navHamburger = document.querySelector(".navHamburger svg");
    const pageFull = document.querySelector("#pageFull");
    const page = document.querySelector("#page");
    const body = document.querySelector("body");

    if (window.innerWidth < 1200){
        isActive = !isActive;
        if (isActive){
            document.querySelector("head > meta[name=\"theme-color\"]").setAttribute("content", "#111111");
        }
        if (!isActive) {
            document.querySelector("head > meta[name=\"theme-color\"]").setAttribute("content", "#222222");
        }
        navHamburger.classList.toggle("fa-times");
        navHamburger.classList.toggle("fa-bars");
        navbarMenu.classList.toggle("navActive");
        page.classList.toggle("navActive");
        body.classList.toggle("navActive");
    }
}

document.querySelector(".navHamburger").addEventListener("click", toggleNav);