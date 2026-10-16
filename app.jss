
/* =====================================================
   EMMANUEL OUKO | TSM REFERRAL HUB
   Navigation, WhatsApp, Email and Animations
===================================================== */


/* 1. CONTACT DETAILS */

const WHATSAPP_NUMBER = "254142617814";
const CONTACT_EMAIL = "emmanuelouko21@gmail.com";


/* 2. WHATSAPP REFERRAL MESSAGE */

const WHATSAPP_MESSAGE =
    "Hello Emmanuel Ouko! I am interested in learning about Tech Space Masters (TSM). Please explain the official registration process, current membership fees and terms. I would also like guidance on contacting the appropriate TSM leader.";


/* 3. CREATE WHATSAPP LINK */

function createWhatsAppLink() {
    const number = WHATSAPP_NUMBER.replace(/\D/g, "");

    // Kenya international mobile format: 254 followed by 9 digits.
    if (!/^254\d{9}$/.test(number)) {
        console.warn(
            "Please check WHATSAPP_NUMBER in app.js. " +
            "Use country code 254 followed by 9 digits."
        );

        return "https://wa.me/?text=" +
            encodeURIComponent(WHATSAPP_MESSAGE);
    }

    return "https://wa.me/" +
        number +
        "?text=" +
        encodeURIComponent(WHATSAPP_MESSAGE);
}


/* 4. CONNECT WHATSAPP BUTTONS */

function setupWhatsAppButtons() {
    const buttonIds = [
        "whatsappButton",
        "whatsappTop",
        "whatsappBottom"
    ];

    const whatsappLink = createWhatsAppLink();

    buttonIds.forEach(function (id) {
        const button = document.getElementById(id);

        if (!button) return;

        button.href = whatsappLink;
        button.target = "_blank";
        button.rel = "noopener noreferrer";
    });
}


/* 5. SET UP EMAIL LINKS */

function setupEmailLinks() {
    const emailLinks = document.querySelectorAll(
        'a[href^="mailto:"]'
    );

    emailLinks.forEach(function (link) {
        const existingHref = link.getAttribute("href") || "";

        // Preserve an existing email subject or other query parameters.
        const queryIndex = existingHref.indexOf("?");

        const emailOptions = queryIndex !== -1
            ? existingHref.slice(queryIndex)
            : "";

        link.href =
            "mailto:" + CONTACT_EMAIL + emailOptions;
    });
}


/* 6. AUTOMATIC COPYRIGHT YEAR */

function updateCopyrightYear() {
    const yearElement =
        document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }
}


/* 7. MOBILE NAVIGATION MENU */

function setupMobileMenu() {
    const menuToggle =
        document.getElementById("menuToggle");

    const navbar =
        document.getElementById("mainNavbar");

    if (!menuToggle || !navbar) return;

    const menuIcon = menuToggle.querySelector("i");

    function setMenuState(isOpen) {
        navbar.classList.toggle("active", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

        if (menuIcon) {
            menuIcon.classList.toggle(
                "fa-bars",
                !isOpen
            );

            menuIcon.classList.toggle(
                "fa-xmark",
                isOpen
            );
        }
    }

    menuToggle.addEventListener("click", function () {
        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        setMenuState(!isOpen);
    });

    // Close the menu after a navigation link is selected.
    navbar.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function () {
            setMenuState(false);
        });
    });

    // Close with Escape.
    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            menuToggle.getAttribute("aria-expanded") === "true"
        ) {
            setMenuState(false);
            menuToggle.focus();
        }
    });

    // Close when clicking outside the navigation.
    document.addEventListener("click", function (event) {
        const clickedInsideMenu =
            navbar.contains(event.target) ||
            menuToggle.contains(event.target);

        if (!clickedInsideMenu) {
            setMenuState(false);
        }
    });

    // If the screen becomes desktop-sized, reset the mobile menu.
    window.addEventListener("resize", function () {
        if (window.innerWidth > 800) {
            setMenuState(false);
        }
    });

    // Start with the mobile menu closed.
    setMenuState(false);
}


/* 8. SMOOTH NAVIGATION */

function setupNavigation() {
    const navigationLinks = document.querySelectorAll(
        '.navbar a[href^="#"], .logo[href^="#"], ' +
        '.nav-button[href^="#"], .footer-links a[href^="#"], ' +
        '.back-to-top[href^="#"], .hero-actions a[href^="#"]'
    );

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            let targetSection;

            try {
                targetSection = document.querySelector(targetId);
            } catch (error) {
                return;
            }

            if (!targetSection) return;

            event.preventDefault();

            targetSection.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });

            // Update the URL hash without adding a new history entry.
            if (window.location.hash !== targetId) {
                history.replaceState(null, "", targetId);
            }
        });
    });
}


/* 9. SCROLL REVEAL ANIMATIONS */

function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        ".about-card, .feature-card, .step-card, " +
        ".contact-card, .information-panel, " +
        ".join-cta, .contact-note"
    );

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        reduceMotion ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    const observer = new IntersectionObserver(
        function (entries, currentObserver) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -25px 0px"
        }
    );

    animatedElements.forEach(function (element, index) {
        element.classList.add("reveal");

        // A small staggered delay creates a polished effect.
        element.style.transitionDelay =
            (index % 3) * 90 + "ms";

        observer.observe(element);
    });
}


/* 10. PREVENT EMPTY INTERNAL LINKS */

function setupSafeLinks() {
    document.querySelectorAll('a[href="#"]').forEach(function (link) {
        // WhatsApp buttons receive a URL in setupWhatsAppButtons().
        if (link.id === "whatsappButton") return;

        link.addEventListener("click", function (event) {
            event.preventDefault();
        });
    });
}


/* 11. INITIALIZE WEBSITE */

document.addEventListener("DOMContentLoaded", function () {
    setupWhatsAppButtons();
    setupEmailLinks();
    updateCopyrightYear();
    setupMobileMenu();
    setupNavigation();
    setupScrollAnimations();
    setupSafeLinks();

    console.log(
        "Emmanuel Ouko's TSM Referral Hub is ready."
    );
});
