
document.addEventListener("DOMContentLoaded", () => {
  const KEY = {
    theme: "food-crm-theme",
    fontSize: "food-crm-font-size",
    density: "food-crm-density",
    accent: "food-crm-accent",
    settings: "food-crm-settings"
  };

  const defaults = {
    theme: "light",
    fontSize: "medium",
    density: "comfortable",
    accent: "navy",
    rememberLastPage: true,
    collapsedSidebar: false,
    lowStockAlerts: true,
    paymentAlerts: true,
    newOrders: true,
    expiryReminders: true,
    language: "English",
    currency: "Indian Rupee (₹)",
    dateFormat: "DD-MM-YYYY",
    timezone: "Asia/Kolkata (IST)",
    showSalesKpis: true,
    showStockAlerts: true,
    reportPeriod: "This Month",
    sessionTimeout: "30 minutes",
    twoFactor: false,
    loginAlerts: true
  };

  const stored = JSON.parse(localStorage.getItem(KEY.settings) || "{}");
  const state = { ...defaults, ...stored };

  const themeButtons = document.querySelectorAll("[data-theme-choice]");
  const fontButtons = document.querySelectorAll("[data-font-size]");
  const accentButtons = document.querySelectorAll("[data-accent]");
  const densitySelect = document.getElementById("densitySelect");
  const toast = document.getElementById("settingsToast");

  function saveState() {
    const live = window.FoodCRM?.get?.();
    if (live) {
      ["theme", "fontSize", "density", "accent", "rememberLastPage", "collapsedSidebar"].forEach((key) => {
        state[key] = live[key];
      });
    }
    localStorage.setItem(KEY.settings, JSON.stringify(state));
    localStorage.setItem(KEY.theme, state.theme);
    localStorage.setItem(KEY.fontSize, state.fontSize);
    localStorage.setItem(KEY.density, state.density);
    localStorage.setItem(KEY.accent, state.accent);
  }

  function showToast(message, type = "success") {
    if (!toast) return;
    const text = toast.querySelector("span");
    if (text) text.textContent = message;
    const icon = toast.querySelector("i");
    if (icon) {
      icon.className = type === "danger"
        ? "bi bi-exclamation-circle-fill text-danger"
        : "bi bi-check-circle-fill text-success";
    }
    toast.classList.add("show");
    clearTimeout(window.__foodCrmToast);
    window.__foodCrmToast = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  const shortcutOptionsHost = document.querySelector("[data-shortcut-options]");
  const shortcutCount = document.querySelector("[data-shortcut-count]");
  const shortcutApi = window.FoodCRMShortcuts;
  if (shortcutOptionsHost && shortcutApi) {
    const options = shortcutApi.getOptions();
    const renderShortcuts = () => {
      const selected = shortcutApi.getSelected();
      shortcutOptionsHost.replaceChildren();
      const orderedOptions = [
        ...selected.map(id => options.find(option => option.id === id)).filter(Boolean),
        ...options.filter(option => !selected.includes(option.id))
      ];
      orderedOptions.forEach(option => {
        const label = document.createElement("label");
        label.className = `mobile-shortcut-option${selected.includes(option.id) ? " is-selected" : ""}`;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input";
        checkbox.checked = selected.includes(option.id);
        checkbox.disabled = option.fixed || (!checkbox.checked && selected.length >= 5);
        checkbox.setAttribute("aria-label", `Show ${option.label} in the mobile shortcut bar`);
        checkbox.addEventListener("change", () => {
          const current = shortcutApi.getSelected();
          if (checkbox.checked && current.length >= 5) {
            checkbox.checked = false;
            showToast("Choose up to five mobile shortcuts.", "danger");
            return;
          }
          shortcutApi.setSelected(checkbox.checked ? [...current, option.id] : current.filter(id => id !== option.id));
          renderShortcuts();
          showToast("Mobile shortcuts saved.");
        });
        const icon = document.createElement("i");
        icon.className = `bi bi-${option.icon}`;
        icon.setAttribute("aria-hidden", "true");
        const text = document.createElement("span");
        text.textContent = option.label;
        label.append(checkbox, icon, text);
        shortcutOptionsHost.append(label);
      });
      if (shortcutCount) shortcutCount.textContent = String(selected.length);
    };
    renderShortcuts();
    document.getElementById("resetSettings")?.addEventListener("click", () => {
      shortcutApi.reset();
      renderShortcuts();
    });
    document.getElementById("resetSettingsDanger")?.addEventListener("click", () => {
      shortcutApi.reset();
      renderShortcuts();
    });
  }

  function syncWorkspace(prefs) {
    if (!prefs) return;
    themeButtons.forEach(btn => {
      const active = btn.dataset.themeChoice === prefs.theme;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    fontButtons.forEach(btn => {
      const active = btn.dataset.fontSize === prefs.fontSize;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    accentButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.accent === prefs.accent));
    if (densitySelect) densitySelect.value = prefs.density;
    setChecked("rememberLastPage", prefs.rememberLastPage);
    setChecked("collapsedSidebar", prefs.collapsedSidebar);
  }

  function setChecked(id, value) {
    const el = document.getElementById(id);
    if (el) el.checked = Boolean(value);
  }

  function getChecked(id) {
    return Boolean(document.getElementById(id)?.checked);
  }

  function setSelect(id, value) {
    const el = document.getElementById(id);
    if (el && Array.from(el.options).some(o => o.value === value)) el.value = value;
  }

  function bindCheckbox(id, key) {
    const el = document.getElementById(id);
    if (!el) return;
    el.checked = Boolean(state[key]);
    el.addEventListener("change", () => {
      state[key] = el.checked;
      saveState();
      showToast("Preference updated.");
    });
  }

  function bindSelect(id, key) {
    const el = document.getElementById(id);
    if (!el) return;
    setSelect(id, state[key]);
    el.addEventListener("change", () => {
      state[key] = el.value;
      saveState();
      showToast("Preference updated.");
    });
  }

  syncWorkspace(window.FoodCRM?.get());
  document.addEventListener("foodcrm:preferences", (event) => syncWorkspace(event.detail));

  themeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      window.FoodCRM?.update({ theme: btn.dataset.themeChoice });
      showToast("Theme preference updated.");
    });
  });

  fontButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      window.FoodCRM?.update({ fontSize: btn.dataset.fontSize });
      showToast("Font size updated.");
    });
  });

  densitySelect?.addEventListener("change", () => {
    window.FoodCRM?.update({ density: densitySelect.value });
    showToast("Layout density updated.");
  });

  accentButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      window.FoodCRM?.update({ accent: btn.dataset.accent });
      showToast("Theme color updated.");
    });
  });

  document.getElementById("rememberLastPage")?.addEventListener("change", (event) => {
    window.FoodCRM?.update({ rememberLastPage: event.target.checked });
    showToast("Preference updated.");
  });

  document.getElementById("collapsedSidebar")?.addEventListener("change", (event) => {
    window.FoodCRM?.update({ collapsedSidebar: event.target.checked });
    showToast("Preference updated.");
  });
  bindCheckbox("lowStockAlerts", "lowStockAlerts");
  bindCheckbox("paymentAlerts", "paymentAlerts");
  bindCheckbox("newOrders", "newOrders");
  bindCheckbox("expiryReminders", "expiryReminders");
  bindCheckbox("showSalesKpis", "showSalesKpis");
  bindCheckbox("showStockAlerts", "showStockAlerts");
  bindCheckbox("twoFactor", "twoFactor");
  bindCheckbox("loginAlerts", "loginAlerts");

  bindSelect("languageSelect", "language");
  bindSelect("currencySelect", "currency");
  bindSelect("dateFormatSelect", "dateFormat");
  bindSelect("timezoneSelect", "timezone");
  bindSelect("reportPeriodSelect", "reportPeriod");
  bindSelect("sessionTimeoutSelect", "sessionTimeout");

  document.getElementById("saveSettings")?.addEventListener("click", () => {
    // All controls already persist immediately; this gives the user explicit
    // confirmation that the current configuration is stored.
    saveState();
    showToast("All settings saved successfully.");
  });

  function resetWorkspace() {
    const next = window.FoodCRM?.resetWorkspace();
    if (next) {
      ["theme", "fontSize", "density", "accent", "rememberLastPage", "collapsedSidebar"].forEach((key) => {
        state[key] = next[key];
      });
    }
    showToast("Appearance and layout restored to defaults.");
  }

  document.getElementById("resetSettings")?.addEventListener("click", resetWorkspace);
  document.getElementById("resetSettingsDanger")?.addEventListener("click", resetWorkspace);

  document.querySelectorAll('.settings-nav a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.querySelectorAll(".settings-nav a").forEach(a => a.classList.remove("active"));
      link.classList.add("active");
    });
  });
});
