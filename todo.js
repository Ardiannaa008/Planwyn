let taskInput;
let taskList;
let startTime, endTime;



document.addEventListener("DOMContentLoaded", () => {
  taskInput = document.getElementById("taskInput");
  startTime = document.getElementById("startTime");
  endTime = document.getElementById("endTime");
  taskList = document.getElementById("taskList");

  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  saved.forEach(task => addTaskToList(task.text, task.start, task.end, task.done));

});


function addTask() {
  const text = taskInput.value.trim();
  const start = startTime.value;
  const end = endTime.value;

  if (text === "") return;

  addTaskToList(text, start, end);
  taskInput.value = "";
  startTime.value = "";
  endTime.value = "";
  saveTasks();
}


function addTaskToList(text, start = "", end = "", done = false) {
  const li = document.createElement("li");
  if (done) li.classList.add("done");

  const span = document.createElement("span");
  span.classList.add("task-text");
  const timeRange = (start && end) ? `🕒 ${start} - ${end}` : "";
  span.innerHTML = `<strong>${text}</strong><br>${timeRange}`;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const doneButton = document.createElement("button");
  doneButton.classList.add("done-btn");
  doneButton.innerHTML = '<i class="fas fa-check"></i>';
  doneButton.addEventListener("click", () => {
    li.classList.toggle("done");
    doneButton.classList.toggle("done-clicked");
    saveTasks();
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-btn");
  deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteButton.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  buttonContainer.appendChild(doneButton);
  buttonContainer.appendChild(deleteButton);

  li.appendChild(span);
  li.appendChild(buttonContainer);
  taskList.appendChild(li);
}


function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach(li => {
    const span = li.querySelector(".task-text");
    const lines = span.innerHTML.split("<br>");
    const taskLine = lines[0].replace(/<[^>]+>/g, "").trim();
    const timeLine = lines[1] || "";
    const timeMatch = timeLine.match(/🕒 (\d{2}:\d{2}) - (\d{2}:\d{2})/);

    tasks.push({
      text: taskLine,
      start: timeMatch ? timeMatch[1] : "",
      end: timeMatch ? timeMatch[2] : "",
      done: li.classList.contains("done")
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('active');
}

