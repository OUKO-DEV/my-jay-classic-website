
/* ==============================================
   EMMANUEL OUKO | TSM REFERRAL WEBSITE
   Complete JavaScript
============================================== */


/* 1. CONTACT DETAILS */

const WHATSAPP_NUMBER = "254142617814";
const CONTACT_EMAIL = "emmanuelouko21@gmail.com";


/* 2. WHATSAPP REFERRAL MESSAGE */

const WHATSAPP_MESSAGE =
    "Hello Emmanuel Ouko! I am interested in learning about Tech Space Masters (TSM). Please explain the official registration process, current membership fees and terms. I would also like guidance on contacting the appropriate TSM leader.";


/* 3. CREATE WHATSAPP LINK */

function createWhatsAppLink() {
    const number = WHATSAPP_NUMBER.replace(/\D/g, "");

    if (!/^254\d{9}$/.test(number)) {
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
    const whatsappButtons = [
        document.getElementById("whatsappButton"),
        document.getElementById("whatsappTop"),
        document.getElementById("whatsappBottom")
    ];

    const whatsappLink = createWhatsAppLink();

    whatsappButtons.forEach(function (button) {
        if (button) {
            button.href = whatsappLink;
            button.target = "_blank";
            button.rel = "noopener noreferrer";
        }
    });
}


/* 5. SET UP EMAIL LINKS */

function setupEmailLinks() {
    const emailLinks = document.querySelectorAll(
        'a[href^="mailto:"]'
    );

    emailLinks.forEach(function (link) {
        link.href = "mailto:" + CONTACT_EMAIL;
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


/* 7. SMOOTH NAVIGATION */

function setupNavigation() {
    const navigationLinks = document.querySelectorAll(
        '.navbar a[href^="#"], .logo[href^="#"]'
    );

    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId =
                link.getAttribute("href");

            const targetSection =
                document.querySelector(targetId);

            if (targetSection) {
                event.preventDefault();

                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                history.replaceState(
                    null,
                    "",
                    targetId
                );
            }
        });
    });
}


/* 8. SCROLL REVEAL ANIMATIONS */

function setupScrollAnimations() {
    const animatedElements =
        document.querySelectorAll(
            ".feature-card, .step-card, .contact-box"
        );

    // If unsupported, leave everything visible.
    if (!("IntersectionObserver" in window)) {
        return;
    }

    // Respect visitors who prefer reduced motion.
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
        return;
    }

    const observer = new IntersectionObserver(
        function (entries, currentObserver) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");

                    currentObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    animatedElements.forEach(function (element) {
        element.classList.add("reveal-on-scroll");
        observer.observe(element);
    });
}


/* 9. PREVENT EMPTY INTERNAL LINKS */

function setupSafeLinks() {
    const links = document.querySelectorAll('a[href="#"]');

    links.forEach(function (link) {
        // The WhatsApp button is assigned a real URL above.
        if (link.id !== "whatsappButton") {
            link.addEventListener("click", function (event) {
                event.preventDefault();
            });
        }
    });
}


/* 10. INITIALIZE WEBSITE */

document.addEventListener(
    "DOMContentLoaded",
    function () {
        setupWhatsAppButtons();
        setupEmailLinks();
        updateCopyrightYear();
        setupNavigation();
        setupScrollAnimations();
        setupSafeLinks();

        console.log(
            "Emmanuel Ouko's TSM referral website is ready."
        );
    }
);
