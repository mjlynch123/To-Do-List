const todoList = document.getElementById("todo-list");
const taskInput = document.getElementById("task");
const addButton = document.getElementById("add-button");

// Add a task to the todo list when the form is submitted
addButton.addEventListener("click", addTask);

function addTask(event) {
  event.preventDefault();
  if (taskInput.value === "") return;

  // Create a new list item for the task
  const task = document.createElement("li");
  task.innerHTML = `<span>${taskInput.value}</span><button class="close">X</button>`;

  // Add the task to the todo list
  todoList.appendChild(task);
  taskInput.value = "";

  // Save the tasks to local storage
  saveTasks();
}

// Remove a task when the close button is clicked
todoList.addEventListener("click", removeTask);

function removeTask(event) {
  if (event.target.className !== "close") return;
  event.target.parentElement.remove();

  // Save the tasks to local storage
  saveTasks();
}

// Save the tasks to local storage
function saveTasks() {
  const tasks = [];
  for (const task of todoList.children) {
    tasks.push(task.firstElementChild.textContent);
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load the tasks from local storage when the page loads
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks === null) return;
  for (const task of tasks) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${task}</span><button class="close">X</button>`;
    todoList.appendChild(li);
  }
}

loadTasks();
