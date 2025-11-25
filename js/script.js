"use strict";
/* Compiled from /ts/script.ts - minimal ES5 target for wide browser support */
var ThemeKey = "scis-theme";
function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
        localStorage.setItem(ThemeKey, theme);
    }
    catch (_a) { }
}
function initTheme() {
    var stored = localStorage.getItem(ThemeKey) || "light";
    setTheme(stored);
}
function toggleTheme() {
    var current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
}
function initPage() {
    initTheme();
    var toggleBtn = document.getElementById("themeToggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", toggleTheme);
    }
    var page = document.body.getAttribute("data-page");
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
function initLoginPage() {
    var form = document.getElementById("loginForm");
    if (!form)
        return;
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var email = document.getElementById("loginEmail").value.trim();
        var role = document.getElementById("loginRole").value;
        var user = window.SCIS_MOCKS.MOCK_USERS.find(function (u) {
            return u.email.toLowerCase() === email.toLowerCase() && (u.role === role || role === "student" || role === "officer" || role === "admin");
        });
        if (!user) {
            alert("Mock: Invalid credentials for demo.\nLater: Replace with backend authentication API.");
            return;
        }
        try {
            localStorage.setItem("scis-user-id", user.id);
        }
        catch (_a) { }
        if (user.role === "student") {
            window.location.href = "student.html";
        }
        else {
            window.location.href = "officer.html";
        }
    });
}
function initStudentDashboard() {
    var userId = localStorage.getItem("scis-user-id") || "USR-001";
    var user = window.SCIS_MOCKS.MOCK_USERS.find(function (u) { return u.id === userId; });
    var nameEl = document.getElementById("studentName");
    if (nameEl && user)
        nameEl.textContent = user.name;
    var txList = document.getElementById("studentTxList");
    if (!txList)
        return;
    var itemsById = new Map(window.SCIS_MOCKS.MOCK_ITEMS.map(function (i) { return [i.id, i]; }));
    var myTx = window.SCIS_MOCKS.MOCK_TRANSACTIONS.filter(function (tx) { return tx.userId === userId; });
    txList.innerHTML = myTx.map(function (tx) {
        var item = itemsById.get(tx.itemId);
        return "<li>\n      <strong>".concat((item === null || item === void 0 ? void 0 : item.name) || tx.itemId, "</strong> \u2014 ").concat(tx.type.toUpperCase(), " (").concat(tx.status, ")\n      <span class=\"chip\">").concat(new Date(tx.date).toLocaleString(), "</span>\n    </li>");
    }).join("") || "<li>No recent activity.</li>";
}
function initOfficerDashboard() {
    var pendingList = document.getElementById("pendingList");
    if (!pendingList)
        return;
    var itemsById = new Map(window.SCIS_MOCKS.MOCK_ITEMS.map(function (i) { return [i.id, i]; }));
    var usersById = new Map(window.SCIS_MOCKS.MOCK_USERS.map(function (u) { return [u.id, u]; }));
    var pending = window.SCIS_MOCKS.MOCK_TRANSACTIONS.filter(function (tx) { return tx.status === "pending"; });
    pendingList.innerHTML = pending.map(function (tx) {
        var item = itemsById.get(tx.itemId);
        var user = usersById.get(tx.userId);
        return "<li>\n      <strong>".concat(tx.type.toUpperCase(), "</strong> \u2014 ").concat((item === null || item === void 0 ? void 0 : item.name) || tx.itemId, "\n      <span class=\"chip\">by ").concat((user === null || user === void 0 ? void 0 : user.name) || tx.userId, "</span>\n      <div class=\"actions\" style=\"margin-top:8px\">\n        <button class=\"btn btn-success\" data-action=\"approve\" data-id=\"").concat(tx.id, "\">Approve</button>\n        <button class=\"btn btn-danger\" data-action=\"deny\" data-id=\"").concat(tx.id, "\">Deny</button>\n      </div>\n    </li>");
    }).join("") || "<li>No pending requests.</li>";
    pendingList.addEventListener("click", function (e) {
        var t = e.target;
        var action = t.getAttribute("data-action");
        var id = t.getAttribute("data-id");
        if (!action || !id)
            return;
        alert("Mock: ".concat(action, " transaction ").concat(id, ".\nLater: Call backend PATCH /transactions/").concat(id));
    });
}
function initInventoryPage() {
    var search = document.getElementById("search");
    var status = document.getElementById("status");
    var category = document.getElementById("category");
    var grid = document.getElementById("inventoryGrid");
    var categories = Array.from(new Set(window.SCIS_MOCKS.MOCK_ITEMS.map(function (i) { return i.category; })));
    if (category) {
        category.innerHTML = "<option value=\"\">All Categories</option>" + categories.map(function (c) { return "<option value=\"".concat(c, "\">").concat(c, "</option>"); }).join("");
    }
    function render() {
        var q = (search === null || search === void 0 ? void 0 : search.value) || "";
        q = q.toLowerCase();
        var s = (status === null || status === void 0 ? void 0 : status.value) || "";
        var cat = (category === null || category === void 0 ? void 0 : category.value) || "";
        var filtered = window.SCIS_MOCKS.MOCK_ITEMS.filter(function (i) {
            var matchQ = i.name.toLowerCase().includes(q) || ((i.description || "").toLowerCase().includes(q));
            var matchS = s ? i.status === s : true;
            var matchC = cat ? i.category === cat : true;
            return matchQ && matchS && matchC;
        });
        grid.innerHTML = filtered.map(function (i) {
            var statusClass = "status ".concat(i.status);
            return "<div class=\"card\">\n        <h3>".concat(i.name, "</h3>\n        <div class=\"meta\">").concat(i.category, " \u2022 ").concat(i.location || "Unassigned", "</div>\n        <span class=\"").concat(statusClass, "\">").concat(i.status.toUpperCase(), "</span>\n        <p>").concat(i.description || "", "</p>\n        <div class=\"actions\">\n          <button class=\"btn btn-primary\" data-borrow=\"").concat(i.id, "\">Borrow</button>\n          <button class=\"btn btn-warning\" data-reserve=\"").concat(i.id, "\">Reserve</button>\n          <button class=\"btn\" data-report=\"").concat(i.id, "\">Report Issue</button>\n        </div>\n      </div>");
        }).join("") || "<div class=\"card\"><p>No items matched your filters.</p></div>";
    }
    render();
    search === null || search === void 0 ? void 0 : search.addEventListener("input", render);
    status === null || status === void 0 ? void 0 : status.addEventListener("change", render);
    category === null || category === void 0 ? void 0 : category.addEventListener("change", render);
    grid.addEventListener("click", function (e) {
        var t = e.target;
        var borrowId = t.getAttribute("data-borrow");
        var reserveId = t.getAttribute("data-reserve");
        var reportId = t.getAttribute("data-report");
        if (borrowId) {
            alert("Mock: Borrow request for ".concat(borrowId, ".\nLater: POST /transactions { type: \"borrow\" }"));
            window.location.href = "borrow.html?itemId=" + encodeURIComponent(borrowId);
        }
        else if (reserveId) {
            alert("Mock: Reserve request for ".concat(reserveId, ".\nLater: POST /transactions { type: \"reserve\" }"));
            window.location.href = "reserve.html?itemId=" + encodeURIComponent(reserveId);
        }
        else if (reportId) {
            alert("Mock: Report item ".concat(reportId, ".\nLater: POST /transactions { type: \"report\" }"));
            window.location.href = "report.html?itemId=" + encodeURIComponent(reportId);
        }
    });
}
function initBorrowPage() {
    var params = new URLSearchParams(location.search);
    var itemId = params.get("itemId") || "";
    var item = (window.SCIS_MOCKS.MOCK_ITEMS || []).find(function (i) { return i.id === itemId; });
    var itemNameEl = document.getElementById("borrowItemName");
    if (itemNameEl)
        itemNameEl.textContent = item ? item.name : itemId || "Select an item";
    var form = document.getElementById("borrowForm");
    form === null || form === void 0 ? void 0 : form.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Mock: Submit borrow request for ".concat(itemId, ".\nLater: POST /transactions with payload"));
        window.location.href = "borrowed.html";
    });
}
function initReservePage() {
    var params = new URLSearchParams(location.search);
    var itemId = params.get("itemId") || "";
    var item = (window.SCIS_MOCKS.MOCK_ITEMS || []).find(function (i) { return i.id === itemId; });
    var itemNameEl = document.getElementById("reserveItemName");
    if (itemNameEl)
        itemNameEl.textContent = item ? item.name : itemId || "Select an item";
    var btn = document.getElementById("reserveConfirm");
    btn === null || btn === void 0 ? void 0 : btn.addEventListener("click", function () {
        alert("Mock: Confirm reservation for ".concat(itemId, ".\nLater: POST /transactions { type: \"reserve\" }"));
        window.location.href = "inventory.html";
    });
}
function initBorrowedPage() {
    var list = document.getElementById("borrowedList");
    if (!list)
        return;
    var userId = localStorage.getItem("scis-user-id") || "USR-001";
    var itemsById = new Map(window.SCIS_MOCKS.MOCK_ITEMS.map(function (i) { return [i.id, i]; }));
    var myBorrows = window.SCIS_MOCKS.MOCK_TRANSACTIONS.filter(function (tx) { return tx.userId === userId && tx.type === "borrow"; });
    list.innerHTML = myBorrows.map(function (tx) {
        var item = itemsById.get(tx.itemId);
        return "<li>\n      <strong>".concat((item === null || item === void 0 ? void 0 : item.name) || tx.itemId, "</strong>\n      <span class=\"chip\">").concat(tx.status, "</span>\n      <span class=\"chip\">").concat(new Date(tx.date).toLocaleString(), "</span>\n      <button class=\"btn btn-success\" data-return=\"").concat(tx.id, "\" style=\"margin-left:6px\">Return</button>\n    </li>");
    }).join("") || "<li>No borrowed items.</li>";
    list.addEventListener("click", function (e) {
        var t = e.target;
        var id = t.getAttribute("data-return");
        if (!id)
            return;
        alert("Mock: Return transaction ".concat(id, ".\nLater: POST /transactions { type: \"return\" }"));
    });
}
function initReportPage() {
    var params = new URLSearchParams(location.search);
    var itemId = params.get("itemId") || "";
    var itemNameEl = document.getElementById("reportItemName");
    if (itemNameEl)
        itemNameEl.textContent = itemId || "Select an item";
    var form = document.getElementById("reportForm");
    form === null || form === void 0 ? void 0 : form.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Mock: Report issue for ".concat(itemId, ".\nLater: POST /reports with payload"));
        window.location.href = "inventory.html";
    });
}
function initManageInventoryPage() {
    var tbody = document.getElementById("miTbody");
    if (!tbody)
        return;
    tbody.innerHTML = window.SCIS_MOCKS.MOCK_ITEMS.map(function (i) {
        return "<tr>\n      <td>".concat(i.id, "</td>\n      <td>").concat(i.name, "</td>\n      <td>").concat(i.category, "</td>\n      <td><span class=\"status ").concat(i.status, "\">").concat(i.status, "</span></td>\n      <td>").concat(i.location || "-", "</td>\n      <td>\n        <button class=\"btn\" data-edit=\"").concat(i.id, "\">Edit</button>\n        <button class=\"btn btn-danger\" data-delete=\"").concat(i.id, "\">Delete</button>\n      </td>\n    </tr>");
    }).join("");
    tbody.addEventListener("click", function (e) {
        var t = e.target;
        var editId = t.getAttribute("data-edit");
        var delId = t.getAttribute("data-delete");
        if (editId) {
            alert("Mock: Edit item ".concat(editId, ".\nLater: Open modal and PATCH /items/").concat(editId));
        }
        else if (delId) {
            alert("Mock: Delete item ".concat(delId, ".\nLater: DELETE /items/").concat(delId));
        }
    });
    var addForm = document.getElementById("addItemForm");
    addForm === null || addForm === void 0 ? void 0 : addForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Mock: Add new item.\nLater: POST /items with payload");
    });
}
function initManageUsersPage() {
    var tbody = document.getElementById("muTbody");
    if (!tbody)
        return;
    tbody.innerHTML = window.SCIS_MOCKS.MOCK_USERS.map(function (u) {
        return "<tr>\n      <td>".concat(u.id, "</td>\n      <td>").concat(u.name, "</td>\n      <td>").concat(u.email, "</td>\n      <td><span class=\"chip\">").concat(u.role, "</span></td>\n      <td>\n        <button class=\"btn\" data-edit=\"").concat(u.id, "\">Edit</button>\n        <button class=\"btn btn-danger\" data-delete=\"").concat(u.id, "\">Delete</button>\n      </td>\n    </tr>");
    }).join("");
    tbody.addEventListener("click", function (e) {
        var t = e.target;
        var editId = t.getAttribute("data-edit");
        var delId = t.getAttribute("data-delete");
        if (editId) {
            alert("Mock: Edit user ".concat(editId, ".\nLater: Open modal and PATCH /users/").concat(editId));
        }
        else if (delId) {
            alert("Mock: Delete user ".concat(delId, ".\nLater: DELETE /users/").concat(delId));
        }
    });
    var addForm = document.getElementById("addUserForm");
    addForm === null || addForm === void 0 ? void 0 : addForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Mock: Add new user.\nLater: POST /users with payload");
    });
}
document.addEventListener("DOMContentLoaded", initPage);
window.SCIS_MOCKS = window.SCIS_MOCKS || {};
