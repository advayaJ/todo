const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const emptyMessage = document.getElementById("emptyMessage");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

function addTask() {
    const taskName = taskInput.value.trim();
    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }
    const newTask = {
        id: Date.now(),
        name: taskName,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    taskInput.value = "";
    displayTasks();
}

function displayTasks() {
    taskList.innerHTML = "";
    let filteredTasks = tasks.filter(function(task) {
        if (currentFilter === "pending") {
            return !task.completed;
        }
        if (currentFilter === "completed") {
            return task.completed;
        }
        return true;
    });

    filteredTasks.forEach(function(task) {
        const li = document.createElement("li");
        li.className = "task-item";
        if (task.completed) {
            li.classList.add("completed");
        }
        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.name;
        const actions = document.createElement("div");
        actions.className = "task-actions";
        const completeBtn = document.createElement("button");
        completeBtn.className = "complete-btn";
        completeBtn.textContent = task.completed ? "Undo" : "Done";
        completeBtn.addEventListener("click", function() {
            toggleTask(task.id);
        });
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", function() {
            editTask(task.id);
        });
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", function() {
            deleteTask(task.id);
        });
        actions.appendChild(completeBtn);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        li.appendChild(taskText);
        li.appendChild(actions);
        taskList.appendChild(li);
    });
    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";
    updateStats();
}

function editTask(id) {
    const task = tasks.find(function(task) {
        return task.id === id;
    });

    const updatedName = prompt("Edit your task:", task.name);
    if (updatedName !== null && updatedName.trim() !== "") {
        task.name = updatedName.trim();
        saveTasks();
        displayTasks();
    }
}

function toggleTask(id) {
    const task = tasks.find(function(task) {
        return task.id === id;
    });
    task.completed = !task.completed;
    saveTasks();
    displayTasks();
}
function deleteTask(id) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) {
        return;
    }
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });
    saveTasks();
    displayTasks();
}
function updateStats() {
    totalTasks.textContent = tasks.length;
    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;
    const pending = tasks.length - completed;
    pendingTasks.textContent = pending;
    completedTasks.textContent = completed;
}
const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;
        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });
        button.classList.add("active");
        displayTasks();
    });
});
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});
displayTasks();
