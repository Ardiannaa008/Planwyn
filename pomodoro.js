let totalTime = 1500; // 25 minutes in seconds
let elapsedTime = 0;
let isRunning = false;
let timerInterval;
let lastTimestamp;

const initialBorderWidth = 20; // starting thickness
const minimumBorderWidth = 2;  // minimum thickness

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
    isRunning = false;
    elapsedTime = totalTime;
    updateCircleOpacity();
    updateCircleBorder();
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

// Event listeners
document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('pause').addEventListener('click', pauseTimer);
document.getElementById('continue').addEventListener('click', continueTimer);
document.getElementById('reset').addEventListener('click', resetTimer);

// Initial state
showButtons('start', 'reset');
