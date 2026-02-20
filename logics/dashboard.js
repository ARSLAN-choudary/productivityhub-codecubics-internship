// dashboard.js
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector("aside");
    const hamburger = document.querySelector("button .fa-bars");
    const taskContainer = document.getElementById("taskContainer");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskModal = document.getElementById("taskModal");
    const closeModal = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const taskForm = document.getElementById("taskForm");
    const filterSelect = document.querySelector("select");
    const totalTasksEl = document.getElementById("totalTasks");
    const completedTasksEl = document.getElementById("completedTasks");
    const pendingTasksEl = document.getElementById("pendingTasks");
    const overdueTasksEl = document.getElementById("overdueTasks");
    const logout= document.getElementById("logoutBtn")

// logout functionality
    logout.addEventListener("click", () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");  

    window.location.href = "/login.html"; 
});


document.addEventListener("DOMContentLoaded", () => {
    const sidebarLinks = document.querySelectorAll("aside nav a");

    sidebarLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const url = link.getAttribute("href");
            window.location.href = url;
        });
    });
});

    let tasks = [
        {
            title: "Complete project proposal",
            description: "Draft and finalize the Q1 project proposal for the new client",
            status: "pending",
            date: "25/02/2026"
        },
        {
            title: "Review design mockups",
            description: "Review and provide feedback on the new dashboard design",
            status: "completed",
            date: "22/02/2026"
        },
        {
            title: "Update documentation",
            description: "Update API documentation with new endpoints",
            status: "overdue",
            date: "18/02/2026"
        }
    ];

    // ---------------- Sidebar toggle ----------------
    document.querySelector("button").addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
        sidebar.classList.toggle("absolute");
        sidebar.classList.toggle("z-50");
    });

    // ---------------- Modal toggle ----------------
    const openModal = () => taskModal.classList.remove("hidden");
    const closeModalFunc = () => taskModal.classList.add("hidden");

    addTaskBtn.addEventListener("click", openModal);
    closeModal.addEventListener("click", closeModalFunc);
    cancelBtn.addEventListener("click", closeModalFunc);

    // ---------------- Task render ----------------
    const renderTasks = (filter = "All Tasks") => {
        taskContainer.innerHTML = "";
        let filtered = tasks;

        if (filter !== "All Tasks") {
            filtered = tasks.filter(t => {
                if(filter === "Completed") return t.status === "completed";
                if(filter === "Pending") return t.status === "pending";
                if(filter === "Overdue") return t.status === "overdue";
            });
        }

        filtered.forEach((task, index) => {
            const taskEl = document.createElement("div");
            taskEl.className = "bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4 group";

            const checked = task.status === "completed" ? "checked" : "";

            taskEl.innerHTML = `
                <input type="checkbox" class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" ${checked} data-index="${index}" />
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                        <h4 class="font-bold ${task.status==='completed' ? 'line-through text-slate-400' : 'text-slate-700'}">
                            ${task.title}
                        </h4>
                    </div>
                    <p class="text-sm text-gray-400 mb-2">${task.description}</p>
                    <div class="flex items-center gap-2 text-xs text-gray-400">
                        <i class="fa-regular fa-calendar"></i> ${task.date}
                    </div>
                </div>
                <div class="flex flex-col justify-between gap-2">
                    <span class="text-[10px] ${task.status==='completed' ? 'bg-green-50 text-green-600' : task.status==='pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'} px-2 py-0.5 rounded-full font-bold uppercase">
                        ${task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                    <div class="flex gap-3 text-gray-400 self-end md:self-center">
                        <button class="hover:text-blue-500 editBtn" data-index="${index}">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button class="hover:text-red-500 deleteBtn" data-index="${index}">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
            taskContainer.appendChild(taskEl);
        });

        updateCounters();
        attachTaskEvents();
    };

    // ---------------- Update Counters ----------------
    const updateCounters = () => {
        totalTasksEl.textContent = tasks.length;
        completedTasksEl.textContent = tasks.filter(t => t.status === "completed").length;
        pendingTasksEl.textContent = tasks.filter(t => t.status === "pending").length;
        overdueTasksEl.textContent = tasks.filter(t => t.status === "overdue").length;
    };

    // ---------------- Task Events ----------------
    const attachTaskEvents = () => {
        document.querySelectorAll(".deleteBtn").forEach(btn => {
            btn.addEventListener("click", e => {
                const idx = e.currentTarget.dataset.index;
                tasks.splice(idx, 1);
                renderTasks(filterSelect.value);
            });
        });

        document.querySelectorAll("input[type=checkbox]").forEach(checkbox => {
            checkbox.addEventListener("change", e => {
                const idx = e.currentTarget.dataset.index;
                if(e.currentTarget.checked) {
                    tasks[idx].status = "completed";
                } else {
                    // Reset to pending if date not passed, else overdue
                    const taskDate = new Date(tasks[idx].date.split("/").reverse().join("-"));
                    tasks[idx].status = taskDate < new Date() ? "overdue" : "pending";
                }
                renderTasks(filterSelect.value);
            });
        });
    };

    // ---------------- Filter tasks ----------------
    filterSelect.addEventListener("change", () => {
        renderTasks(filterSelect.value);
    });

    // ---------------- Add new task ----------------
    taskForm.addEventListener("submit", e => {
        e.preventDefault();
        const title = document.getElementById("taskTitle").value.trim();
        const description = document.getElementById("taskDescription").value.trim();
        const status = document.getElementById("taskStatus").value;

        const today = new Date();
        const dateStr = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`;

        tasks.push({
            title,
            description,
            status,
            date: dateStr
        });

        taskForm.reset();
        closeModalFunc();
        renderTasks(filterSelect.value);
    });

    // Initial render
    renderTasks();
});