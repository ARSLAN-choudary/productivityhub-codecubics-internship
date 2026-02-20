document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const overlay = document.getElementById("overlay");
    const logoutBtn = document.getElementById("logoutBtn");
    const tableBody = document.getElementById("usersTable");
    const roleFilter = document.getElementById("roleFilter");
    const statusFilter = document.getElementById("statusFilter");

    // Sample users
    let users = [
        { name: "Sarah Johnson", email: "sarah.johnson@example.com", role: "admin", status: "active" },
        { name: "Michael Chen", email: "michael.chen@example.com", role: "manager", status: "active" },
        { name: "David Kim", email: "david.kim@example.com", role: "user", status: "inactive" },
        { name: "Anna Lee", email: "anna.lee@example.com", role: "user", status: "active" },
        { name: "John Smith", email: "john.smith@example.com", role: "manager", status: "inactive" }
    ];

    // Hamburger toggle
    const toggleSidebar = () => {
        sidebar.classList.toggle("-translate-x-full");
        overlay.classList.toggle("hidden");
    };

    hamburgerBtn.addEventListener("click", toggleSidebar);
    overlay.addEventListener("click", toggleSidebar);

    // Logout
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login.html";
    });

    // Render users
    const renderUsers = () => {
        tableBody.innerHTML = "";
        const roleVal = roleFilter.value;
        const statusVal = statusFilter.value;

        users
        .filter(user =>
            (roleVal === "All Roles" || user.role === roleVal.toLowerCase()) &&
            (statusVal === "All Status" || user.status === statusVal.toLowerCase())
        )
        .forEach(user => {
            const tr = document.createElement("tr");
            tr.className = "hover:bg-gray-50 transition";
            tr.innerHTML = `
                <td class="px-6 py-4 font-medium text-slate-700">${user.name}</td>
                <td class="px-6 py-4 text-gray-500">${user.email}</td>
                <td class="px-6 py-4">
                    <span class="bg-${user.role==='admin'?'purple':'blue'}-100 text-${user.role==='admin'?'purple':'blue'}-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">${user.role}</span>
                </td>
                <td class="px-6 py-4">
                    <span class="bg-${user.status==='active'?'green':'slate'}-100 text-${user.status==='active'?'green':'slate'}-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">${user.status}</span>
                </td>
                <td class="px-6 py-4 text-right space-x-3">
                    <button class="text-gray-400 hover:text-blue-500"><i class="fa-regular fa-eye"></i></button>
                    <button class="text-gray-400 hover:text-red-500 deleteBtn"><i class="fa-regular fa-trash-can"></i></button>
                </td>
            `;
            tableBody.appendChild(tr);

            // Delete button
            tr.querySelector(".deleteBtn").addEventListener("click", () => {
                users = users.filter(u => u.email !== user.email);
                renderUsers();
            });
        });
    };

    roleFilter.addEventListener("change", renderUsers);
    statusFilter.addEventListener("change", renderUsers);

    renderUsers();
});