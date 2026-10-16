
/* =========================================================
   EMMANUEL OUKO | DIGITAL SERVICES WEBSITE
   Professional website interactions and contact handling
   ========================================================= */

"use strict";

/* -------------------- CONFIGURATION -------------------- */

const SITE_CONFIG = {
    name: "Emmanuel Ouko",
    email: "emmanuelouko21@gmail.com",

    // Kenyan number: 0142617814
    // International WhatsApp format: 254142617814
    whatsapp: "254142617814",

    tsmRegistrationUrl: "https://techspacemasters.com/register/?lid=2"
};


/* -------------------- HELPER FUNCTIONS -------------------- */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

function cleanPhoneNumber(number) {
    return String(number || "").replace(/\D/g, "");
}

function getWhatsAppUrl(message) {
    const number = cleanPhoneNumber(SITE_CONFIG.whatsapp);

    if (!/^254\d{9}$/.test(number)) {
        console.error(
            "WhatsApp number is not in the expected Kenyan international format."
        );
        return null;
    }

    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function openWhatsApp(message) {
    const url = getWhatsAppUrl(message);

    if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
    }
}

function openEmail(subject, message) {
    const url =
        `mailto:${SITE_CONFIG.email}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(message)}`;

    window.location.href = url;
}


/* -------------------- MOBILE NAVIGATION -------------------- */

function initMobileNavigation() {
    const menuToggle = $("#menuToggle");
    const navbar = $("#mainNavbar");

    if (!menuToggle || !navbar) return;

    function setMenuState(isOpen) {
        navbar.classList.toggle("active", isOpen);
        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        const icon = $("i", menuToggle);

        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);
        }
    }

    menuToggle.setAttribute("aria-controls", "mainNavbar");
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
        const isOpen = navbar.classList.contains("active");
        setMenuState(!isOpen);
    });

    $$("#mainNavbar a").forEach(link => {
        link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            setMenuState(false);
        }
    });

    document.addEventListener("click", event => {
        if (
            navbar.classList.contains("active") &&
            !navbar.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            setMenuState(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 980) {
            setMenuState(false);
        }
    });
}


/* -------------------- WHATSAPP CONTACT BUTTONS -------------------- */

function initWhatsAppButtons() {
    const defaultMessage =
        `Hello ${SITE_CONFIG.name}! I visited your website and would like ` +
        "to learn more about your digital services and opportunities. " +
        "Please share the relevant details with me.";

    const buttonIds = [
        "whatsappButton",
        "whatsappTop",
        "whatsappBottom"
    ];

    buttonIds.forEach(id => {
        const button = document.getElementById(id);

        if (!button) return;

        const url = getWhatsAppUrl(defaultMessage);

        if (url) {
            button.setAttribute("href", url);
            button.setAttribute("target", "_blank");
            button.setAttribute("rel", "noopener noreferrer");
        }
    });

    // Support other WhatsApp links that explicitly use a data attribute.
    $$("[data-whatsapp]").forEach(button => {
        const message =
            button.dataset.message || defaultMessage;

        const url = getWhatsAppUrl(message);

        if (url && button.tagName.toLowerCase() === "a") {
            button.href = url;
            button.target = "_blank";
            button.rel = "noopener noreferrer";
        } else if (url) {
            button.addEventListener("click", () => openWhatsApp(message));
        }
    });
}


/* -------------------- INTEREST / ENQUIRY FORM -------------------- */

function initInterestForm() {
    const form =
        $("#interestForm") ||
        $(".interest-form");

    if (!form) {
        console.info(
            "Interest form not found. Add id=\"interestForm\" " +
            "or class=\"interest-form\" to your form in index.html."
        );
        return;
    }

    const whatsappButton =
        $("#whatsappFormButton") ||
        $("#sendWhatsApp") ||
        $('[data-submit="whatsapp"]', form) ||
        $('[data-contact="whatsapp"]', form);

    const emailButton =
        $("#emailFormButton") ||
        $("#sendEmail") ||
        $('[data-submit="email"]', form) ||
        $('[data-contact="email"]', form);

    function getFieldValue(names) {
        for (const name of names) {
            const field = form.elements.namedItem(name);

            if (!field) continue;

            if (field instanceof RadioNodeList) {
                if (field.value) return field.value.trim();
                continue;
            }

            if (field.type === "checkbox") {
                if (field.checked) return field.value.trim();
                continue;
            }

            if (field.value && field.value.trim()) {
                return field.value.trim();
            }
        }

        return "";
    }

    function getSelectedInterests() {
        const selected = $$(
            'input[type="checkbox"]:checked, input[type="radio"]:checked',
            form
        ).map(input => input.value.trim()).filter(Boolean);

        const interestField = getFieldValue([
            "interest",
            "interests",
            "service",
            "topic"
        ]);

        if (interestField) selected.push(interestField);

        const selectField = $(
            'select[name="interest"], select[name="interests"], ' +
            'select[name="service"], select[name="topic"]',
            form
        );

        if (selectField && selectField.value) {
            selected.push(selectField.options[selectField.selectedIndex].text);
        }

        return [...new Set(selected)].join(", ") || "General enquiry";
    }

    function buildEnquiry() {
        const name = getFieldValue(["name", "fullName", "full_name"]);
        const email = getFieldValue(["email", "userEmail"]);
        const phone = getFieldValue(["phone", "telephone", "mobile"]);
        const interests = getSelectedInterests();
        const message = getFieldValue([
            "message",
            "details",
            "project_details",
            "description"
        ]);

        const lines = [
            `Hello ${SITE_CONFIG.name},`,
            "",
            "I am contacting you through your website.",
            "",
            `Name: ${name || "Not provided"}`,
            `Email: ${email || "Not provided"}`,
            `Phone: ${phone || "Not provided"}`,
            `Interest: ${interests}`,
            "",
            "My message:",
            message || "I would like to receive more information.",
            "",
            "Please share the relevant details and next steps.",
            "",
            "Thank you."
        ];

        return {
            subject: `Website enquiry from ${name || "a visitor"}`,
            message: lines.join("\n")
        };
    }

    function handleFormAction(destination) {
        if (typeof form.reportValidity === "function" &&
            !form.reportValidity()) {
            return;
        }

        const enquiry = buildEnquiry();

        if (destination === "whatsapp") {
            openWhatsApp(enquiry.message);
        } else {
            openEmail(enquiry.subject, enquiry.message);
        }
    }

    if (whatsappButton) {
        whatsappButton.addEventListener("click", event => {
            event.preventDefault();
            handleFormAction("whatsapp");
        });
    }

    if (emailButton) {
        emailButton.addEventListener("click", event => {
            event.preventDefault();
            handleFormAction("email");
        });
    }

    // If the form uses a normal submit button, default to WhatsApp.
    form.addEventListener("submit", event => {
        event.preventDefault();

        if (whatsappButton || emailButton) {
            const submitter = event.submitter;

            if (
                submitter === emailButton ||
                submitter?.dataset?.submit === "email" ||
                submitter?.dataset?.contact === "email"
            ) {
                handleFormAction("email");
            } else {
                handleFormAction("whatsapp");
            }
        } else {
            handleFormAction("whatsapp");
        }
    });
}


/* -------------------- EMAIL LINKS -------------------- */

function initEmailLinks() {
    $$('a[href^="mailto:"]').forEach(link => {
        const currentHref = link.getAttribute("href") || "";
        const queryIndex = currentHref.indexOf("?");
        const query = queryIndex >= 0
            ? currentHref.slice(queryIndex)
            : "";

        link.setAttribute(
            "href",
            `mailto:${SITE_CONFIG.email}${query}`
        );
    });
}


/* -------------------- SMOOTH NAVIGATION -------------------- */

function initSmoothNavigation() {
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const navigationLinks = $$(
        '.navbar a[href^="#"], ' +
        '.logo[href^="#"], ' +
        '.footer-links a[href^="#"], ' +
        '.back-to-top[href^="#"]'
    );

    navigationLinks.forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const target = $(href);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });

            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, "", href);
            }
        });
    });
}


/* -------------------- SCROLL REVEAL ANIMATIONS -------------------- */

function initScrollReveal() {
    const revealItems = $$(
        ".about-card, " +
        ".freelance-card, " +
        ".feature-card, " +
        ".step-card, " +
        ".contact-card, " +
        ".social-card, " +
        ".gallery-item, " +
        ".join-cta, " +
        ".marketing-visual-card"
    );

    if (!revealItems.length) return;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        reduceMotion ||
        !("IntersectionObserver" in window)
    ) {
        revealItems.forEach(item => {
            item.classList.add("visible", "is-visible");
        });
        return;
    }

    revealItems.forEach(item => item.classList.add("reveal"));

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible", "is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealItems.forEach(item => observer.observe(item));
}


/* -------------------- PHOTO GALLERY -------------------- */

function initPhotoGallery() {
    const gallery = $(".photo-gallery");

    if (!gallery) return;

    $$("img", gallery).forEach(image => {
        image.loading = "lazy";
        image.decoding = "async";

        image.addEventListener("error", () => {
            image.classList.add("image-unavailable");
            console.warn("A gallery image could not be loaded:", image.src);
        });
    });
}


/* -------------------- FOOTER YEAR -------------------- */

function initFooterYear() {
    const year = $("#currentYear");

    if (year) {
        year.textContent = new Date().getFullYear();
    }
}


/* -------------------- EXTERNAL LINK SAFETY -------------------- */

function initExternalLinks() {
    $$('a[target="_blank"]').forEach(link => {
        const rel = new Set(
            (link.getAttribute("rel") || "").split(/\s+/).filter(Boolean)
        );

        rel.add("noopener");
        rel.add("noreferrer");

        link.setAttribute("rel", [...rel].join(" "));
    });
}


/* -------------------- START WEBSITE -------------------- */

function initWebsite() {
    initMobileNavigation();
    initWhatsAppButtons();
    initInterestForm();
    initEmailLinks();
    initSmoothNavigation();
    initScrollReveal();
    initPhotoGallery();
    initFooterYear();
    initExternalLinks();

    console.info(`${SITE_CONFIG.name} website is ready.`);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWebsite);
} else {
    initWebsite();
}
