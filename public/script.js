const LOADER_HTML = `
 <div class="loader"></div>
`

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

document.addEventListener('DOMContentLoaded', async (e) => {

    // Initial DOM Setup

    // Sidebar Toggle
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    const sidebarOverlay = document.getElementById("sidebar-overlay");

    const toggleIconOpenClass = "sidebar-toggle nav-open fa-solid fa-angle-left";
    const toggleIconCloseClass = "sidebar-toggle fa-solid fa-angle-right";

    const toggleSidebar = () => {
        const isOpen = sidebarWrapper.classList.contains("nav-open");
        if (isOpen) {
            sidebarWrapper.classList.remove("nav-open");
            sidebarToggle.className = toggleIconCloseClass;
            enableScroll();
        } else {
            sidebarWrapper.classList.add("nav-open");
            sidebarToggle.className = toggleIconOpenClass;
            disableScroll();
        }
    }

    const disableScroll = () => {
        document.body.classList.add("disable-scroll");
    }

    const enableScroll = () => {
        document.body.classList.remove("disable-scroll");
    }

    // Sidebar Toggle with toggle icon
    if (sidebarToggle && sidebarWrapper) {
        sidebarToggle.addEventListener("click", async (e) => {
            toggleSidebar();
        });
    }

    // Sidebar Toggle with overlay
    if (sidebarOverlay && sidebarWrapper) {
        sidebarOverlay.addEventListener("click", async (e) => {
            toggleSidebar();
        });
    }

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

    // Popup Close
    const popupWrapper = document.getElementById("popup-wrapper");
    popupWrapper.addEventListener("click", async (e) => {
        const popup = e.target.closest(".popup");
        const popupButton = e.target.closest(".popup-btn");

        if (!popup || popupButton) {
            hidePopup();
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

            showPopup(null, "neutral", "neutral", true, "OK");
            await wait(2000); // Do the API call here (currently simulated with a wait)
            showPopup("Country Access Settings Updated", "success", "success", false, "OK");
        });
    }

    // Handle Add Country Form Submission
    const countryAddForm = document.getElementById("country-add");
    if (countryAddForm) {
        countryAddForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(countryAddForm);
            const data = Object.fromEntries(formData.entries());

            const countryCode = data["countrycode"];

            console.log(data);
            // console.log(countryCode);

            showPopup(null, "neutral", "neutral", true, "OK");
            await wait(2000); // Do the API call here (currently simulated with a wait)
            showPopup("Country Added Successfully", "success", "success", false, "OK");
        });
    }

    // Handle Remove Country
    const countriesList = document.getElementById("countries-list");
    if (countriesList) {
        countriesList.addEventListener("click", async (e) => {
            const countryElement = e.target.closest(".country-item");
            if (!countryElement) return;

            const removeButton = e.target.closest(".country-del-btn");
            if (!removeButton) return;

            const countryCode = countryElement.dataset["countrycode"];
            console.log(countryCode);

            showPopup(null, "neutral", "neutral", true, "OK");
            await wait(2000); // Do the API call here (currently simulated with a wait)
            showPopup("Country Removed Successfully", "success", "success", false, "OK");
        });
    }
});

const BASE_POPUP_ICON_CLASS = "popup-icon";
const BASE_POPUP_CLASS = "popup";
const iconClassMap = {
    success: `${BASE_POPUP_ICON_CLASS} fa-solid fa-circle-check`,
    error: `${BASE_POPUP_ICON_CLASS} fa-solid fa-circle-exclamation`,
    error2: `${BASE_POPUP_ICON_CLASS} fa-solid fa-triangle-xmark`,
    neutral: `${BASE_POPUP_ICON_CLASS} fa-solid fa-circle-info`
};

const showPopup = (text = "Click OK to close popup", status = "neutral", icon = "neutral", loading, buttonText = "OK") => {
    const popupWrapper = document.getElementById("popup-wrapper");

    if (!popupWrapper) return;

    popupWrapper.dataset["status"] = status;
    popupWrapper.dataset["loading"] = loading ? "true" : "false";
    popupWrapper.classList.remove("display-none");

    const popup = popupWrapper.querySelector(".popup");
    const popupIcon = popup.querySelector(`.${BASE_POPUP_ICON_CLASS}`);
    const popupText = popup.querySelector(".popup-text");
    const popupButton = popup.querySelector(".popup-btn");

    const iconClass = iconClassMap[icon] || iconClassMap[status] || iconClassMap["neutral"];

    const popupClass = `${BASE_POPUP_CLASS} ${status}`;

    popup.className = popupClass;
    popupIcon.className = iconClass;
    popupText.innerHTML = loading ? LOADER_HTML : text;
    popupButton.disabled = loading ? true : false;
    popupButton.textContent = buttonText || "OK";
}

const hidePopup = () => {
    const popupWrapper = document.getElementById("popup-wrapper");
    if (!popupWrapper) return;

    const popupLoading = popupWrapper.dataset["loading"] === "true" ? true : false;

    if (popupLoading) {
        return;
    }

    if (popupWrapper) {
        popupWrapper.classList.add("display-none");
    }
}