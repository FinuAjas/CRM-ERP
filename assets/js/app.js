/* =========================================================
   Food CRM Dashboard JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const sidebar = document.getElementById("appSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarClose = document.getElementById("sidebarClose");
  const themeToggle = document.getElementById("themeToggle");

  // ---------------------------------------------------------
  // Theme toggle stays in sync with Settings → Appearance
  // ---------------------------------------------------------
  themeToggle?.addEventListener("click", () => {
    const resolved = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    window.FoodCRM?.update({ theme: resolved });
    setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
  });

  // ---------------------------------------------------------
  // Mobile sidebar
  // ---------------------------------------------------------
  function openSidebar() {
    sidebar?.classList.add("is-open");
    backdrop?.classList.add("is-visible");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar?.classList.remove("is-open");
    backdrop?.classList.remove("is-visible");
    document.body.style.overflow = "";
  }

  // User-configurable mobile navigation (Home is always the first shortcut).
  const shortcutsKey = "food-crm-mobile-shortcuts";
  const appNavigation = document.querySelector(".app-nav");
  const homeLink = [...(appNavigation?.querySelectorAll('a[href]') || [])].find(link => {
    const url = new URL(link.href, location.href);
    return url.pathname.endsWith("/index.html") && !url.search;
  });
  const shortcutIcon = (label, href) => {
    const key = `${label} ${href}`.toLowerCase();
    if (key.includes("index.html") || key.includes("dashboard")) return "house-door";
    if (key.includes("customer")) return "people";
    if (key.includes("product") || key.includes("inventory") || key.includes("stock")) return "boxes";
    if (key.includes("sales") || key.includes("invoice") || key.includes("order")) return "receipt";
    if (key.includes("payment") || key.includes("collection")) return "cash-coin";
    if (key.includes("report")) return "bar-chart-line";
    if (key.includes("purchase")) return "bag-check";
    if (key.includes("supplier")) return "truck";
    if (key.includes("return")) return "arrow-return-left";
    if (key.includes("support") || key.includes("crm")) return "headset";
    if (key.includes("staff") || key.includes("user")) return "person-badge";
    if (key.includes("account")) return "bank";
    if (key.includes("scheme") || key.includes("offer")) return "megaphone";
    return "grid";
  };
  const shortcutOptions = [];
  const rememberOption = (href, label, fixed = false) => {
    const url = new URL(href, location.href);
    if (url.origin !== location.origin || !url.pathname.toLowerCase().endsWith(".html")) return;
    const id = `${url.pathname}${url.search}`;
    if (shortcutOptions.some(option => option.id === id)) return;
    shortcutOptions.push({ id, href: url.href, label: label.trim().replace(/\s+/g, " "), icon: fixed ? "house-door-fill" : shortcutIcon(label, url.href), fixed });
  };
  if (homeLink) rememberOption(homeLink.href, "Home", true);
  [...(appNavigation?.querySelectorAll('a[href]') || [])].forEach(link => {
    const label = link.textContent.trim().replace(/\s+/g, " ");
    if (!label || label.length > 42) return;
    rememberOption(link.href, label);
  });
  if (!shortcutOptions.some(option => option.fixed)) {
    rememberOption(new URL("index.html", location.href).href, "Home", true);
  }
  const homeShortcut = shortcutOptions.find(option => option.fixed);
  const readShortcuts = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(shortcutsKey) || "null");
      const valid = Array.isArray(stored) ? stored.filter(id => shortcutOptions.some(option => option.id === id)) : [];
      const selected = [homeShortcut.id, ...valid.filter(id => id !== homeShortcut.id)];
      return [...new Set(selected)].slice(0, 5);
    } catch (error) {
      return [homeShortcut.id];
    }
  };
  const writeShortcuts = ids => {
    const valid = ids.filter(id => shortcutOptions.some(option => option.id === id));
    const selected = [homeShortcut.id, ...valid.filter(id => id !== homeShortcut.id)];
    const limited = [...new Set(selected)].slice(0, 5);
    localStorage.setItem(shortcutsKey, JSON.stringify(limited));
    renderShortcutBar(limited);
    return limited;
  };
  function renderShortcutBar(selected = readShortcuts()) {
    if (!appNavigation || !homeShortcut) return;
    let bar = document.querySelector("[data-mobile-shortcut-bar]");
    if (!bar) {
      bar = document.createElement("nav");
      bar.className = "mobile-shortcut-nav";
      bar.dataset.mobileShortcutBar = "";
      bar.setAttribute("aria-label", "Mobile shortcuts");
      document.body.append(bar);
    }
    const options = selected.map(id => shortcutOptions.find(option => option.id === id)).filter(Boolean);
    bar.dataset.count = String(options.length);
    bar.style.setProperty("--shortcut-count", String(options.length));
    bar.replaceChildren();
    options.forEach(option => {
      const link = document.createElement("a");
      link.className = "mobile-shortcut-link";
      link.href = option.href;
      const current = new URL(option.href, location.href).pathname === location.pathname;
      if (current) { link.classList.add("active"); link.setAttribute("aria-current", "page"); }
      const icon = document.createElement("i"); icon.className = `bi bi-${option.icon}`; ariaHidden(icon);
      const label = document.createElement("span"); label.textContent = option.label;
      link.append(icon, label);
      bar.append(link);
    });
    document.body.classList.add("has-mobile-shortcuts");
  }
  function ariaHidden(element) { element.setAttribute("aria-hidden", "true"); }
  localStorage.setItem(shortcutsKey, JSON.stringify(readShortcuts()));
  renderShortcutBar();
  window.FoodCRMShortcuts = {
    getOptions: () => shortcutOptions.map(option => ({ ...option })),
    getSelected: readShortcuts,
    setSelected: writeShortcuts,
    reset: () => writeShortcuts([homeShortcut.id])
  };

  sidebarToggle?.addEventListener("click", openSidebar);
  sidebarClose?.addEventListener("click", closeSidebar);
  backdrop?.addEventListener("click", closeSidebar);

  document.querySelectorAll(".app-nav .nav-link").forEach(link => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".app-nav .nav-link").forEach(item => item.classList.remove("active"));
      link.classList.add("active");
      if (window.innerWidth < 992) closeSidebar();
    });
  });

  // ---------------------------------------------------------
  // Chart helpers
  // ---------------------------------------------------------
  const isDark = () => root.getAttribute("data-bs-theme") === "dark";
  const css = (name) => getComputedStyle(root).getPropertyValue(name).trim();

  const gridColor = () => isDark() ? "rgba(255,255,255,.055)" : "rgba(19,49,78,.07)";
  const tickColor = () => isDark() ? "#8ea0b5" : "#8a96a5";

  // Sales trend
  const salesCtx = document.getElementById("salesTrendChart");
  if (salesCtx && window.Chart) {
    new Chart(salesCtx, {
      type: "line",
      data: {
        labels: ["1 Sep", "3 Sep", "5 Sep", "7 Sep", "10 Sep", "12 Sep", "15 Sep", "17 Sep", "20 Sep", "21 Sep"],
        datasets: [
          {
            label: "Sales",
            data: [280000, 360000, 275000, 290000, 355000, 302000, 420000, 350000, 468000, 410000],
            borderColor: "#0b936d",
            backgroundColor: "rgba(11,147,109,.08)",
            fill: true,
            tension: .42,
            borderWidth: 2.2,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: "#0b936d"
          },
          {
            label: "Collection",
            data: [220000, 300000, 215000, 205000, 275000, 230000, 315000, 270000, 370000, 310000],
            borderColor: "#1b74cf",
            backgroundColor: "rgba(27,116,207,.02)",
            fill: false,
            tension: .42,
            borderWidth: 2,
            pointRadius: 2.5,
            pointHoverRadius: 5,
            pointBackgroundColor: "#1b74cf"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark() ? "#102236" : "#13253a",
            padding: 10,
            titleFont: { family: "Poppins", size: 10, weight: "600" },
            bodyFont: { family: "Poppins", size: 9 },
            displayColors: true,
            callbacks: {
              label: (context) => `${context.dataset.label}: ₹${new Intl.NumberFormat("en-IN").format(context.parsed.y)}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: tickColor(), font: { family: "Poppins", size: 8 }, maxRotation: 0 }
          },
          y: {
            beginAtZero: true,
            grid: { color: gridColor(), drawTicks: false },
            border: { display: false },
            ticks: {
              color: tickColor(),
              font: { family: "Poppins", size: 8 },
              padding: 7,
              callback: value => "₹" + (value / 100000).toFixed(1) + "L"
            }
          }
        }
      }
    });
  }

  // Category donut
  const categoryCtx = document.getElementById("categoryChart");
  if (categoryCtx && window.Chart) {
    new Chart(categoryCtx, {
      type: "doughnut",
      data: {
        labels: ["Puttu Podi", "Masalas", "Pickles", "Tea & Coffee", "Snacks", "Others"],
        datasets: [{
          data: [28, 22, 15, 12, 10, 13],
          backgroundColor: ["#149d6e", "#f3a31c", "#d94d5b", "#8c5a31", "#2475d0", "#8492a3"],
          borderWidth: 2,
          borderColor: isDark() ? "#0d1b2b" : "#ffffff",
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "70%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark() ? "#102236" : "#13253a",
            padding: 9,
            titleFont: { family: "Poppins", size: 9 },
            bodyFont: { family: "Poppins", size: 9 },
            callbacks: { label: ctx => `${ctx.label}: ${ctx.raw}%` }
          }
        }
      }
    });
  }

  // ---------------------------------------------------------
  // Branch selector
  // ---------------------------------------------------------
  document.querySelectorAll(".branch-menu [data-branch]").forEach(item => {
    item.addEventListener("click", () => {
      const selected = document.getElementById("selectedBranch");
      if (selected) selected.textContent = item.dataset.branch;

      document.querySelectorAll(".branch-menu .dropdown-item").forEach(option => option.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // ---------------------------------------------------------
  // Expandable global search
  // ---------------------------------------------------------
  const topbarSearch = document.getElementById("topbarSearch");
  const searchToggle = document.getElementById("searchToggle");
  const globalSearch = document.getElementById("globalSearch");
  const searchPreview = document.getElementById("searchResultsPreview");

  function openSearch() {
    topbarSearch?.classList.add("is-expanded");
    setTimeout(() => globalSearch?.focus(), 120);
  }

  function closeSearch() {
    topbarSearch?.classList.remove("is-expanded");
    searchPreview?.classList.remove("is-visible");
  }

  searchToggle?.addEventListener("click", () => {
    if (topbarSearch?.classList.contains("is-expanded")) {
      if (globalSearch?.value.trim()) {
        searchPreview?.classList.add("is-visible");
      } else {
        closeSearch();
      }
    } else {
      openSearch();
    }
  });

  globalSearch?.addEventListener("focus", () => {
    if (!globalSearch.value.trim()) searchPreview?.classList.add("is-visible");
  });

  globalSearch?.addEventListener("input", () => {
    searchPreview?.classList.add("is-visible");
  });

  document.addEventListener("click", (event) => {
    if (topbarSearch && !topbarSearch.contains(event.target) &&
        searchPreview && !searchPreview.contains(event.target)) {
      if (!globalSearch?.value.trim()) closeSearch();
    }
  });

  globalSearch?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      globalSearch.value = "";
      closeSearch();
      searchToggle?.focus();
    }
  });

  // ---------------------------------------------------------
  // Demo filter interaction
  // ---------------------------------------------------------
  document.querySelectorAll(".filter-card .form-select").forEach(select => {
    select.addEventListener("change", () => {
      // Placeholder for Django AJAX/filter implementation.
      // Connect this to your dashboard endpoint later.
      select.classList.add("filter-touched");
      setTimeout(() => select.classList.remove("filter-touched"), 250);
    });
  });

  // Interactive Kerala district sales map on the main dashboard.
  const districtMap = document.querySelector(".kerala-map");
  if (districtMap) {
    const mapWrap = districtMap.closest(".kerala-map-wrap");
    const tooltip = mapWrap?.querySelector("[data-district-tooltip]");
    const nameOutput = document.querySelector("[data-district-name]");
    const salesOutput = document.querySelector("[data-district-sales]");
    const ordersOutput = document.querySelector("[data-district-orders]");
    const outletsOutput = document.querySelector("[data-district-outlets]");
    const formatRupees = amount => `₹${Number(amount).toLocaleString("en-IN")}`;
    const formatCount = amount => Number(amount).toLocaleString("en-IN");
    const districts = [...districtMap.querySelectorAll("[data-district]")];
    const showTooltip = (district, event) => {
      if (!tooltip) return;
      const amount = formatRupees(district.dataset.sales);
      tooltip.replaceChildren();
      const label = document.createElement("strong"); label.textContent = district.dataset.district;
      const value = document.createElement("span"); value.textContent = amount;
      tooltip.append(label, value);
      tooltip.hidden = false;
      if (event?.clientX != null) {
        const rect = mapWrap.getBoundingClientRect();
        tooltip.style.left = `${Math.max(0, Math.min(event.clientX - rect.left + 8, rect.width - 142))}px`;
        tooltip.style.top = `${Math.max(0, event.clientY - rect.top - 34)}px`;
      } else {
        tooltip.style.left = "8px";
        tooltip.style.top = "8px";
      }
    };
    const selectDistrict = district => {
      districts.forEach(item => {
        const selected = item === district;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      if (nameOutput) nameOutput.textContent = district.dataset.district;
      if (salesOutput) salesOutput.textContent = formatRupees(district.dataset.sales);
      if (ordersOutput) ordersOutput.textContent = formatCount(district.dataset.orders);
      if (outletsOutput) outletsOutput.textContent = formatCount(district.dataset.outlets);
    };
    districts.forEach(district => {
      district.setAttribute("aria-pressed", String(district.dataset.district === "Kannur"));
      district.addEventListener("pointerenter", event => showTooltip(district, event));
      district.addEventListener("pointermove", event => showTooltip(district, event));
      district.addEventListener("pointerleave", () => { if (tooltip) tooltip.hidden = true; });
      district.addEventListener("focus", () => showTooltip(district));
      district.addEventListener("blur", () => { if (tooltip) tooltip.hidden = true; });
      district.addEventListener("click", () => selectDistrict(district));
      district.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectDistrict(district); showTooltip(district); }
      });
    });
  }
});


/* =========================================================
   Additional dashboard bar charts
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof Chart === "undefined") return;

  const css = getComputedStyle(document.documentElement);
  const textColor = css.getPropertyValue("--muted").trim() || "#718096";
  const gridColor = "rgba(120,145,170,.14)";

  const makeBar = (id, labels, values, prefix = "") => {
    const canvas = document.getElementById(id);
    if (!canvas) return;

    new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          data: values,
          borderRadius: 5,
          borderSkipped: false,
          maxBarThickness: 30
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `${prefix}${Number(ctx.raw).toLocaleString("en-IN")}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { family: "Poppins", size: 9 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: "Poppins", size: 8 },
              callback: value => prefix + Number(value).toLocaleString("en-IN")
            }
          }
        }
      }
    });
  };

  makeBar("salesChannelBar",
    ["Retail", "Wholesale", "Institution", "Supermarket", "Other"],
    [1118250, 372800, 248500, 497000, 248450], "₹");

  makeBar("collectionModeBar",
    ["Cash", "UPI", "Bank", "Credit"],
    [720000, 615000, 380000, 149000], "₹");

  makeBar("categoryUnitsBar",
    ["Puttu", "Masalas", "Pickles", "Tea", "Snacks", "Other"],
    [8250, 6460, 5740, 4120, 3580, 2930]);
});
