let workTime = 1500;       // 25 minutes
let shortBreakTime = 300;  // 5 minutes
let longBreakTime = 900;   // 15 minutes

let totalTime = workTime;
let elapsedTime = 0;
let isRunning = false;
let lastTimestamp;

const initialBorderWidth = 20; 
const minimumBorderWidth = 2;  

let pomodoroCount = localStorage.getItem('pomodoroCount');
pomodoroCount = pomodoroCount ? Number(pomodoroCount) : 0;

let mode = 'work'; 

function updateCircleOpacity() {
  const circle = document.getElementById('circle');
  const remainingTime = totalTime - elapsedTime;
  const percentage = remainingTime / totalTime;
  circle.style.opacity = Math.max(0, percentage);
}

function updateCircleBorder() {
  const circle = document.getElementById('circle');
  const progress = elapsedTime / totalTime;
  const newBorderWidth = initialBorderWidth - (initialBorderWidth - minimumBorderWidth) * progress;
  circle.style.borderWidth = `${newBorderWidth}px`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  lastTimestamp = performance.now();
  requestAnimationFrame(update);
  showButtons('pause', 'reset');
}

function pauseTimer() {
  isRunning = false;
  showButtons('continue', 'reset');
}

function continueTimer() {
  if (!isRunning) {
    isRunning = true;
    lastTimestamp = performance.now();
    requestAnimationFrame(update);
    showButtons('pause', 'reset');
  }
}

function resetTimer() {
  isRunning = false;
  elapsedTime = 0;
  mode = 'work';
  totalTime = workTime;
  updateCircleOpacity();
  updateCircleBorder();
  updateTimeDisplay();
  showButtons('start', 'reset');
}

function update(currentTime) {
  if (!isRunning) return;

  const delta = (currentTime - lastTimestamp) / 1000;
  lastTimestamp = currentTime;

  elapsedTime += delta;

  updateCircleOpacity();
  updateCircleBorder();
  updateTimeDisplay();

  if (elapsedTime >= totalTime) {
    elapsedTime = totalTime;
    updateCircleOpacity();
    updateCircleBorder();
    updateTimeDisplay();

    isRunning = false;

    if (mode === 'work') {
      pomodoroCount++;
      localStorage.setItem('pomodoroCount', pomodoroCount);
      updatePomodoroCount();
  
      if (pomodoroCount % 4 === 0) {
        mode = 'break';
        totalTime = longBreakTime;
      } else {
        mode = 'break';
        totalTime = shortBreakTime;
      }
    } else {
      mode = 'work';
      totalTime = workTime;
    }
  
    elapsedTime = 0;
    updateTimeDisplay();
    showButtons('start', 'reset');
    return;
  }

  requestAnimationFrame(update);
}

function updateTimeDisplay() {
  const timeElement = document.getElementById('time');
  const remainingTime = Math.max(totalTime - elapsedTime, 0);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = Math.floor(remainingTime % 60);

  timeElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function showButtons(button1, button2) {
  const buttons = ['start', 'pause', 'continue', 'reset'];
  buttons.forEach(id => {
    const button = document.getElementById(id);
    if (id === button1 || id === button2) {
      button.classList.remove('hidden');
    } else {
      button.classList.add('hidden');
    }
  });
}

function updatePomodoroCount() {
  const countElem = document.getElementById('pomodoro-count');
  if (countElem) {
    countElem.textContent = `Pomodoros completed: ${pomodoroCount}`;
  }
}

function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('active');
}

document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('pause').addEventListener('click', pauseTimer);
document.getElementById('continue').addEventListener('click', continueTimer);
document.getElementById('reset').addEventListener('click', resetTimer);

updatePomodoroCount();
showButtons('start', 'reset');
updateCircleOpacity();
updateCircleBorder();
updateTimeDisplay();

function applyCustomTimes() {
  const workInput = document.getElementById('custom-work').value;
  const shortBreakInput = document.getElementById('custom-short-break').value;
  const longBreakInput = document.getElementById('custom-long-break').value;

  workTime = parseInt(workInput) * 60;
  shortBreakTime = parseInt(shortBreakInput) * 60;
  longBreakTime = parseInt(longBreakInput) * 60;

  if (mode === 'work') {
    totalTime = workTime;
  } else {
    totalTime = mode === 'break' && (pomodoroCount % 4 === 0) ? longBreakTime : shortBreakTime;
  }

  elapsedTime = 0;
  updateTimeDisplay();
  updateCircleOpacity();
  updateCircleBorder();
}

