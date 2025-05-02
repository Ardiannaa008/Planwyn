let taskInput;
let taskList;

document.addEventListener("DOMContentLoaded", () => {
  taskInput = document.getElementById("taskInput");
  taskList = document.getElementById("taskList");

  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  saved.forEach(task => addTaskToList(task.text, task.done));
});

function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  addTaskToList(text);
  taskInput.value = "";
  saveTasks();
}

function addTaskToList(text, done = false) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = text;
  span.classList.add("text-text");

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  // Done button
  const doneButton = document.createElement("button");
  doneButton.classList.add("done-btn");
  doneButton.innerHTML = '<i class="fas fa-check"></i>';
  doneButton.addEventListener("click", () => {
    li.classList.toggle("done");
    doneButton.classList.toggle("done-clicked");
    saveTasks();
  });

  // Delete button
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-btn");
  deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteButton.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  // Add both buttons to the button container
  buttonContainer.appendChild(doneButton);
  buttonContainer.appendChild(deleteButton);

  li.appendChild(span);
  li.appendChild(buttonContainer);
  taskList.appendChild(li);
}


function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach(li => {
    tasks.push({
      text: li.textContent.replace("DoneDelete", "").trim(),
      done: li.classList.contains("done")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('active');
}

