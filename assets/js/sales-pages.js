/* Reusable interactions for the static sales and collections pages. */
document.addEventListener("DOMContentLoaded", () => {
  const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  function showToast(message) {
    const toast = document.getElementById("salesToast");
    if (!toast) return;
    const text = toast.querySelector("span");
    if (text) text.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(window.foodCrmSalesToastTimer);
    window.foodCrmSalesToastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function normalizePage(value) {
    try { return decodeURIComponent(value.split("?")[0].split("#")[0]); }
    catch { return value; }
  }

  const currentPage = normalizePage(location.pathname.split("/").pop() || "index.html");
  const parentPages = {
    "sales-order-details.html": "sales-orders.html",
    "sales-invoice-details.html": "sales-invoices.html",
    "sales-return-details.html": "sales-returns.html",
    "customer-payment-details.html": "customer-payments.html",
    "sales-order-create.html": "sales-orders.html",
    "sales-invoice-create.html": "sales-invoices.html",
    "sales-return-create.html": "sales-returns.html",
    "customer-payment-create.html": "customer-payments.html",
    "product-edit.html": "products.html",
    "product-details.html": "products.html",
    "product-batch-details.html": "product-batches.html",
    "user-create.html": "users.html",
    "user-details.html": "users.html",
    "user-edit.html": "users.html",
    "journal-entry-create.html": "journal-entries.html",
    "expense-create.html": "expenses.html"
  };
  const activePage = parentPages[currentPage] || currentPage;
  let activeSubLink = null;
  document.querySelectorAll(".app-nav .nav-sublink").forEach(link => {
    const targetPage = normalizePage(new URL(link.href, location.href).pathname.split("/").pop());
    const active = targetPage === activePage;
    link.classList.toggle("active", active);
    if (active) activeSubLink = link;
  });
  if (activeSubLink) {
    const menu = activeSubLink.closest(".nav-submenu");
    menu?.classList.add("show");
    const toggle = menu?.previousElementSibling;
    toggle?.classList.add("active");
    toggle?.setAttribute("aria-expanded", "true");
  }

  const formatCurrency = value => currency.format(Number.isFinite(value) ? value : 0);

  const detailRecords = {
    "sales-order-details.html": {
      "SO-2026-0912": ["Green Basket Supermarket", "Anjali Menon", "26 Sep 2026", "Processing", "Partial", "₹ 18,420.00", "₹ 8,000.00", "₹ 10,420.00"],
      "SO-2026-0911": ["City Bakery & Stores", "Arjun Nair", "26 Sep 2026", "Confirmed", "Paid", "₹ 9,860.00", "₹ 9,860.00", "₹ 0.00"],
      "SO-2026-0910": ["Fatima Traders", "Fathima K.", "25 Sep 2026", "Delivered", "Partial", "₹ 32,500.00", "₹ 20,000.00", "₹ 12,500.00"],
      "SO-2026-0909": ["Fresh Mart Kochi", "Rahul Das", "25 Sep 2026", "Processing", "Unpaid", "₹ 14,280.00", "₹ 0.00", "₹ 14,280.00"],
      "SO-2026-0908": ["Malabar Food Hub", "Anjali Menon", "24 Sep 2026", "Confirmed", "Partial", "₹ 21,760.00", "₹ 10,000.00", "₹ 11,760.00"],
      "SO-2026-0907": ["Spice Route Retail", "Arjun Nair", "23 Sep 2026", "Delivered", "Paid", "₹ 7,420.00", "₹ 7,420.00", "₹ 0.00"],
      "SO-2026-0906": ["Cochin Catering Co.", "Rahul Das", "22 Sep 2026", "Draft", "Unpaid", "₹ 26,840.00", "₹ 0.00", "₹ 26,840.00"]
    },
    "sales-invoice-details.html": {
      "INV-2026-0912": ["Green Basket Supermarket", "Anjali Menon", "26 Sep 2026", "Sent", "Partial", "₹ 18,420.00", "₹ 8,000.00", "₹ 10,420.00"],
      "INV-2026-0911": ["City Bakery & Stores", "Arjun Nair", "25 Sep 2026", "Paid", "Paid", "₹ 9,860.00", "₹ 9,860.00", "₹ 0.00"],
      "INV-2026-0908": ["Fatima Traders", "Fathima K.", "10 Aug 2026", "Sent", "Overdue", "₹ 32,500.00", "₹ 20,000.00", "₹ 12,500.00"],
      "INV-2026-0906": ["Fresh Mart Kochi", "Rahul Das", "22 Sep 2026", "Sent", "Unpaid", "₹ 14,280.00", "₹ 0.00", "₹ 14,280.00"],
      "INV-2026-0901": ["Malabar Food Hub", "Anjali Menon", "20 Sep 2026", "Paid", "Paid", "₹ 21,760.00", "₹ 21,760.00", "₹ 0.00"],
      "INV-2026-0882": ["Fatima Traders", "Fathima K.", "18 Sep 2026", "Sent", "Partial", "₹ 16,400.00", "₹ 8,000.00", "₹ 8,400.00"]
    },
    "sales-return-details.html": {
      "RET-2026-0198": ["City Bakery & Stores", "Arjun Nair", "25 Sep 2026", "Pending review", "Credit note", "₹ 386.40", "—", "₹ 386.40"],
      "RET-2026-0194": ["Fatima Traders", "Fathima K.", "23 Sep 2026", "Approved", "Credit note", "₹ 420.00", "—", "₹ 420.00"],
      "RET-2026-0189": ["Fresh Mart Kochi", "Rahul Das", "21 Sep 2026", "Credit issued", "Credit note", "₹ 1,256.00", "—", "₹ 1,256.00"],
      "RET-2026-0181": ["Spice Route Retail", "Arjun Nair", "18 Sep 2026", "Rejected", "Credit note", "₹ 118.00", "—", "₹ 0.00"],
      "RET-2026-0176": ["Malabar Food Hub", "Anjali Menon", "16 Sep 2026", "Approved", "Credit note", "₹ 865.00", "—", "₹ 865.00"]
    },
    "customer-payment-details.html": {
      "REC-2026-0841": ["Fatima Traders", "Fathima K.", "26 Sep 2026 · 11:30 AM", "Allocated", "UPI", "₹ 12,400.00", "₹ 12,400.00", "₹ 0.00"],
      "REC-2026-0840": ["City Bakery & Stores", "Arjun Nair", "26 Sep 2026", "Allocated", "Bank transfer", "₹ 9,860.00", "₹ 9,860.00", "₹ 0.00"],
      "REC-2026-0837": ["Green Basket Supermarket", "Anjali Menon", "25 Sep 2026", "Unallocated", "Cash", "₹ 5,000.00", "₹ 5,000.00", "₹ 0.00"],
      "REC-2026-0832": ["Fresh Mart Kochi", "Rahul Das", "24 Sep 2026", "Reconciled", "UPI", "₹ 14,280.00", "₹ 14,280.00", "₹ 0.00"],
      "REC-2026-0828": ["Malabar Food Hub", "Anjali Menon", "22 Sep 2026", "Allocated", "Cash", "₹ 10,000.00", "₹ 10,000.00", "₹ 0.00"]
    }
  };

  const selectedRecordId = new URLSearchParams(location.search).get("id");
  const selectedRecord = detailRecords[currentPage]?.[selectedRecordId];
  if (selectedRecord) {
    const [customer, salesperson, date, status, payment, total, paid, balance] = selectedRecord;
    document.querySelectorAll("[data-record-reference]").forEach(node => { node.textContent = selectedRecordId; });
    document.querySelectorAll("[data-record-customer]").forEach(node => { node.textContent = customer; });
    document.querySelectorAll("[data-record-salesperson]").forEach(node => { node.textContent = salesperson; });
    document.querySelectorAll("[data-record-date]").forEach(node => { node.textContent = date; });
    const badge = label => {
      const value = label.toLowerCase();
      const tone = /paid|approved|delivered|complete|allocated|reconciled|issued/.test(value) ? "status-good"
        : /overdue|rejected|unpaid|cancel|failed/.test(value) ? "status-danger"
          : /pending|partial|processing|draft|review|unallocated/.test(value) ? "status-warning" : "status-info";
      return `<span class="status-pill ${tone}">${label}</span>`;
    };
    document.querySelectorAll("[data-record-status]").forEach(node => { node.innerHTML = badge(status); });
    document.querySelectorAll("[data-record-header-payment]").forEach(node => {
      node.innerHTML = currentPage === "customer-payment-details.html" ? payment : badge(payment);
    });
    document.querySelectorAll("[data-record-payment]").forEach(node => {
      if (currentPage === "customer-payment-details.html") node.textContent = payment;
      else node.innerHTML = badge(payment);
    });
    const values = { "[data-record-total]": total, "[data-record-paid]": paid, "[data-record-balance]": balance };
    if (currentPage === "sales-order-details.html" || currentPage === "sales-invoice-details.html") {
      values["[data-record-subtotal]"] = total;
      values["[data-record-discount]"] = "− ₹ 0.00";
      values["[data-record-tax]"] = "₹ 0.00";
    }
    if (currentPage === "sales-return-details.html") {
      const amount = Number(total.replace(/[^\d.]/g, "")) || 0;
      const subtotal = amount / 1.05;
      values["[data-record-subtotal]"] = formatCurrency(subtotal);
      values["[data-record-discount]"] = "− ₹ 0.00";
      values["[data-record-tax]"] = formatCurrency(amount - subtotal);
    }
    Object.entries(values).forEach(([selector, value]) => document.querySelectorAll(selector).forEach(node => { node.textContent = value; }));
  }

  function recalculate(form) {
    form.querySelectorAll("[data-line-items]").forEach(table => {
      let subtotal = 0;
      let discountTotal = 0;
      let taxTotal = 0;
      table.querySelectorAll("tbody tr").forEach((row, index) => {
        const qtyInput = row.querySelector("[data-qty]");
        const priceInput = row.querySelector("[data-price]");
        const discountInput = row.querySelector("[data-discount]");
        const taxInput = row.querySelector("[data-tax]");
        const qty = Math.max(0, Number(qtyInput?.value) || 0);
        const price = Math.max(0, Number(priceInput?.value) || 0);
        const discountPercent = Math.min(100, Math.max(0, Number(discountInput?.value) || 0));
        const taxPercent = Math.max(0, Number(taxInput?.value) || 0);
        const gross = qty * price;
        const discount = gross * discountPercent / 100;
        const tax = (gross - discount) * taxPercent / 100;
        const total = gross - discount + tax;
        subtotal += gross;
        discountTotal += discount;
        taxTotal += tax;
        const lineTotal = row.querySelector("[data-line-total]");
        if (lineTotal) lineTotal.textContent = formatCurrency(total);
        const numberCell = row.querySelector(".line-number");
        if (numberCell) numberCell.textContent = String(index + 1);
      });
      const grand = subtotal - discountTotal + taxTotal;
      const write = (selector, value) => {
        const element = form.querySelector(selector);
        if (element) element.textContent = value;
      };
      write("[data-subtotal]", formatCurrency(subtotal));
      write("[data-discount-total]", "− " + formatCurrency(discountTotal));
      write("[data-tax-total]", formatCurrency(taxTotal));
      write("[data-grand-total]", formatCurrency(grand));
      const paidInput = form.querySelector("[data-paid]");
      const paid = Math.max(0, Number(paidInput?.value) || 0);
      const balance = Math.max(0, grand - paid);
      write("[data-balance]", formatCurrency(balance));
      const paymentStatus = form.querySelector("[data-payment-status]");
      if (paymentStatus) {
        const status = paid <= 0 ? "Unpaid" : balance <= 0.005 ? "Paid" : "Partial";
        paymentStatus.innerHTML = `<span class="status-pill ${status === "Paid" ? "status-good" : status === "Partial" ? "status-warning" : "status-danger"}">${status}</span>`;
      }
    });
  }

  document.querySelectorAll(".sales-form, .crm-form").forEach(form => {
    recalculate(form);
    form.addEventListener("input", () => recalculate(form));
    form.addEventListener("change", event => {
      const product = event.target.closest("[data-product]");
      if (product) {
        const priceInput = product.closest("tr")?.querySelector("[data-price]");
        const price = product.selectedOptions?.[0]?.dataset.price;
        if (priceInput && price != null) priceInput.value = price;
      }
      recalculate(form);
    });
    form.addEventListener("submit", event => {
      event.preventDefault();
      showToast("Saved in this frontend demo. Connect a backend to persist the record.");
    });
  });

  document.querySelectorAll("[data-add-line]").forEach(button => {
    button.addEventListener("click", () => {
      const table = button.closest(".dashboard-card")?.querySelector("[data-line-items]");
      const firstRow = table?.querySelector("tbody tr");
      if (!table || !firstRow) return;
      const row = firstRow.cloneNode(true);
      row.querySelectorAll("input").forEach(input => {
        if (input.hasAttribute("data-qty")) input.value = "1";
        else if (input.hasAttribute("data-price")) input.value = "0";
        else input.value = "0";
      });
      const product = row.querySelector("[data-product]");
      if (product) product.selectedIndex = 0;
      const total = row.querySelector("[data-line-total]");
      if (total) total.textContent = formatCurrency(0);
      table.querySelector("tbody")?.append(row);
      const form = button.closest("form");
      if (form) recalculate(form);
    });
  });

  document.addEventListener("click", async event => {
    const removeButton = event.target.closest("[data-remove-line]");
    if (removeButton) {
      const table = removeButton.closest("[data-line-items]");
      const rows = table?.querySelectorAll("tbody tr");
      if (rows?.length > 1) removeButton.closest("tr")?.remove();
      const form = removeButton.closest("form");
      if (form) recalculate(form);
      return;
    }
    if (event.target.closest("[data-print]")) {
      window.print();
      return;
    }
    if (event.target.closest("[data-download]")) {
      window.print();
      showToast("Use your browser print dialog to save this record as PDF.");
      return;
    }
    const share = event.target.closest("[data-share]");
    if (share) {
      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(location.href);
        else {
          const temp = document.createElement("textarea");
          temp.value = location.href;
          temp.style.position = "fixed";
          temp.style.opacity = "0";
          document.body.append(temp);
          temp.select();
          document.execCommand("copy");
          temp.remove();
        }
        showToast("Record link copied to clipboard.");
      } catch {
        showToast("Share this page using your browser address bar.");
      }
      return;
    }
    const saveDraft = event.target.closest("[data-save-draft]");
    if (saveDraft) {
      showToast("Draft saved in this frontend demo.");
      return;
    }
    const permissionSave = event.target.closest("[data-save-permissions]");
    if (permissionSave) {
      showToast("Role permissions saved in this frontend demo.");
      return;
    }
    const addJournalLine = event.target.closest("[data-add-journal-line]");
    if (addJournalLine) {
      const body = addJournalLine.closest(".dashboard-card")?.querySelector("tbody");
      const source = body?.rows[body.rows.length - 1];
      if (source) {
        const row = source.cloneNode(true);
        row.querySelectorAll("input").forEach(input => { input.value = input.type === "number" ? "0" : ""; });
        body.append(row);
      }
      return;
    }
    const sampleDownload = event.target.closest("[data-import-export-download]");
    if (sampleDownload) {
      const csv = "Product name,SKU,Barcode,Category,Brand,Unit,Purchase price,Selling price,MRP,GST,Opening stock,Reorder level,Expiry date\r\nMalabar Puttu Podi 1kg,MRP-PUT-1KG,8906021456123,Puttu & Breakfast,Malabar Foods,Kg,104,145,165,5,245,50,2027-03-01\r\n";
      const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a"); link.href = url; link.download = "food-crm-product-template.csv"; document.body.append(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast("Sample product CSV downloaded.");
      return;
    }
    const rowPrint = event.target.closest("[data-row-print]");
    if (rowPrint) {
      window.print();
      return;
    }
    const bulkAction = event.target.closest("[data-bulk-action]");
    if (bulkAction) {
      const grid = bulkAction.closest("[data-sales-grid], [data-crm-grid]");
      const selected = grid ? [...grid.querySelectorAll("tbody .row-select:checked")].map(input => input.closest("tr")) : [];
      if (!selected.length) {
        showToast("Select at least one record first.");
      } else if (bulkAction.dataset.bulkAction === "export") {
        exportRows(grid, selected, "selected-records.csv");
      } else {
        window.print();
      }
    }
  });

  function csvValue(value) {
    return `"${String(value).replaceAll('"', '""')}"`;
  }

  function exportRows(grid, rows, filename) {
    if (!grid || !rows.length) {
      showToast("There are no records to export.");
      return;
    }
    const table = grid.querySelector("table");
    const headers = [...table.querySelectorAll("thead tr:first-child th")].slice(1, -1);
    const visibleIndexes = headers.map((header, index) => ({ header, index: index + 1 })).filter(item => !item.header.hidden);
    const lines = [visibleIndexes.map(item => csvValue(item.header.textContent.trim())).join(",")];
    rows.forEach(row => {
      const cells = [...row.cells];
      lines.push(visibleIndexes.map(item => csvValue(cells[item.index]?.innerText.trim() || "")).join(","));
    });
    const blob = new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`Exported ${rows.length} record${rows.length === 1 ? "" : "s"} to CSV.`);
  }

  function initGrid(grid) {
    const table = grid.querySelector("table");
    const tbody = table?.tBodies[0];
    if (!table || !tbody) return;
    const rows = [...tbody.rows];
    if (grid.dataset.crmGrid === "products") {
      const productImage = name => {
        const value = name.toLocaleLowerCase();
        if (value.includes("puttu")) return "puttu-podi.svg";
        if (value.includes("garam masala")) return "garam-masala.svg";
        if (value.includes("lemon pickle")) return "lemon-pickle.svg";
        if (value.includes("coconut pickle")) return "coconut-pickle.svg";
        if (value.includes("wayanad tea")) return "wayanad-tea.svg";
        if (value.includes("cardamom")) return "cardamom-powder.svg";
        if (value.includes("banana chips")) return "banana-chips.svg";
        if (value.includes("fish masala")) return "fish-masala.svg";
        if (value.includes("mango pickle")) return "mango-pickle.svg";
        if (value.includes("masala coffee")) return "masala-coffee.svg";
        return "puttu-podi.svg";
      };
      rows.forEach(row => {
        const name = row.cells[1]?.querySelector("strong")?.textContent.trim() || "Product";
        const sku = row.cells[1]?.querySelector("small")?.textContent.trim() || "";
        const imagePath = `assets/images/products/${productImage(name)}`;
        Object.assign(row.dataset, {
          productName: name, sku, barcode: row.cells[2]?.textContent.trim() || "",
          category: row.cells[3]?.textContent.trim() || "", brand: row.cells[4]?.textContent.trim() || "",
          price: row.cells[5]?.textContent.replace(/[^\d.]/g, "") || "0", mrp: row.cells[6]?.textContent.replace(/[^\d.]/g, "") || "0",
          stock: row.cells[7]?.textContent.trim() || "0", reorder: row.cells[8]?.textContent.trim() || "0",
          batch: row.cells[9]?.textContent.trim() || "", expiry: row.cells[10]?.textContent.trim() || "",
          stockStatus: Number(row.cells[7]?.textContent.trim() || 0) <= Number(row.cells[8]?.textContent.trim() || 0) ? "Low stock" : "In stock",
          productImage: imagePath
        });
        const thumb = row.querySelector(".product-thumb");
        if (thumb) {
          const img = document.createElement("img");
          img.src = imagePath; img.alt = name; img.loading = "lazy"; img.width = 48; img.height = 58;
          thumb.replaceChildren(img);
          thumb.setAttribute("aria-label", `${name} product image`);
        }
      });
    }
    const headerCells = [...table.querySelectorAll("thead tr:first-child th")];
    const filterCells = [...table.querySelectorAll("thead tr.column-filter-row th")];
    const empty = grid.querySelector("[data-grid-empty]");
    const loading = grid.querySelector("[data-grid-loading]");
    const search = grid.querySelector("[data-grid-search]");
    const statusFilter = grid.querySelector("[data-grid-status]");
    const dateFrom = grid.querySelector("[data-grid-date-from]");
    const dateTo = grid.querySelector("[data-grid-date-to]");
    const pageSizeSelect = grid.querySelector("[data-grid-page-size]");
    const pager = grid.querySelector("[data-grid-pagination]");
    const summary = grid.querySelector("[data-grid-summary]");
    const total = grid.querySelector("[data-grid-total]");
    const selectedCount = grid.querySelector("[data-grid-selected-count]");
    const columnMenu = grid.querySelector("[data-grid-columns]");
    const selectAll = grid.querySelector("[data-select-all]");
    let page = 1;
    let sortColumn = -1;
    let sortDirection = 1;
    let currentFiltered = [];
    const columnVisibility = headerCells.map(() => true);
    const tablePanel = grid.querySelector("[data-table-panel]");
    const cardPanel = grid.querySelector("[data-product-card-grid]");
    let productView = cardPanel ? "cards" : "list";

    if (statusFilter) {
      const statuses = [...new Set(rows.map(row => row.dataset.status).filter(Boolean))];
      statusFilter.replaceChildren(new Option("All statuses", ""));
      statuses.forEach(value => statusFilter.add(new Option(value, value)));
    }

    const populateFilter = (selector, datasetKey, label) => {
      const select = grid.querySelector(selector);
      if (!select) return;
      const values = [...new Set(rows.map(row => row.dataset[datasetKey]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
      select.replaceChildren(new Option(label, ""));
      values.forEach(value => select.add(new Option(value, value)));
    };
    populateFilter("[data-grid-category]", "category", "All categories");
    populateFilter("[data-grid-brand]", "brand", "All brands");
    populateFilter("[data-grid-stock]", "stockStatus", "All stock levels");

    if (columnMenu) {
      headerCells.forEach((header, index) => {
        if (index === 0 || index === headerCells.length - 1) return;
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        checkbox.className = "form-check-input m-0";
        checkbox.addEventListener("change", () => {
          columnVisibility[index] = checkbox.checked;
          applyVisibility();
        });
        const text = document.createElement("span");
        text.textContent = header.textContent.replace(/[↕↑↓]/g, "").trim();
        label.append(checkbox, text);
        columnMenu.append(label);
      });
    }

    function applyVisibility() {
      table.querySelectorAll("tr").forEach(row => {
        [...row.cells].forEach((cell, index) => {
          cell.hidden = columnVisibility[index] === false;
        });
      });
    }

    function selectedRows() {
      return [...grid.querySelectorAll("tbody .row-select:checked")].map(input => input.closest("tr"));
    }

    function updateSelection() {
      const selected = selectedRows();
      if (selectedCount) selectedCount.textContent = String(selected.length);
      rows.forEach(row => row.classList.toggle("is-selected", row.querySelector(".row-select")?.checked || false));
      if (selectAll) {
        const pageRows = currentFiltered.slice((page - 1) * pageSize(), page * pageSize());
        const checked = pageRows.filter(row => row.querySelector(".row-select")?.checked).length;
        selectAll.checked = pageRows.length > 0 && checked === pageRows.length;
        selectAll.indeterminate = checked > 0 && checked < pageRows.length;
      }
    }

    function pageSize() { return Math.max(1, Number(pageSizeSelect?.value || grid.dataset.pageSize || 10)); }

    function matchesFilters(row) {
      const query = (search?.value || "").trim().toLocaleLowerCase();
      const searchable = [row.innerText, row.dataset.productName, row.dataset.sku, row.dataset.barcode].filter(Boolean).join(" ").toLocaleLowerCase();
      if (query && !searchable.includes(query)) return false;
      if (statusFilter?.value && row.dataset.status !== statusFilter.value) return false;
      if (grid.querySelector("[data-grid-category]")?.value && row.dataset.category !== grid.querySelector("[data-grid-category]").value) return false;
      if (grid.querySelector("[data-grid-brand]")?.value && row.dataset.brand !== grid.querySelector("[data-grid-brand]").value) return false;
      if (grid.querySelector("[data-grid-stock]")?.value && row.dataset.stockStatus !== grid.querySelector("[data-grid-stock]").value) return false;
      const minPrice = Number(grid.querySelector("[data-grid-price-min]")?.value || 0);
      const maxPrice = Number(grid.querySelector("[data-grid-price-max]")?.value || 0);
      const rowPrice = Number(row.dataset.price || 0);
      if (minPrice && rowPrice < minPrice) return false;
      if (maxPrice && rowPrice > maxPrice) return false;
      const batchFilter = grid.querySelector("[data-grid-batch]")?.value.trim().toLocaleLowerCase();
      if (batchFilter && !String(row.dataset.batch || "").toLocaleLowerCase().includes(batchFilter)) return false;
      const expiryFilter = grid.querySelector("[data-grid-expiry]")?.value || "";
      if (expiryFilter && row.dataset.expiry) {
        const expiry = new Date(`${row.dataset.expiry}T00:00:00`);
        const now = new Date(); now.setHours(0, 0, 0, 0);
        const days = Math.ceil((expiry - now) / 86400000);
        if (expiryFilter === "expired" && days >= 0) return false;
        if (expiryFilter === "30" && (days < 0 || days > 30)) return false;
        if (expiryFilter === "90" && (days < 0 || days > 90)) return false;
      } else if (expiryFilter === "none" && row.dataset.expiry) return false;
      if (dateFrom?.value && row.dataset.date && row.dataset.date < dateFrom.value) return false;
      if (dateTo?.value && row.dataset.date && row.dataset.date > dateTo.value) return false;
      for (const input of grid.querySelectorAll(".column-filter")) {
        const queryValue = input.value.trim().toLocaleLowerCase();
        if (!queryValue) continue;
        const cell = row.cells[Number(input.dataset.column)];
        if (!cell?.innerText.toLocaleLowerCase().includes(queryValue)) return false;
      }
      return true;
    }

    function valueForSort(row, index) {
      const cell = row.cells[index];
      if (!cell) return "";
      const explicit = cell.dataset.sortValue;
      if (explicit !== undefined) return explicit;
      const value = cell.innerText.trim();
      const parsedDate = Date.parse(value);
      if (/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i.test(value) && Number.isFinite(parsedDate)) return parsedDate;
      const numeric = Number(value.replace(/[^\d.-]/g, ""));
      return Number.isFinite(numeric) && /\d/.test(value) ? numeric : value.toLocaleLowerCase();
    }

    function renderPagination(pageCount) {
      if (!pager) return;
      pager.replaceChildren();
      const addButton = (label, target, disabled, active = false, aria = "") => {
        const item = document.createElement("li");
        item.className = `page-item${disabled ? " disabled" : ""}${active ? " active" : ""}`;
        const button = document.createElement("button");
        button.className = "page-link";
        button.type = "button";
        button.textContent = label;
        button.disabled = disabled;
        if (aria) button.setAttribute("aria-label", aria);
        button.addEventListener("click", () => { page = target; render(); });
        item.append(button);
        pager.append(item);
      };
      addButton("«", 1, page <= 1, false, "First page");
      addButton("‹", Math.max(1, page - 1), page <= 1, false, "Previous page");
      const start = Math.max(1, Math.min(page - 2, pageCount - 4));
      for (let value = start; value <= Math.min(pageCount, start + 4); value++) addButton(String(value), value, false, value === page, `Page ${value}`);
      addButton("›", Math.min(pageCount, page + 1), page >= pageCount, false, "Next page");
      addButton("»", pageCount, page >= pageCount, false, "Last page");
    }

    function render() {
      currentFiltered = rows.filter(matchesFilters);
      if (sortColumn >= 0) {
        currentFiltered.sort((a, b) => {
          const av = valueForSort(a, sortColumn);
          const bv = valueForSort(b, sortColumn);
          return typeof av === "number" && typeof bv === "number" ? (av - bv) * sortDirection : String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: "base" }) * sortDirection;
        });
      }
      const pageCount = Math.max(1, Math.ceil(currentFiltered.length / pageSize()));
      page = Math.max(1, Math.min(page, pageCount));
      const first = (page - 1) * pageSize();
      const visible = currentFiltered.slice(first, first + pageSize());
      rows.forEach(row => { row.hidden = !visible.includes(row) || productView === "cards"; });
      visible.forEach(row => tbody.append(row));
      if (empty) empty.hidden = currentFiltered.length > 0;
      table.hidden = currentFiltered.length === 0 || productView === "cards";
      if (tablePanel) tablePanel.hidden = currentFiltered.length === 0 || productView === "cards";
      if (cardPanel) {
        cardPanel.hidden = currentFiltered.length === 0 || productView !== "cards";
        cardPanel.replaceChildren();
        visible.forEach(row => {
          const card = document.createElement("article");
          card.className = "product-card dashboard-card";
          const name = row.dataset.productName || row.cells[1]?.innerText.trim() || "Product";
          const icon = row.dataset.productIcon || "box-seam";
          const statusText = row.dataset.status || "Active";
          const badge = document.createElement("span"); badge.className = `status-pill ${/low|expir|out/i.test(statusText) ? "status-warning" : /inactive|discontinu/i.test(statusText) ? "status-danger" : "status-good"}`; badge.textContent = statusText;
          const image = document.createElement("div"); image.className = "product-card-image";
          const productImage = document.createElement("img"); productImage.src = row.dataset.productImage || "assets/images/products/puttu-podi.svg"; productImage.alt = `${name} package`; productImage.loading = "lazy";
          const favorite = document.createElement("button"); favorite.type = "button"; favorite.className = "product-favorite"; favorite.setAttribute("aria-label", `Add ${name} to favorites`); favorite.innerHTML = '<i class="bi bi-heart"></i>';
          favorite.addEventListener("click", () => { favorite.classList.toggle("is-favorite"); favorite.setAttribute("aria-pressed", String(favorite.classList.contains("is-favorite"))); favorite.innerHTML = `<i class="bi ${favorite.classList.contains("is-favorite") ? "bi-heart-fill" : "bi-heart"}"></i>`; });
          image.append(productImage, favorite);
          const top = document.createElement("div"); top.className = "product-card-top"; top.append(image, badge);
          const title = document.createElement("strong"); title.className = "product-card-title"; title.textContent = name;
          const meta = document.createElement("div"); meta.className = "product-card-meta"; meta.textContent = `SKU ${row.dataset.sku || "—"} · ${row.dataset.category || "—"}`;
          const details = document.createElement("div"); details.className = "product-card-details";
          [["Brand", row.dataset.brand], ["Barcode", row.dataset.barcode], ["Batch", row.dataset.batch], ["Expiry", row.dataset.expiry], ["Stock", row.dataset.stock], ["Reorder level", row.dataset.reorder]].forEach(([label, value]) => {
            const item = document.createElement("div"); item.innerHTML = `<span>${label}</span>`;
            const strong = document.createElement("strong"); strong.textContent = value || "—"; item.append(strong); details.append(item);
          });
          const price = document.createElement("div"); price.className = "product-card-price"; price.innerHTML = `<strong>₹ ${Number(row.dataset.price || 0).toLocaleString("en-IN")}</strong><span>MRP ₹ ${Number(row.dataset.mrp || 0).toLocaleString("en-IN")}</span>`;
          const actions = document.createElement("div"); actions.className = "product-card-actions";
          const add = document.createElement("button"); add.type = "button"; add.className = "btn btn-primary btn-sm product-add-button"; add.innerHTML = '<i class="bi bi-plus-lg me-1"></i>Add';
          add.addEventListener("click", () => showToast(`${name} added to the sample order.`)); actions.append(add);
          [["View", row.dataset.details, "eye"], ["Edit", row.dataset.edit, "pencil"]].forEach(([label, href, iconName]) => {
            if (!href) return;
            const link = document.createElement("a"); link.className = "btn btn-soft btn-sm"; link.href = href; link.innerHTML = `<i class="bi bi-${iconName} me-1"></i>${label}`; actions.append(link);
          });
          card.append(top, title, meta, details, price, actions); cardPanel.append(card);
        });
      }
      if (summary) summary.textContent = currentFiltered.length
        ? `Showing ${first + 1}–${Math.min(first + pageSize(), currentFiltered.length)} of ${currentFiltered.length} filtered records · ${rows.length} total`
        : `Showing 0 of ${rows.length} records`;
      if (total) total.textContent = `${currentFiltered.length} record${currentFiltered.length === 1 ? "" : "s"}`;
      renderPagination(pageCount);
      applyVisibility();
      updateSelection();
      if (loading) loading.hidden = true;
    }

    table.querySelectorAll("thead tr:first-child th[data-sortable]").forEach((header, offset) => {
      const columnIndex = offset + 1;
      const sort = () => {
        if (sortColumn === columnIndex) sortDirection *= -1;
        else { sortColumn = columnIndex; sortDirection = 1; }
        table.querySelectorAll("thead tr:first-child th[data-sortable]").forEach(th => th.removeAttribute("aria-sort"));
        header.setAttribute("aria-sort", sortDirection === 1 ? "ascending" : "descending");
        page = 1;
        render();
      };
      header.addEventListener("click", sort);
      header.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); sort(); }
      });
    });

    [search, statusFilter, dateFrom, dateTo, grid.querySelector("[data-grid-category]"), grid.querySelector("[data-grid-brand]"), grid.querySelector("[data-grid-stock]"), grid.querySelector("[data-grid-price-min]"), grid.querySelector("[data-grid-price-max]"), grid.querySelector("[data-grid-expiry]"), grid.querySelector("[data-grid-batch]")].filter(Boolean).forEach(input => input.addEventListener("input", () => { page = 1; render(); }));
    statusFilter?.addEventListener("change", () => { page = 1; render(); });
    grid.querySelectorAll(".column-filter").forEach(input => input.addEventListener("input", () => { page = 1; render(); }));
    pageSizeSelect?.addEventListener("change", () => { page = 1; render(); });
    grid.querySelector("[data-grid-reset]")?.addEventListener("click", () => {
      if (search) search.value = "";
      if (statusFilter) statusFilter.value = "";
      if (dateFrom) dateFrom.value = "";
      if (dateTo) dateTo.value = "";
      grid.querySelectorAll("[data-grid-category], [data-grid-brand], [data-grid-stock], [data-grid-price-min], [data-grid-price-max], [data-grid-expiry], [data-grid-batch]").forEach(input => { input.value = ""; });
      grid.querySelectorAll(".column-filter").forEach(input => { input.value = ""; });
      page = 1;
      render();
    });
    grid.querySelector("[data-grid-export]")?.addEventListener("click", () => exportRows(grid, currentFiltered, `${grid.dataset.salesGrid || grid.dataset.crmGrid}.csv`));
    grid.querySelector("[data-grid-print]")?.addEventListener("click", () => window.print());
    grid.querySelectorAll("[data-product-view]").forEach(button => button.addEventListener("click", () => {
      productView = button.dataset.productView;
      grid.querySelectorAll("[data-product-view]").forEach(option => {
        option.classList.toggle("active", option === button);
        option.setAttribute("aria-pressed", String(option === button));
      });
      page = 1; render();
    }));
    selectAll?.addEventListener("change", () => {
      currentFiltered.slice((page - 1) * pageSize(), page * pageSize()).forEach(row => {
        const box = row.querySelector(".row-select");
        if (box) box.checked = selectAll.checked;
      });
      updateSelection();
    });
    grid.querySelectorAll("tbody .row-select").forEach(box => box.addEventListener("change", updateSelection));
    grid.dataset.ready = "true";
    if (loading) {
      loading.hidden = false;
      table.hidden = true;
      window.requestAnimationFrame(render);
    } else {
      render();
    }
  }

  document.querySelectorAll("[data-sales-grid], [data-crm-grid]").forEach(initGrid);

  document.querySelectorAll("form[data-report-filter]").forEach(form => form.addEventListener("submit", event => {
    event.preventDefault();
    showToast("Report generated. Use Export to download the current report table.");
  }));

  function createChart(id, type, labels, datasets, options = {}) {
    const canvas = document.getElementById(id);
    if (!canvas || !window.Chart) return;
    const dark = document.documentElement.getAttribute("data-bs-theme") === "dark";
    const color = getComputedStyle(document.documentElement).getPropertyValue("--muted").trim() || "#718096";
    const grid = dark ? "rgba(255,255,255,.07)" : "rgba(19,49,78,.08)";
    new Chart(canvas, {
      type,
      data: { labels, datasets: datasets.map(dataset => ({ borderWidth: 2, borderRadius: type === "bar" ? 5 : undefined, tension: .34, ...dataset })) },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color, font: { family: "Poppins", size: 11 }, usePointStyle: true, boxWidth: 8 } } },
        scales: type === "doughnut" ? {} : {
          x: { grid: { display: false }, ticks: { color, font: { family: "Poppins", size: 10 } }, border: { display: false } },
          y: { beginAtZero: true, grid: { color: grid }, ticks: { color, font: { family: "Poppins", size: 10 } }, border: { display: false } }
        },
        ...options
      }
    });
  }

  createChart("salesOverviewChart", "line", ["1 Sep", "5 Sep", "9 Sep", "13 Sep", "17 Sep", "21 Sep", "26 Sep"], [
    { label: "Net sales", data: [420, 510, 460, 625, 570, 710, 660], borderColor: "#0b936d", backgroundColor: "rgba(11,147,109,.1)", fill: true },
    { label: "Collections", data: [310, 385, 340, 460, 420, 550, 505], borderColor: "#2475d0", backgroundColor: "transparent", fill: false }
  ]);
  createChart("salesChannelChart", "doughnut", ["Retail", "Wholesale", "Institutional", "Online"], [{ data: [38, 32, 18, 12], backgroundColor: ["#1479b8", "#18a673", "#f0a52d", "#7c68d7"], borderColor: getComputedStyle(document.documentElement).getPropertyValue("--surface").trim(), hoverOffset: 5 }], { cutout: "68%", plugins: { legend: { position: "bottom", labels: { color: getComputedStyle(document.documentElement).getPropertyValue("--muted").trim(), font: { family: "Poppins", size: 10 }, usePointStyle: true, boxWidth: 8 } } } });
  createChart("salesRevenueChart", "bar", ["1–4", "5–8", "9–12", "13–16", "17–20", "21–26"], [
    { label: "Sales (₹000)", data: [142, 168, 155, 201, 187, 229], backgroundColor: "rgba(20,121,184,.78)" },
    { label: "Target (₹000)", data: [150, 150, 170, 170, 190, 200], backgroundColor: "rgba(24,166,115,.58)" }
  ]);
  createChart("salesMixChart", "doughnut", ["Retail", "Wholesale", "Institutional", "Online"], [{ data: [38, 32, 18, 12], backgroundColor: ["#1479b8", "#18a673", "#f0a52d", "#7c68d7"], borderColor: getComputedStyle(document.documentElement).getPropertyValue("--surface").trim() }], { cutout: "68%", plugins: { legend: { position: "bottom", labels: { color: getComputedStyle(document.documentElement).getPropertyValue("--muted").trim(), font: { family: "Poppins", size: 10 }, usePointStyle: true, boxWidth: 8 } } } });
  createChart("salesCategoryChart", "bar", ["Puttu & breakfast", "Masalas", "Pickles", "Tea & coffee", "Snacks"], [{ label: "Net sales (₹000)", data: [610, 485, 352, 291, 204], backgroundColor: ["#1479b8", "#18a673", "#f0a52d", "#7c68d7", "#de6470"] }], { indexAxis: "y", plugins: { legend: { display: false } } });
  createChart("salespersonChart", "bar", ["Anjali", "Arjun", "Fathima", "Rahul", "Meera"], [
    { label: "Actual (₹000)", data: [472.5, 486.2, 354, 352.6, 371.4], backgroundColor: "rgba(20,121,184,.8)" },
    { label: "Target (₹000)", data: [500, 450, 500, 400, 350], backgroundColor: "rgba(24,166,115,.48)" }
  ]);
  createChart("salesReportChart", "line", ["Apr", "May", "Jun", "Jul", "Aug", "Sep"], [
    { label: "Net sales (₹L)", data: [18.4, 20.1, 21.6, 19.8, 22.0, 24.85], borderColor: "#1479b8", backgroundColor: "rgba(20,121,184,.08)", fill: true },
    { label: "Collections (₹L)", data: [15.9, 17.8, 19.3, 18.2, 19.6, 21.24], borderColor: "#18a673", backgroundColor: "transparent", fill: false }
  ]);
});
