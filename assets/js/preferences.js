/* Shared appearance and workspace preferences for every CRM page. */
(function () {
  const STORAGE_KEY = "food-crm-settings";
  const LAST_PAGE_KEY = "food-crm-last-page";
  const SESSION_KEY = "food-crm-session";

  const workspaceDefaults = {
    theme: "light",
    fontSize: "medium",
    density: "comfortable",
    accent: "navy",
    rememberLastPage: true,
    collapsedSidebar: false
  };

  function read() {
    let stored = {};
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (error) {
      stored = {};
    }
    return { ...workspaceDefaults, ...stored };
  }

  function currentPage() {
    const file = decodeURIComponent((location.pathname.split("/").pop() || "index.html")).split("?")[0];
    return /^[A-Za-z0-9._-]+\.html$/.test(file) ? file : "index.html";
  }

  function safePage(name) {
    return typeof name === "string" && /^[A-Za-z0-9._-]+\.html$/.test(name) ? name : null;
  }

  function resolveTheme(theme) {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme === "dark" ? "dark" : "light";
  }

  function syncThemeIcon() {
    const icon = document.getElementById("themeIcon");
    if (!icon) return;
    const dark = document.documentElement.getAttribute("data-bs-theme") === "dark";
    icon.className = dark ? "bi bi-sun" : "bi bi-moon-stars";
  }

  function apply(prefs) {
    const root = document.documentElement;
    root.setAttribute("data-bs-theme", resolveTheme(prefs.theme));
    root.setAttribute("data-font-size", prefs.fontSize || "medium");
    root.setAttribute("data-density", prefs.density || "comfortable");
    root.setAttribute("data-accent", prefs.accent || "navy");
    root.classList.toggle("sidebar-collapsed", Boolean(prefs.collapsedSidebar));
    syncThemeIcon();
  }

  function write(next) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    localStorage.setItem("food-crm-theme", next.theme);
    localStorage.setItem("food-crm-font-size", next.fontSize);
    localStorage.setItem("food-crm-density", next.density);
    localStorage.setItem("food-crm-accent", next.accent);
  }

  function publish(prefs) {
    document.dispatchEvent(new CustomEvent("foodcrm:preferences", { detail: prefs }));
  }

  function update(partial) {
    const next = { ...read(), ...partial };
    write(next);
    apply(next);
    publish(next);
    return next;
  }

  function resetWorkspace() {
    const next = { ...read(), ...workspaceDefaults };
    write(next);
    localStorage.removeItem(LAST_PAGE_KEY);
    apply(next);
    publish(next);
    return next;
  }

  function rememberPage(prefs) {
    const page = currentPage();
    const last = safePage(localStorage.getItem(LAST_PAGE_KEY));
    const started = sessionStorage.getItem(SESSION_KEY) === "1";

    if (prefs.rememberLastPage && !started && page === "index.html" && last && last !== "index.html") {
      sessionStorage.setItem(SESSION_KEY, "1");
      location.replace(last);
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "1");
    if (prefs.rememberLastPage) {
      localStorage.setItem(LAST_PAGE_KEY, page);
    }
  }

  const initial = read();
  apply(initial);
  rememberPage(initial);

  window.FoodCRM = {
    defaults: workspaceDefaults,
    get: read,
    update,
    resetWorkspace
  };

  document.addEventListener("DOMContentLoaded", () => {
    syncThemeIcon();
    document.querySelectorAll(".app-nav .nav-link").forEach((link) => {
      const label = link.querySelector("span")?.textContent?.trim();
      if (label && !link.getAttribute("title")) link.setAttribute("title", label);
    });
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const prefs = read();
    if (prefs.theme !== "system") return;
    apply(prefs);
    publish(prefs);
  });
})();
