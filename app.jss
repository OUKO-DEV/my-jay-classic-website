/* =========================================================
   EMMANUEL OUKO — WEBSITE JAVASCRIPT
   File: app.js

   Features:
   1. Responsive mobile navigation
   2. Smooth scrolling
   3. Contact form with WhatsApp message preparation
   4. Website assistant chatbot
   5. FAQ responses
   6. Scroll reveal animations
   7. Footer year
   8. Safe external links and form validation

   IMPORTANT:
   This is front-end JavaScript. It does not provide real AI,
   live forex execution, database storage, or M-Pesa STK Push.
   ========================================================= */

"use strict";

/* =========================================================
   1. WEBSITE SETTINGS
   ========================================================= */

const SITE_CONFIG = {
  name: "Emmanuel Ouko",
  email: "emmanuelouko21@gmail.com",

  /*
    Replace this with your VERIFIED WhatsApp number.
    Use country code 254 and omit the leading zero.
    Example: 0712345678 becomes 254712345678.

    Do not leave an incorrect number here if you want
    WhatsApp links and contact-form messages to work.
  */
  whatsappNumber: "",

  forexContactName: "Dan",
  forexContactNumber: "254707746452",

  instagram: "https://www.instagram.com/emmanueljayouko/",
  youtube: "https://www.youtube.com/@OukoEmmanuel-o2f1x",

  /*
    Add your real profile URLs before publishing.
    Do not use placeholder URLs as final social links.
  */
  facebook: "",
  tiktok: ""
};


/* =========================================================
   2. HELPER FUNCTIONS
   ========================================================= */

function select(selector, parent = document) {
  return parent.querySelector(selector);
}

function selectAll(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

function normalizeText(value) {
  return String(value || "").trim();
}

function openExternalLink(url) {
  if (!url) return;

  try {
    const parsedURL = new URL(url);

    if (parsedURL.protocol === "https:" || parsedURL.protocol === "http:") {
      window.open(parsedURL.href, "_blank", "noopener,noreferrer");
    }
  } catch (error) {
    console.error("Invalid external URL:", error);
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidKenyanWhatsAppNumber(number) {
  return /^254[17]\d{8}$/.test(String(number || ""));
}

function createWhatsAppURL(number, message) {
  if (!isValidKenyanWhatsAppNumber(number)) {
    return null;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function showNotice(message) {
  let notice = select("#websiteNotice");

  if (!notice) {
    notice = document.createElement("div");
    notice.id = "websiteNotice";

    Object.assign(notice.style, {
      position: "fixed",
      left: "50%",
      bottom: "24px",
      transform: "translateX(-50%)",
      zIndex: "3000",
      width: "max-content",
      maxWidth: "calc(100vw - 32px)",
      padding: "13px 18px",
      border: "1px solid rgba(92,225,230,.35)",
      borderRadius: "12px",
      background: "#101a2b",
      color: "#f3f7ff",
      boxShadow: "0 12px 40px rgba(0,0,0,.4)",
      fontSize: "13px",
      lineHeight: "1.6"
    });

    notice.setAttribute("role", "status");
    notice.setAttribute("aria-live", "polite");
    document.body.appendChild(notice);
  }

  notice.textContent = message;
  notice.hidden = false;

  if (notice._hideTimer) {
    clearTimeout(notice._hideTimer);
  }

  notice._hideTimer = setTimeout(() => {
    notice.hidden = true;
  }, 4500);
}


/* =========================================================
   3. MOBILE NAVIGATION
   ========================================================= */

function initializeNavigation() {
  const menuButton = select(".menu-toggle");
  const navigation = select(".main-nav");

  if (!menuButton || !navigation) return;

  function closeMenu() {
    navigation.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  }

  function toggleMenu() {
    const isOpen = navigation.classList.toggle("active");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  }

  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");

  menuButton.addEventListener("click", toggleMenu);

  selectAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (
      navigation.classList.contains("active") &&
      !navigation.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}


/* =========================================================
   4. SMOOTH SCROLLING
   ========================================================= */

function initializeSmoothScrolling() {
  selectAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetID = link.getAttribute("href");

      if (!targetID || targetID === "#") return;

      const target = document.getElementById(targetID.slice(1));

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", targetID);
      }
    });
  });
}


/* =========================================================
   5. CONTACT FORM
   ========================================================= */

/*
  This form prepares a message and opens WhatsApp.

  It does NOT automatically send an email, save a database
  record, or deliver a message without user confirmation.
*/

function initializeContactForm() {
  const form = select("#contactForm");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const formData = new FormData(form);

    const name = normalizeText(
      formData.get("name") || formData.get("fullName")
    );

    const email = normalizeText(formData.get("email"));
    const phone = normalizeText(formData.get("phone"));
    const service = normalizeText(formData.get("service"));
    const budget = normalizeText(formData.get("budget"));
    const details = normalizeText(
      formData.get("message") ||
      formData.get("project_details") ||
      formData.get("details")
    );

    if (!name || !email || !details) {
      showNotice("Please fill in your name, email and project details.");
      return;
    }

    if (!isValidEmail(email)) {
      showNotice("Please enter a valid email address.");
      return;
    }

    const message = [
      "Hello Emmanuel Ouko,",
      "",
      "I would like to enquire about your services.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Service: ${service || "Not specified"}`,
      `Budget: ${budget || "Not specified"}`,
      "",
      "Project details:",
      details
    ].join("\n");

    const whatsappURL = createWhatsAppURL(
      SITE_CONFIG.whatsappNumber,
      message
    );

    if (!whatsappURL) {
      /*
        A valid number has not yet been configured.
        The form still prepares the message so the visitor
        can copy it instead of losing the information.
      */
      const messageText = [
        "Your enquiry is ready, but the website WhatsApp number needs to be configured.",
        "",
        message
      ].join("\n");

      showNotice(
        "Your message is ready. WhatsApp contact details need to be verified."
      );

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(messageText).then(
          () => showNotice("Message copied. You can paste it into WhatsApp."),
          () => window.prompt("Copy your enquiry below:", messageText)
        );
      } else {
        window.prompt("Copy your enquiry below:", messageText);
      }

      return;
    }

    openExternalLink(whatsappURL);
    showNotice("WhatsApp opened. Review and send your message there.");
  });
}


/* =========================================================
   6. CHATBOT ELEMENTS
   ========================================================= */

function initializeChatbot() {
  const launcher = select("#assistantLauncher");
  const panel = select("#assistantPanel");
  const form = select("#assistantForm");
  const input = select("#assistantInput");
  const messages = select("#assistantMessages");

  if (!launcher || !panel || !form || !input || !messages) {
    return;
  }

  /*
    This is a simple rule-based website assistant.
    It is not connected to a generative AI model or API.
  */

  const knowledgeBase = [
    {
      keywords: ["hello", "hi", "hey", "habari", "good morning", "good evening"],
      answer:
        "Hello! Welcome to Emmanuel Ouko's website. I can help you explore digital services, courses, forex education and contact options. What would you like to know?"
    },
    {
      keywords: ["service", "services", "what do you do", "offer"],
      answer:
        "Emmanuel's website presents digital services such as web design, graphic design, digital marketing and online-work guidance. Tell me which service interests you."
    },
    {
      keywords: ["website", "web design", "web development"],
      answer:
        "Web design enquiries can include landing pages, business websites and portfolio websites. Use the contact form to explain your project and preferred features."
    },
    {
      keywords: ["graphic", "design", "canva", "poster", "logo"],
      answer:
        "For graphic-design enquiries, describe the item you need, such as a poster, social-media design or branding material. Pricing depends on the project requirements."
    },
    {
      keywords: ["marketing", "digital marketing", "social media"],
      answer:
        "Digital-marketing support may include social-media content and online brand promotion. Share your goals and platforms through the contact form to discuss the requirements."
    },
    {
      keywords: ["freelance", "freelancing", "online job", "online work", "gig"],
      answer:
        "A practical way to start freelancing is to choose one skill, create a few sample projects, build a portfolio and contact potential clients. Be cautious of platforms or people promising guaranteed income or asking for suspicious upfront fees."
    },
    {
      keywords: ["forex", "trading", "currency", "forex course"],
      answer:
        "The forex section is intended for education. You can study currency pairs, charts, risk management and demo trading. Forex involves substantial risk, and no profit is guaranteed."
    },
    {
      keywords: ["dan", "forex contact", "trading mentor"],
      answer:
        "The website lists Dan as a forex reference contact. Verify who you are speaking to and independently assess any trading advice before sending money or sharing account credentials."
    },
    {
      keywords: ["price", "pricing", "cost", "how much", "budget"],
      answer:
        "Pricing depends on the service, scope and delivery requirements. Send your project details and budget through the contact form to request a quotation."
    },
    {
      keywords: ["payment", "mpesa", "m-pesa", "pay"],
      answer:
        "Before making a payment, confirm the recipient, amount and service directly with Emmanuel. This website interface does not itself confirm payments or provide a live M-Pesa STK Push."
    },
    {
      keywords: ["course", "classes", "learn", "training"],
      answer:
        "Explore the courses and learning sections on the website. For availability, schedule and fees, contact Emmanuel directly using the contact section."
    },
    {
      keywords: ["contact", "email", "whatsapp", "phone", "reach"],
      answer:
        `You can email Emmanuel at ${SITE_CONFIG.email}. The WhatsApp number on the website must be verified before the contact form can open the correct chat.`
    },
    {
      keywords: ["instagram", "youtube", "facebook", "tiktok", "social"],
      answer:
        "Visit the social-media section for available profiles. Only use profile links that are confirmed to belong to Emmanuel."
    },
    {
      keywords: ["ai", "artificial intelligence", "chatbot", "assistant"],
      answer:
        "I am the website's built-in rule-based assistant. I can answer common questions, but I am not connected to a live AI service in this version."
    },
    {
      keywords: ["thank", "thanks", "asante"],
      answer:
        "You're welcome! Feel free to explore the website or send an enquiry through the contact section."
    },
    {
      keywords: ["bye", "goodbye", "see you"],
      answer:
        "Thanks for visiting Emmanuel Ouko's website. Have a great day!"
    }
  ];

  function addMessage(text, sender = "bot") {
    const bubble = document.createElement("div");

    bubble.className =
      sender === "user" ? "assistant-bubble user" : "assistant-bubble";

    bubble.textContent = text;
    bubble.setAttribute("role", "listitem");

    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  function getBotResponse(userMessage) {
    const text = userMessage.toLowerCase();

    for (const item of knowledgeBase) {
      const matched = item.keywords.some((keyword) =>
        text.includes(keyword)
      );

      if (matched) {
        return item.answer;
      }
    }

    return (
      "I can help with digital services, freelancing, courses, forex education, pricing and contact information. " +
      "Try asking about one of those topics, or use the contact form for a personal enquiry."
    );
  }

  function openChat() {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");

    window.setTimeout(() => {
      input.focus();
    }, 50);
  }

  function closeChat() {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  }

  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-label", "Open website assistant");

  launcher.addEventListener("click", () => {
    if (panel.hidden) {
      openChat();
    } else {
      closeChat();
    }
  });

  const closeButton = select(
    "[data-close-assistant], .assistant-close",
    panel
  );

  if (closeButton) {
    closeButton.addEventListener("click", closeChat);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      closeChat();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const userMessage = normalizeText(input.value);

    if (!userMessage) return;

    addMessage(userMessage, "user");
    input.value = "";

    const response = getBotResponse(userMessage);

    window.setTimeout(() => {
      addMessage(response, "bot");
    }, 250);
  });

  if (!messages.children.length) {
    addMessage(
      "Hi! I'm Emmanuel's website assistant. Ask me about services, freelancing, courses, forex education or how to contact Emmanuel."
    );
  }
}


/* =========================================================
   7. SCROLL REVEAL ANIMATIONS
   ========================================================= */

function initializeRevealAnimations() {
  const elements = selectAll(
    ".feature-card, .portfolio-card, .reference-card, .market-panel, .payment-panel, .social-link, .contact-form"
  );

  if (!elements.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
    return;
  }

  elements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(18px)";
    element.style.transition =
      "opacity 0.55s ease, transform 0.55s ease";
  });

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";

        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  elements.forEach((element) => observer.observe(element));
}


/* =========================================================
   8. FOOTER COPYRIGHT YEAR
   ========================================================= */

function initializeFooterYear() {
  const yearElements = selectAll("[data-current-year]");

  yearElements.forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const copyright = select(".footer-bottom");

  if (copyright && copyright.textContent.includes("2025")) {
    copyright.textContent = copyright.textContent.replace(
      "2025",
      String(new Date().getFullYear())
    );
  }
}


/* =========================================================
   9. SOCIAL LINKS
   ========================================================= */

function initializeSocialLinks() {
  const socialLinks = {
    instagram: SITE_CONFIG.instagram,
    youtube: SITE_CONFIG.youtube,
    facebook: SITE_CONFIG.facebook,
    tiktok: SITE_CONFIG.tiktok
  };

  Object.entries(socialLinks).forEach(([platform, url]) => {
    if (!url) return;

    const matchingLinks = selectAll(
      `[data-social="${platform}"]`
    );

    matchingLinks.forEach((link) => {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  });
}


/* =========================================================
   10. FOREX CONTACT LINK
   ========================================================= */

function initializeForexContact() {
  const forexLinks = selectAll("[data-forex-contact]");

  const message =
    "Hello Dan, I found your contact through Emmanuel Ouko's website. " +
    "I would like to ask about forex education.";

  const url = createWhatsAppURL(
    SITE_CONFIG.forexContactNumber,
    message
  );

  forexLinks.forEach((link) => {
    if (url) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        showNotice("The forex contact number needs to be verified.");
      });
    }
  });
}


/* =========================================================
   11. EXTERNAL LINK SAFETY
   ========================================================= */

function initializeExternalLinks() {
  selectAll('a[target="_blank"]').forEach((link) => {
    const existingRel = link.getAttribute("rel") || "";

    const relValues = new Set(existingRel.split(/\s+/).filter(Boolean));

    relValues.add("noopener");
    relValues.add("noreferrer");

    link.setAttribute("rel", Array.from(relValues).join(" "));
  });
}


/* =========================================================
   12. INITIALIZE WEBSITE
   ========================================================= */

function initializeWebsite() {
  initializeNavigation();
  initializeSmoothScrolling();
  initializeContactForm();
  initializeChatbot();
  initializeRevealAnimations();
  initializeFooterYear();
  initializeSocialLinks();
  initializeForexContact();
  initializeExternalLinks();

  console.info("Emmanuel Ouko website initialized successfully.");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWebsite);
} else {
  initializeWebsite();
}
