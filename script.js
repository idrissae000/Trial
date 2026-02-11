const yearEl = document.getElementById("year");
const selectionMessage = document.getElementById("selection-message");
const campaignButtons = document.querySelectorAll(".campaign-button[data-plan]");
const pricingShortcut = document.getElementById("pricing-shortcut");
const homeShortcut = document.getElementById("home-shortcut");
const homeSection = document.getElementById("home-section");
const pricingSection = document.getElementById("pricing-section");

const modal = document.getElementById("quote-modal");
const modalPanel = modal.querySelector(".modal-panel");
const closeModalButton = document.getElementById("quote-close");
const cancelButton = document.getElementById("quote-cancel");
const quoteForm = document.getElementById("quote-form");
const quotePlanInput = document.getElementById("quote-plan");
const budgetSelect = document.getElementById("budget");
const successMessage = document.getElementById("quote-success");
const termsCheckbox = document.getElementById("terms-agree");
const termsError = document.getElementById("terms-error");
const termsGroup = document.getElementById("terms-group");

const budgetByPlan = {
  "Campaign Lite": ["200", "250", "300"],
  "Campaign Premium": ["400", "500", "600"],
  "Campaign Plus+": ["700", "900", "1100"],
};

let lastFocusedElement = null;

const trapFocus = (event) => {
  if (event.key !== "Tab") return;

  const focusable = modal.querySelectorAll(
    "button, input, select, textarea, [href], [tabindex]:not([tabindex='-1'])"
  );
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const setBudgetsForPlan = (plan) => {
  const budgets = budgetByPlan[plan] || [];
  budgetSelect.innerHTML = "";

  budgets.forEach((amount) => {
    const option = document.createElement("option");
    option.value = amount;
    option.textContent = `$${amount}`;
    budgetSelect.append(option);
  });
};

const openModal = (plan) => {
  lastFocusedElement = document.activeElement;
  quoteForm.reset();
  successMessage.textContent = "";
  termsError.textContent = "";
  termsGroup.classList.remove("has-error");
  quotePlanInput.value = plan;
  setBudgetsForPlan(plan);

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const firstInput = document.getElementById("full-name");
  firstInput.focus();
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
};

campaignButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedPlan = button.dataset.plan;
    selectionMessage.textContent = `Selected: ${selectedPlan}`;
    openModal(selectedPlan);
  });
});

pricingShortcut.addEventListener("click", () => {
  pricingSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

homeShortcut.addEventListener("click", () => {
  homeSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

closeModalButton.addEventListener("click", closeModal);
cancelButton.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (!modal.classList.contains("is-open")) return;

  if (event.key === "Escape") {
    closeModal();
    return;
  }

  trapFocus(event);
});

termsCheckbox.addEventListener("change", () => {
  if (termsCheckbox.checked) {
    termsError.textContent = "";
    termsGroup.classList.remove("has-error");
  }
});

quoteForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!quoteForm.reportValidity()) {
    return;
  }

  if (!termsCheckbox.checked) {
    termsError.textContent = "You must agree to the Terms of Service to continue.";
    termsGroup.classList.add("has-error");
    termsCheckbox.focus();
    return;
  }

  const payload = {
    plan: quotePlanInput.value,
    name: document.getElementById("full-name").value.trim(),
    email: document.getElementById("email").value.trim(),
    instagram: document.getElementById("instagram").value.trim(),
    songLink: document.getElementById("song-link").value.trim(),
    budget: budgetSelect.value,
    goal: document.getElementById("goal").value,
    notes: document.getElementById("notes").value.trim(),
  };

  successMessage.textContent = "";
  successMessage.classList.remove("is-error");
  termsError.textContent = "";
  termsGroup.classList.remove("has-error");

  try {
    const response = await fetch("https://formspree.io/f/mzdadgoo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    successMessage.textContent = "Thanks — I’ll reach out within 24 hours.";
    quoteForm.reset();
    quotePlanInput.value = payload.plan;
    setBudgetsForPlan(payload.plan);
  } catch (error) {
    successMessage.textContent = "Something went wrong sending your request. Please try again.";
    successMessage.classList.add("is-error");
  }
});

yearEl.textContent = new Date().getFullYear();
