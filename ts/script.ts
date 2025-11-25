/* SCIS Frontend Logic
   - No frameworks. Runs in plain browser.
   - Compiles to /js/script.js
   - Inline comments indicate future backend integration points.
*/

import { MOCK_ITEMS, Item, ItemStatus } from "./mock_items";
import { MOCK_USERS, User } from "./mock_users";
import { MOCK_TRANSACTIONS, Transaction } from "./mock_transactions";

type Theme = "light" | "dark";

/** Theme handling */
const ThemeKey = "scis-theme";
function setTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(ThemeKey, theme);
  } catch {}
}
function initTheme() {
  const stored = (localStorage.getItem(ThemeKey) as Theme) || "light";
  setTheme(stored);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") as Theme;
  setTheme(current === "dark" ? "light" : "dark");
}

/** Simple Router-like page init by body[data-page] */
function initPage() {
  initTheme();
  const toggleBtn = document.getElementById("themeToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleTheme);
  }

  const page = document.body.getAttribute("data-page");
  switch (page) {
    case "login":
      initLoginPage();
      break;
    case "student":
      initStudentDashboard();
      break;
    case "officer":
      initOfficerDashboard();
      break;
    case "inventory":
      initInventoryPage();
      break;
    case "borrow":
      initBorrowPage();
      break;
    case "reserve":
      initReservePage();
      break;
    case "borrowed":
      initBorrowedPage();
      break;
    case "report":
      initReportPage();
      break;
    case "manage_inventory":
      initManageInventoryPage();
      break;
    case "manage_users":
      initManageUsersPage();
      break;
  }
}

/** Login page */
function initLoginPage() {
  const form = document.getElementById("loginForm") as HTMLFormElement | null;
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = (document.getElementById("loginEmail") as HTMLInputElement).value.trim();
    const role = (document.getElementById("loginRole") as HTMLSelectElement).value;

    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && (u.role === role || role === "student" || role === "officer" || role === "admin"));
    if (!user) {
      alert("Mock: Invalid credentials for demo.\nLater: Replace with backend authentication API.");
      return;
    }
    // Future: store auth token from backend response
    try { localStorage.setItem("scis-user-id", user.id); } catch {}

    if (user.role === "student") {
      window.location.href = "student.html";
    } else {
      window.location.href = "officer.html";
    }
  });
}

/** Student dashboard */
function initStudentDashboard() {
  const userId = localStorage.getItem("scis-user-id") || "USR-001";
  const user = MOCK_USERS.find(u => u.id === userId);
  const nameEl = document.getElementById("studentName");
  if (nameEl && user) nameEl.textContent = user.name;

  const txList = document.getElementById("studentTxList");
  if (!txList) return;
  const itemsById = new Map<string, Item>(MOCK_ITEMS.map(i => [i.id, i]));
  const myTx = MOCK_TRANSACTIONS.filter(tx => tx.userId === userId);
  txList.innerHTML = myTx.map(tx => {
    const item = itemsById.get(tx.itemId);
    return `<li>
      <strong>${item?.name || tx.itemId}</strong> — ${tx.type.toUpperCase()} (${tx.status})
      <span class="chip">${new Date(tx.date).toLocaleString()}</span>
    </li>`;
  }).join("") || "<li>No recent activity.</li>";
}

/** Officer dashboard */
function initOfficerDashboard() {
  const pendingList = document.getElementById("pendingList");
  if (!pendingList) return;
  const itemsById = new Map<string, Item>(MOCK_ITEMS.map(i => [i.id, i]));
  const usersById = new Map<string, User>(MOCK_USERS.map(u => [u.id, u]));
  const pending = MOCK_TRANSACTIONS.filter(tx => tx.status === "pending");

  pendingList.innerHTML = pending.map(tx => {
    const item = itemsById.get(tx.itemId);
    const user = usersById.get(tx.userId);
    return `<li>
      <strong>${tx.type.toUpperCase()}</strong> — ${item?.name || tx.itemId}
      <span class="chip">by ${user?.name || tx.userId}</span>
      <div class="actions" style="margin-top:8px">
        <button class="btn btn-success" data-action="approve" data-id="${tx.id}">Approve</button>
        <button class="btn btn-danger" data-action="deny" data-id="${tx.id}">Deny</button>
      </div>
    </li>`;
  }).join("") || "<li>No pending requests.</li>";

  pendingList.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const action = t.getAttribute("data-action");
    const id = t.getAttribute("data-id");
    if (!action || !id) return;
    alert(`Mock: ${action} transaction ${id}.\nLater: Call backend PATCH /transactions/${id}`);
  });
}

/** Inventory page: search + status filter + card render */
function initInventoryPage() {
  const search = document.getElementById("search") as HTMLInputElement;
  const status = document.getElementById("status") as HTMLSelectElement;
  const category = document.getElementById("category") as HTMLSelectElement;
  const grid = document.getElementById("inventoryGrid") as HTMLElement;

  const categories = Array.from(new Set(MOCK_ITEMS.map(i => i.category)));
  if (category) {
    category.innerHTML = `<option value="">All Categories</option>` + categories.map(c => `<option value="${c}">${c}</option>`).join("");
  }

  function render() {
    const q = (search?.value || "").toLowerCase();
    const s = status?.value as ItemStatus | "" || "";
    const cat = category?.value || "";

    const filtered = MOCK_ITEMS.filter(i => {
      const matchQ = i.name.toLowerCase().includes(q) || (i.description || "").toLowerCase().includes(q);
      const matchS = s ? i.status === s : true;
      const matchC = cat ? i.category === cat : true;
      return matchQ && matchS && matchC;
    });

    grid.innerHTML = filtered.map(i => {
      const statusClass = `status ${i.status}`;
      return `<div class="card">
        <h3>${i.name}</h3>
        <div class="meta">${i.category} • ${i.location || "Unassigned"}</div>
        <span class="${statusClass}">${i.status.toUpperCase()}</span>
        <p>${i.description || ""}</p>
        <div class="actions">
          <button class="btn btn-primary" data-borrow="${i.id}">Borrow</button>
          <button class="btn btn-warning" data-reserve="${i.id}">Reserve</button>
          <button class="btn" data-report="${i.id}">Report Issue</button>
        </div>
      </div>`;
    }).join("") || `<div class="card"><p>No items matched your filters.</p></div>`;
  }

  render();

  search?.addEventListener("input", render);
  status?.addEventListener("change", render);
  category?.addEventListener("change", render);

  grid.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const borrowId = t.getAttribute("data-borrow");
    const reserveId = t.getAttribute("data-reserve");
    const reportId = t.getAttribute("data-report");
    if (borrowId) {
      alert(`Mock: Borrow request for ${borrowId}.\nLater: POST /transactions { type: "borrow" }`);
      window.location.href = "borrow.html?itemId=" + encodeURIComponent(borrowId);
    } else if (reserveId) {
      alert(`Mock: Reserve request for ${reserveId}.\nLater: POST /transactions { type: "reserve" }`);
      window.location.href = "reserve.html?itemId=" + encodeURIComponent(reserveId);
    } else if (reportId) {
      alert(`Mock: Report item ${reportId}.\nLater: POST /transactions { type: "report" }`);
      window.location.href = "report.html?itemId=" + encodeURIComponent(reportId);
    }
  });
}

/** Borrow form */
function initBorrowPage() {
  const params = new URLSearchParams(location.search);
  const itemId = params.get("itemId") || "";
  const item = MOCK_ITEMS.find(i => i.id === itemId);
  const itemNameEl = document.getElementById("borrowItemName");
  if (itemNameEl) itemNameEl.textContent = item ? item.name : itemId || "Select an item";

  const form = document.getElementById("borrowForm") as HTMLFormElement | null;
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(`Mock: Submit borrow request for ${itemId}.\nLater: POST /transactions with payload`);
    window.location.href = "borrowed.html";
  });
}

/** Reserve confirmation */
function initReservePage() {
  const params = new URLSearchParams(location.search);
  const itemId = params.get("itemId") || "";
  const item = MOCK_ITEMS.find(i => i.id === itemId);
  const itemNameEl = document.getElementById("reserveItemName");
  if (itemNameEl) itemNameEl.textContent = item ? item.name : itemId || "Select an item";

  const btn = document.getElementById("reserveConfirm");
  btn?.addEventListener("click", () => {
    alert(`Mock: Confirm reservation for ${itemId}.\nLater: POST /transactions { type: "reserve" }`);
    window.location.href = "inventory.html";
  });
}

/** Student borrowed items page */
function initBorrowedPage() {
  const list = document.getElementById("borrowedList");
  if (!list) return;
  const userId = localStorage.getItem("scis-user-id") || "USR-001";
  const itemsById = new Map<string, Item>(MOCK_ITEMS.map(i => [i.id, i]));
  const myBorrows = MOCK_TRANSACTIONS.filter(tx => tx.userId === userId && tx.type === "borrow");

  list.innerHTML = myBorrows.map(tx => {
    const item = itemsById.get(tx.itemId);
    return `<li>
      <strong>${item?.name || tx.itemId}</strong>
      <span class="chip">${tx.status}</span>
      <span class="chip">${new Date(tx.date).toLocaleString()}</span>
      <button class="btn btn-success" data-return="${tx.id}" style="margin-left:6px">Return</button>
    </li>`;
  }).join("") || "<li>No borrowed items.</li>";

  list.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const id = t.getAttribute("data-return");
    if (!id) return;
    alert(`Mock: Return transaction ${id}.\nLater: POST /transactions { type: "return" }`);
  });
}

/** Report issue page */
function initReportPage() {
  const params = new URLSearchParams(location.search);
  const itemId = params.get("itemId") || "";
  const itemNameEl = document.getElementById("reportItemName");
  if (itemNameEl) itemNameEl.textContent = itemId || "Select an item";

  const form = document.getElementById("reportForm") as HTMLFormElement | null;
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(`Mock: Report issue for ${itemId}.\nLater: POST /reports with payload`);
    window.location.href = "inventory.html";
  });
}

/** Officer: manage inventory */
function initManageInventoryPage() {
  const tbody = document.getElementById("miTbody");
  if (!tbody) return;

  tbody.innerHTML = MOCK_ITEMS.map(i => {
    return `<tr>
      <td>${i.id}</td>
      <td>${i.name}</td>
      <td>${i.category}</td>
      <td><span class="status ${i.status}">${i.status}</span></td>
      <td>${i.location || "-"}</td>
      <td>
        <button class="btn" data-edit="${i.id}">Edit</button>
        <button class="btn btn-danger" data-delete="${i.id}">Delete</button>
      </td>
    </tr>`;
  }).join("");

  tbody.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const editId = t.getAttribute("data-edit");
    const delId = t.getAttribute("data-delete");
    if (editId) {
      alert(`Mock: Edit item ${editId}.\nLater: Open modal and PATCH /items/${editId}`);
    } else if (delId) {
      alert(`Mock: Delete item ${delId}.\nLater: DELETE /items/${delId}`);
    }
  });

  const addForm = document.getElementById("addItemForm") as HTMLFormElement | null;
  addForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Mock: Add new item.\nLater: POST /items with payload");
  });
}

/** Officer: manage users */
function initManageUsersPage() {
  const tbody = document.getElementById("muTbody");
  if (!tbody) return;

  tbody.innerHTML = MOCK_USERS.map(u => {
    return `<tr>
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td><span class="chip">${u.role}</span></td>
      <td>
        <button class="btn" data-edit="${u.id}">Edit</button>
        <button class="btn btn-danger" data-delete="${u.id}">Delete</button>
      </td>
    </tr>`;
  }).join("");

  tbody.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const editId = t.getAttribute("data-edit");
    const delId = t.getAttribute("data-delete");
    if (editId) {
      alert(`Mock: Edit user ${editId}.\nLater: Open modal and PATCH /users/${editId}`);
    } else if (delId) {
      alert(`Mock: Delete user ${delId}.\nLater: DELETE /users/${delId}`);
    }
  });

  const addForm = document.getElementById("addUserForm") as HTMLFormElement | null;
  addForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Mock: Add new user.\nLater: POST /users with payload");
  });
}

/** Boot */
document.addEventListener("DOMContentLoaded", initPage);

/** Optional: expose mocks to window for easy testing in DevTools */
declare global { interface Window { SCIS_MOCKS?: any } }
window.SCIS_MOCKS = { MOCK_ITEMS, MOCK_USERS, MOCK_TRANSACTIONS };
