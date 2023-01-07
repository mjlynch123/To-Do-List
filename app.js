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


// SERVER
import { createRequire } from 'module'
const require = createRequire(import.meta.url);

const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
  // Serve the website
  if (req.url === '/') {
    fs.readFile('./index.html', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

// Set up a WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    // Broadcast the message to all connected clients
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

// Listen for incoming connections
server.listen(80);

