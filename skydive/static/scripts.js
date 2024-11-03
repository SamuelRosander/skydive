// Dismiss an element by adding the "invisible" class to its parent node
function dismiss(element) {
    element.parentNode.classList.add("invisible");
}

// Hide flashes after the transition ends
const flashes = document.getElementsByClassName("flash");
for (let i = 0; i < flashes.length; i++) {
    flashes[i].addEventListener("transitionend", () => {
        flashes[i].style.display = "none";
    });
}

// Get the second-to-last segment of the current page's path (last one is empty)
const getCurrentPageSegment = () => {
    const pathSegments = window.location.pathname.split("/");
    return pathSegments[pathSegments.length - 2];
};

// Get the current page's segment
const currentPage = getCurrentPageSegment();

// Highlight the current page in the navbar
document.querySelectorAll("#navbar a").forEach((link) => {
    const linkPathSegments = link.getAttribute('href').split("/");
    const linkPageSegment = linkPathSegments[linkPathSegments.length - 2];

    if (linkPageSegment === currentPage) {
        link.classList.add("active");
    }
});


// Toggle visibility of the menu when using mobile layout
function toggleMenu() {
    const navbar = document.getElementById("navbar");
    navbar.classList.toggle("visible");
}

// Toggle Logbook sub meenu in the navbar and rotating the chevron
function toggleLogbookSubmenu() {
    const submenu = document.getElementById("logbook-submenu");
    submenu.classList.toggle("visible");

    if (submenu.classList.contains("visible")) {
        document.getElementById("logbook-submenu-toggle").innerHTML = "&#x25B2;"
    }
    else {
        setTimeout(() => {
            if (!submenu.classList.contains("visible")) {
                document.getElementById("logbook-submenu-toggle").innerHTML = "&#x25BC;";
            }
        }, 350);
    }
}

// Show Logbook submenu if the current page is "import" or "export" on page load
document.addEventListener("DOMContentLoaded", () => {
    const submenu = document.getElementById("logbook-submenu");
    const toggleButton = document.getElementById("logbook-submenu-toggle");

    // Check if currentPage is "import" or "export"
    if (window.location.pathname.split("/")[1] === "logbook") {
        // Temporarily disable transition
        submenu.style.transition = "none";
        
        // Make submenu visible without transition
        submenu.classList.add("visible");
        toggleButton.innerHTML = "&#x25B2;"; // Set the chevron to point up
        
        // Re-enable transition after a short delay to allow for initial visibility
        setTimeout(() => {
            submenu.style.transition = ""; // Revert to the default CSS transition
        }, 0);
    }
});

// Increment or decrement a number in a field with a minimum value of 0
function changeNum(target, delta) {
    const field = document.getElementById(target);
    field.value = Math.max(0, Math.floor(Number(field.value) + Number(delta)));
}

// Close the navbar if clicking outside of the menu or menu button
document.onclick = function (e) {
    const valuesToCheck = ['menu-button', 'navbar'];
    const clickedElement = e.target;
    const parentIds = getParentIds(clickedElement);

    if (!valuesToCheck.some(value => parentIds.includes(value))) {
        const navbar = document.getElementById("navbar");
        navbar.classList.remove("visible");
    }
};

// Recursively get IDs of an element's ancestors
function getParentIds(element) {
    if (!element) return [];
    const currentId = element.id ? [element.id] : [];
    return currentId.concat(getParentIds(element.parentElement));
}

// Set navbar position below the header based on header height
function adjustNavbarPosition() {
    const header = document.querySelector('.header');
    const navbar = document.querySelector('#navbar');

    // Check if the page width is less than 768px
    if (window.innerWidth < 768) {
        const headerHeight = header.offsetHeight;
        navbar.style.top = `${headerHeight}px`; // Adjust navbar position
    } else {
        navbar.style.top = ""; // Reset the top position if width is 768px or greater
    }
}

// Adjust navbar position on page load and window resize
window.addEventListener('load', adjustNavbarPosition);
window.addEventListener('resize', adjustNavbarPosition);
