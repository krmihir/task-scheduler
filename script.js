const taskInput = document.getElementById("task");
const priorityInput = document.getElementById("priority");
const deadlineInput = document.getElementById("deadline");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

// Initialize tasks from local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Function to render tasks from the array
function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task");
        taskItem.innerHTML = `
            <p><strong>Task:</strong> ${task.text}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <p><strong>Deadline:</strong> ${task.deadline}</p>
            <p><strong>Status:</strong> ${task.done ? "Done" : "Pending"}</p>
            <button class="mark-done" data-index="${index}">${task.done ? "Undo" : "Mark Done"}</button>
            <button class="edit-task" data-index="${index}">Edit</button>
            <button class="delete-task" data-index="${index}">Delete</button>
        `;
        taskList.appendChild(taskItem);
    });
}

// Load existing tasks on page load
document.addEventListener("DOMContentLoaded", renderTasks);

// Add new task
addTaskButton.addEventListener("click", () => {
    const taskText = taskInput.value;
    const priority = priorityInput.value;
    const deadline = deadlineInput.value;

    if (taskText.trim() === "" || priority === "select" || deadline === "") {
        alert("Please fill out all fields.");
        return;
    }

    const selectedDate = new Date(deadline);
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
        alert("Please select an upcoming date for the deadline.");
        return;
    }

    const newTask = {
        text: taskText,
        priority,
        deadline,
        done: false
    };

    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();

    taskInput.value = "";
    priorityInput.value = "select";
    deadlineInput.value = "";
});

// Handle button actions (mark done, edit, delete)
taskList.addEventListener("click", (event) => {
    const index = event.target.dataset.index;

    if (event.target.classList.contains("mark-done")) {
        tasks[index].done = !tasks[index].done; // Toggle done status
    } else if (event.target.classList.contains("edit-task")) {
        // Prefill the form with the selected task's data
        taskInput.value = tasks[index].text;
        priorityInput.value = tasks[index].priority;
        deadlineInput.value = tasks[index].deadline;

        // Remove the task from the list so it can be re-added after editing
        tasks.splice(index, 1);
    } else if (event.target.classList.contains("delete-task")) {
        tasks.splice(index, 1); // Remove task from the array
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks(); // Re-render the task list
});
