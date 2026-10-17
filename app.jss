
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);

  // =====================================================
  // EMMANUEL OUKO — SITE SETTINGS
  // =====================================================
  const SITE = {
    name: "Emmanuel Ouko",
    email: "emmanuelouko21@gmail.com",
    // International digits only: Kenya country code + number.
    // Confirm this number is correct before publishing.
    whatsapp: "254142617814",
    forexContact: "254707746452",
    social: {
      tiktok: "https://www.tiktok.com/@oukoemmanuel383",
      instagram: "https://www.instagram.com/emmanueljayouko/",
      youtube: "https://www.youtube.com/@OukoEmmanuel-o2f1x"
    }
  };

  // =====================================================
  // MOBILE NAVIGATION
  // =====================================================
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  function closeMenu() {
    if (!menuToggle || !mainNav) return;
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const willOpen = !mainNav.classList.contains("open");
      mainNav.classList.toggle("open", willOpen);
      menuToggle.setAttribute("aria-expanded", String(willOpen));
      menuToggle.setAttribute(
        "aria-label",
        willOpen ? "Close navigation" : "Open navigation"
      );
    });

    mainNav.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // =====================================================
  // CURRENT YEAR
  // =====================================================
  const currentYear = $("#currentYear");
  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  // =====================================================
  // PREFILL SERVICE WHEN A SERVICE LINK IS CLICKED
  // =====================================================
  const serviceSelect = $("#contactService");

  document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      const requestedService = link.getAttribute("data-service");
      if (!serviceSelect || !requestedService) return;

      const matchingOption = Array.from(serviceSelect.options).find(
        (option) =>
          option.value === requestedService ||
          option.textContent.trim() === requestedService
      );

      if (matchingOption) {
        serviceSelect.value = matchingOption.value;
      }
    });
  });

  // =====================================================
  // CONTACT FORM — PREPARE A WHATSAPP MESSAGE
  // =====================================================
  const contactForm = $("#contactForm");
  const formStatus = $("#formStatus");

  function setFormStatus(message) {
    if (formStatus) formStatus.textContent = message;
  }

  function normalizePhone(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function validKenyanWhatsApp(number) {
    // Accept international format beginning 254 with 9 digits after it.
    return /^254\d{9}$/.test(number);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const service = String(formData.get("service") || "").trim();
      const budget = String(formData.get("budget") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (!name || !email || !service || !message) {
        setFormStatus("Please complete all required fields.");
        return;
      }

      const subject = `Website enquiry: ${service}`;
      const body = [
        `Hello ${SITE.name},`,
        "",
        "I would like to make an enquiry.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Service: ${service}`,
        `Budget: ${budget || "Not specified"}`,
        "",
        "Project details:",
        message
      ].join("\n");

      const whatsappNumber = normalizePhone(SITE.whatsapp);

      if (validKenyanWhatsApp(whatsappNumber)) {
        const whatsappURL =
          `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(body)}`;

        setFormStatus(
          "Your WhatsApp message is prepared. Review it and press Send in WhatsApp."
        );

        const newWindow = window.open(whatsappURL, "_blank", "noopener,noreferrer");

        if (!newWindow) {
          window.location.href = whatsappURL;
        }

        return;
      }

      // Fallback: open the visitor's email app.
      const mailURL =
        `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      setFormStatus(
        "WhatsApp number is not configured correctly. Opening your email app instead."
      );
      window.location.href = mailURL;
    });
  }

  // =====================================================
  // BASIC WEBSITE ASSISTANT
  // This is a local FAQ helper, not a live AI model.
  // =====================================================
  const assistantLauncher = $("#assistantLauncher");
  const assistantPanel = $("#assistantPanel");
  const assistantClose = $("#assistantClose");
  const assistantForm = $("#assistantForm");
  const assistantInput = $("#assistantInput");
  const assistantMessages = $("#assistantMessages");

  function openAssistant() {
    if (!assistantPanel || !assistantLauncher) return;
    assistantPanel.hidden = false;
    assistantLauncher.setAttribute("aria-expanded", "true");

    if (assistantInput) {
      window.setTimeout(() => assistantInput.focus(), 50);
    }
  }

  function closeAssistant() {
    if (!assistantPanel || !assistantLauncher) return;
    assistantPanel.hidden = true;
    assistantLauncher.setAttribute("aria-expanded", "false");
    assistantLauncher.focus();
  }

  function addAssistantMessage(message, type) {
    if (!assistantMessages) return;

    const item = document.createElement("div");
    item.className =
      "assistant-message " +
      (type === "user" ? "user-message" : "bot-message");

    // Use textContent rather than HTML so typed messages aren't interpreted as markup.
    item.textContent = message;
    assistantMessages.appendChild(item);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
  }

  function getAssistantReply(question) {
    const q = question.toLowerCase();

    if (/hello|hi\b|hey\b|habari|good morning|good afternoon/.test(q)) {
      return `Hello! Welcome to ${SITE.name}'s website. Ask me about services, courses, Forex education or contact details.`;
    }

    if (/website|web design|developer|html|css/.test(q)) {
      return "Website services include responsive landing pages, portfolio sites, business websites and website improvements. Use the contact form to describe your project.";
    }

    if (/graphic|design|poster|logo|canva/.test(q)) {
      return "You can enquire about graphic design, promotional visuals, social media content and Canva learning. Open the Services section or send a project enquiry.";
    }

    if (/marketing|social media|branding|brand/.test(q)) {
      return "You can enquire about digital marketing, content planning, online presence and personal branding. The exact scope and price should be agreed before work begins.";
    }

    if (/ai|artificial intelligence|prompt|productivity/.test(q)) {
      return "The AI learning topics cover beginner-friendly tools, prompts, writing assistance, research and productivity workflows. Do not share passwords or private information with AI tools.";
    }

    if (/forex|trading|currency|market|demo|real trading/.test(q)) {
      return "The Forex section is for education only. Demo trading uses simulated funds; live trading uses real money and can cause losses. This website does not execute trades or provide guaranteed signals.";
    }

    if (/dan|reference/.test(q)) {
      return "Dan is listed as a Forex learning reference. You can reach him using the WhatsApp link in the Forex education section. Verify the contact details before sharing personal information.";
    }

    if (/course|class|learn|training|enrol/.test(q)) {
      return "Learning topics include Canva and content creation, beginner AI tools, website fundamentals and Forex basics. Contact Emmanuel to confirm current schedules, availability and fees.";
    }

    if (/price|pricing|cost|budget|charge|fee/.test(q)) {
      return "Pricing depends on the service and project scope. Submit an enquiry with your needs and budget, then confirm the final quote before work starts.";
    }

    if (/mpesa|m-pesa|payment|pay\b|stk/.test(q)) {
      return "Contact Emmanuel to agree on the service and payment details. Automated M-Pesa STK Push is not enabled on this front-end website. Never enter your M-Pesa PIN into this website.";
    }

    if (/book|booking|calendar|appointment/.test(q)) {
      return "Please use the contact form to discuss an appointment. A live calendar with automatic booking confirmation has not yet been connected.";
    }

    if (/client portal|login|account|dashboard/.test(q)) {
      return "A secure client portal and admin dashboard require a backend, authentication and a database. This public website does not currently provide secure account login.";
    }

    if (/email|contact|whatsapp|phone|reach/.test(q)) {
      return `You can email ${SITE.email}, or use the WhatsApp and contact links in the Contact section. The contact form prepares a message for you to review and send.`;
    }

    if (/tiktok|instagram|youtube|facebook|follow|social/.test(q)) {
      return "Use the Connect Online section for TikTok, Instagram, YouTube and Facebook links.";
    }

    return "I can help with website services, graphic design, digital marketing, AI tools, learning topics, Forex education and contact details. Try asking about one of those topics or use the contact form.";
  }

  if (assistantLauncher) {
    assistantLauncher.addEventListener("click", () => {
      if (assistantPanel && !assistantPanel.hidden) {
        closeAssistant();
      } else {
        openAssistant();
      }
    });
  }

  if (assistantClose) {
    assistantClose.addEventListener("click", closeAssistant);
  }

  if (assistantForm && assistantInput) {
    assistantForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const question = assistantInput.value.trim();
      if (!question) return;

      addAssistantMessage(question, "user");
      assistantInput.value = "";

      // Local FAQ response; no external API call is made.
      addAssistantMessage(getAssistantReply(question), "bot");
      assistantInput.focus();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && assistantPanel && !assistantPanel.hidden) {
      closeAssistant();
    }
  });

  // =====================================================
  // BACK-TO-TOP BUTTON
  // =====================================================
  const backToTop = $("#backToTop");

  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle("visible", window.scrollY > 500);
  }

  if (backToTop) {
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth"
      });
    });
  }

  // =====================================================
  // SAFETY: OPEN EXTERNAL LINKS IN A NEW TAB SAFELY
  // Existing target="_blank" links should include noopener.
  // =====================================================
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const relValues = new Set(
      (link.getAttribute("rel") || "").split(/\s+/).filter(Boolean)
    );

    relValues.add("noopener");
    relValues.add("noreferrer");
    link.setAttribute("rel", Array.from(relValues).join(" "));
  });

  // =====================================================
  // SMOOTH INTERNAL NAVIGATION
  // =====================================================
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
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

      if (history.replaceState) {
        history.replaceState(null, "", targetID);
      }
    });
  });

  console.info(`${SITE.name} website scripts loaded.`);
});
