document.addEventListener('DOMContentLoaded', async (e) => {

    // Initial DOM Setup

    // Sidebar Switcher
    const navMenu = document.getElementById("nav-menu");
    const mainContents = document.querySelectorAll(".main-content");
    const sideLinks = document.querySelectorAll(".side-link");

    navMenu.addEventListener("click", async (e) => {
        const button = e.target.closest(".nav-btn");
        const sideLink = e.target.closest(".side-link");

        if (!button) return;

        if (sideLink && sideLinks.length > 0) {
            sideLinks.forEach(link => {
                link.classList.remove("active");
            });
            sideLink.classList.add("active");
        }

        const mainContentId = button.dataset["content"];
        const mainContent = document.getElementById(mainContentId);

        if (mainContent && mainContents.length > 0) {
            mainContents.forEach(content => {
                content.classList.add("display-none");
            });
            mainContent.classList.remove("display-none");
        }
    });


    // Redirect URL Check
    const redirectUrlCheck = document.getElementById("redirect-url-check");
    const redirectUrlInput = document.getElementById("redirect-url-input");

    if (redirectUrlCheck && redirectUrlInput) {

        redirectUrlCheck.addEventListener("click", async (e) => {
            const checkInput = document.getElementById("redirect-url-check");
            const checkInputChecked = checkInput.checked;
            if (checkInputChecked) {
                redirectUrlInput.classList.remove("display-none");
                redirectUrlInput.focus();
            } else {
                redirectUrlInput.classList.add("display-none");
            }
        });
    }

    // Handle Country Access Form Submission
    const countryAccessForm = document.getElementById("country-access");

    if (countryAccessForm) {

        countryAccessForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(countryAccessForm);
            const data = Object.fromEntries(formData.entries());

            const countryEnabled = data["countryEnabled"] === "on";
            const redirectEnabled = data["redirectEnabled"] === "on";
            const redirectUrl = data["redirectUrl"];

            console.log(countryEnabled);
            console.log(redirectEnabled);
            console.log(redirectUrl);
        });
    }
});