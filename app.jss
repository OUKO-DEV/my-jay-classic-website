
(() => {
  "use strict";

  // Emmanuel Ouko website settings
  const WHATSAPP_NUMBER = "254142617814";

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  // Update the copyright year automatically
  const year = $("#currentYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // MOBILE NAVIGATION
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    // Close menu after choosing a navigation link
    $$("#mainNav a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });

    // Close menu when clicking outside it
    document.addEventListener("click", (event) => {
      if (
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      }
    });
  }

  // AUTOMATIC SERVICE SELECTION
  const serviceSelect = $("#contactService");

  $$("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      if (!serviceSelect) return;

      const requestedService = link.dataset.service;

      const option = [...serviceSelect.options].find((item) =>
        item.value === requestedService ||
        item.textContent.trim() === requestedService
      );

      if (option) {
        serviceSelect.value = option.value;
      }
    });
  });

  // CONTACT FORM
  // This prepares a WhatsApp message; it does not send automatically.
  const contactForm = $("#contactForm");
  const formStatus = $("#formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = $("#contactName")?.value.trim() || "";
      const email = $("#contactEmail")?.value.trim() || "";
      const phone = $("#contactPhone")?.value.trim() || "";
      const service = $("#contactService")?.value.trim() || "";
      const budget = $("#contactBudget")?.value.trim() || "";
      const message = $("#contactMessage")?.value.trim() || "";

      // Basic required-field validation
      if (!name || !email || !service || !message) {
        if (formStatus) {
          formStatus.textContent =
            "Please complete your name, email, service and message.";
        }
        return;
      }

      // Validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        if (formStatus) {
          formStatus.textContent =
            "Please enter a valid email address.";
        }
        return;
      }

      const whatsappMessage = [
        "Hello Emmanuel, I am enquiring through your website.",
        "",
        `Name: ${name}`,
        phone ? `Phone: ${phone}` : "",
        `Email: ${email}`,
        `Service: ${service}`,
        budget ? `Estimated budget: ${budget}` : "",
        "",
        "Project / enquiry details:",
        message
      ]
        .filter(Boolean)
        .join("\n");

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=` +
        encodeURIComponent(whatsappMessage);

      if (formStatus) {
        formStatus.textContent =
          "WhatsApp is opening with your message. Review it and press Send.";
      }

      // Open WhatsApp for the visitor to review and send
      const newWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      // Fallback if the browser blocks the new window
      if (!newWindow) {
        window.location.href = whatsappURL;
      }
    });
  }

  // WEBSITE ASSISTANT
  // This is a local FAQ helper, not a live AI service.
  const assistantLauncher = $("#assistantLauncher");
  const assistantPanel = $("#assistantPanel");
  const assistantClose = $("#assistantClose");
  const assistantForm = $("#assistantForm");
  const assistantInput = $("#assistantInput");
  const assistantMessages = $("#assistantMessages");

  function openAssistant() {
    if (assistantPanel) {
      assistantPanel.hidden = false;
    }

    assistantInput?.focus();
  }

  function closeAssistant() {
    if (assistantPanel) {
      assistantPanel.hidden = true;
    }
  }

  assistantLauncher?.addEventListener("click", () => {
    if (!assistantPanel) return;

    if (assistantPanel.hidden) {
      openAssistant();
    } else {
      closeAssistant();
    }
  });

  assistantClose?.addEventListener("click", closeAssistant);

  // Add a chat message safely using textContent
  function addBubble(message, sender = "assistant") {
    if (!assistantMessages) return;

    const bubble = document.createElement("div");

    bubble.className =
      sender === "user" ? "bubble user" : "bubble";

    bubble.textContent = message;

    assistantMessages.appendChild(bubble);
    assistantMessages.scrollTop =
      assistantMessages.scrollHeight;
  }

  // Answer common visitor questions
  function getAssistantAnswer(question) {
    const q = question.toLowerCase();

    if (/price|cost|budget|charge|quote/.test(q)) {
      return (
        "Pricing depends on the scope of your project. " +
        "Use the enquiry form to share your requirements and budget. " +
        "Emmanuel can confirm the deliverables and price before work begins."
      );
    }

    if (/forex|trading|trade|market|signal|profit/.test(q)) {
      return (
        "The Forex section is for education. You can learn about " +
        "market basics, demo trading and risk management. Demo trading " +
        "uses simulated funds; real trading involves actual financial risk. " +
        "Profits are not guaranteed, and this website does not place trades."
      );
    }

    if (/mpesa|m-pesa|pay|payment|stk|pin|otp/.test(q)) {
      return (
        "Please contact Emmanuel first to confirm the amount and payment " +
        "instructions. This website does not initiate an M-Pesa STK Push. " +
        "Never share your M-Pesa PIN or one-time password."
      );
    }

    if (/website|web design|developer|landing page/.test(q)) {
      return (
        "Emmanuel offers website and landing-page support. " +
        "Use the enquiry form to explain your idea, preferred features " +
        "and expected budget."
      );
    }

    if (/graphic|design|brand|logo|poster/.test(q)) {
      return (
        "You can enquire about branding, logos, social media graphics " +
        "and promotional designs. Share the purpose and style you have in mind."
      );
    }

    if (/ai|artificial intelligence|tool|automation/.test(q)) {
      return (
        "AI support focuses on practical tools, prompting and productivity. " +
        "Contact Emmanuel to discuss the guidance or training you need."
      );
    }

    if (/course|class|learn|training|lesson/.test(q)) {
      return (
        "Learning topics include digital tools, AI productivity and Forex " +
        "market foundations. Contact Emmanuel to confirm current sessions."
      );
    }

    if (/contact|whatsapp|phone|email|reach/.test(q)) {
      return (
        "Contact Emmanuel on WhatsApp at +254 142 617 814 or email " +
        "emmanuelouko21@gmail.com. The contact form prepares a WhatsApp " +
        "message for you to review and send."
      );
    }

    if (/hello|hi|hey|habari/.test(q)) {
      return (
        "Hello! Welcome to Emmanuel Ouko's website. " +
        "Ask me about digital services, learning, pricing, payments " +
        "or Forex education."
      );
    }

    return (
      "I can help with website services, design, pricing, AI tools, " +
      "learning, M-Pesa instructions or Forex education. " +
      "You can also contact Emmanuel on WhatsApp at +254 142 617 814."
    );
  }

  if (assistantForm && assistantInput) {
    assistantForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const question = assistantInput.value.trim();

      if (!question) return;

      addBubble(question, "user");

      assistantInput.value = "";

      const response = getAssistantAnswer(question);

      addBubble(response, "assistant");
      assistantInput.focus();
    });
  }

  // BACK-TO-TOP BUTTON
  const backToTop = $("#backToTop");

  function updateBackToTop() {
    if (!backToTop) return;

    backToTop.classList.toggle(
      "visible",
      window.scrollY > 500
    );
  }

  window.addEventListener(
    "scroll",
    updateBackToTop,
    { passive: true }
  );

  updateBackToTop();

  backToTop?.addEventListener("click", (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // ADD SECURITY ATTRIBUTES TO EXTERNAL NEW-TAB LINKS
  $$('a[target="_blank"]').forEach((link) => {
    const relValues = new Set(
      (link.rel || "")
        .split(/\s+/)
        .filter(Boolean)
    );

    relValues.add("noopener");
    relValues.add("noreferrer");

    link.rel = [...relValues].join(" ");
  });

})();
