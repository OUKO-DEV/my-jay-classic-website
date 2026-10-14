
/* ==========================================
   EMMANUEL OUKO | TSM REFERRAL WEBSITE
   JavaScript functionality
========================================== */


/* 1. YOUR WHATSAPP NUMBER */

// Replace this example with your real Kenyan number.
// Format: 2547XXXXXXXX
// Use digits only: no + sign, spaces, or leading zero.

const WHATSAPP_NUMBER = "2547XXXXXXXX";


/* 2. REFERRAL MESSAGE */

const WHATSAPP_MESSAGE =
    "Hello Emmanuel Ouko! I am interested in learning about Tech Space Masters (TSM). Please explain the official registration process, current membership fees and terms. I would also like guidance on contacting the appropriate TSM leader.";


/* 3. SET UP WHATSAPP BUTTONS */

function setupWhatsAppButtons() {
    const buttons = [
        document.getElementById("whatsappButton")
    ];

    const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, "");

    const validKenyanNumber = /^254\d{9}$/.test(cleanNumber);

    let whatsappLink;

    if (validKenyanNumber) {
        whatsappLink =
            "https://wa.me/" +
            cleanNumber +
            "?text=" +
            encodeURIComponent(WHATSAPP_MESSAGE);
    } else {
        // Opens WhatsApp with the message prepared.
        // The user can then select a contact.
        whatsappLink =
            "https://wa.me/?text=" +
            encodeURIComponent(WHATSAPP_MESSAGE);
    }

    buttons.forEach(function (button) {
        if (button) {
            button.href = whatsappLink;
            button.target = "_blank";
            button.rel = "noopener noreferrer";
        }
    });
}


/* 4. AUTOMATIC COPYRIGHT YEAR */

function updateCopyrightYear() {
    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}


/* 5. SMOOTH SECTION NAVIGATION */

function setupNavigation() {
    const navigationLinks = document.querySelectorAll(
        '.navbar a[href^="#"], .logo[href^="#"]'
    );

    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                event.preventDefault();

                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                history.replaceState(null, "", targetId);
            }
        });
    });
}


/* 6. REVEAL SECTIONS AS YOU SCROLL */

function setupScrollAnimations() {
    const cards = document.querySelectorAll(
        ".feature-card, .step-card, .contact-box"
    );

    // Keep the content visible if the browser
    // does not support IntersectionObserver.
    if (!("IntersectionObserver" in window)) {
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

    cards.forEach(function (card) {
        card.classList.add("reveal-on-scroll");
        observer.observe(card);
    });
}


/* 7. RUN EVERYTHING AFTER THE PAGE LOADS */

document.addEventListener("DOMContentLoaded", function () {
    setupWhatsAppButtons();
    updateCopyrightYear();
    setupNavigation();
    setupScrollAnimations();

    console.log("Emmanuel Ouko's TSM referral website is ready.");
});
