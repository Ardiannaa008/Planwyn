let workTime = 1500;       // 25 minutes in seconds
let shortBreakTime = 300;  // 5 minutes
let longBreakTime = 900;   // 15 minutes

let totalTime = workTime;
let elapsedTime = 0;
let isRunning = false;
let lastTimestamp;

let alarmAudio = new Audio('sounds/alarm-327234.mp3');
alarmAudio.loop = true;

const initialBorderWidth = 20; 
const minimumBorderWidth = 2;  

let pomodoroCount = Number(localStorage.getItem('pomodoroCount')) || 0;
let mode = 'work'; // 'work' or 'break'

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
  if (!isRunning) return;
  isRunning = false;
  showButtons('continue', 'reset');
}

function continueTimer() {
  if (isRunning) return;
  isRunning = true;
  lastTimestamp = performance.now();
  requestAnimationFrame(update);
  showButtons('pause', 'reset');
}

function resetTimer() {
  isRunning = false;
  elapsedTime = 0;
  mode = 'work';
  totalTime = workTime;
  updateVisuals();
  showButtons('start', 'reset');
  stopAlarm();
}

function update(currentTime) {
  if (!isRunning) return;

  const delta = (currentTime - lastTimestamp) / 1000;
  lastTimestamp = currentTime;

  elapsedTime += delta;

  if (elapsedTime >= totalTime) {
    elapsedTime = totalTime;
    updateVisuals();

    isRunning = false;

    // Switch mode logic
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

      playAlarm();
      showAlarmPopup('Work session done! Time for a break.');
    } else {
      mode = 'work';
      totalTime = workTime;
      playAlarm();
      showAlarmPopup('Break finished! Time to work.');
    }

    elapsedTime = 0;
    updateVisuals();
    showButtons('start', 'reset');
    return;
  }

  updateVisuals();
  requestAnimationFrame(update);
}

function updateVisuals() {
  updateCircleOpacity();
  updateCircleBorder();
  updateTimeDisplay();
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
    const btn = document.getElementById(id);
    if (id === button1 || id === button2) {
      btn.classList.remove('hidden');
    } else {
      btn.classList.add('hidden');
    }
  });
}

function updatePomodoroCount() {
  const countElem = document.getElementById('pomodoro-count');
  if (countElem) {
    countElem.textContent = `Pomodoros completed: ${pomodoroCount}`;
  }
}

function playAlarm() {
  alarmAudio.currentTime = 0;
  alarmAudio.play().catch(() => {});
}

function stopAlarm() {
  alarmAudio.pause();
  alarmAudio.currentTime = 0;
}

function showAlarmPopup(message) {
  const popup = document.getElementById('alarm-popup');
  document.getElementById('alarm-message').textContent = message;
  popup.classList.remove('hidden');
}

function closeAlarmPopup() {
  const popup = document.getElementById('alarm-popup');
  popup.classList.add('hidden');
  stopAlarm();
}

function applyCustomTimes() {
  const workInput = document.getElementById('custom-work').value;
  const shortBreakInput = document.getElementById('custom-short-break').value;
  const longBreakInput = document.getElementById('custom-long-break').value;

  if (workInput) workTime = parseInt(workInput, 10) * 60;
  if (shortBreakInput) shortBreakTime = parseInt(shortBreakInput, 10) * 60;
  if (longBreakInput) longBreakTime = parseInt(longBreakInput, 10) * 60;

  if (mode === 'work') {
    totalTime = workTime;
  } else {
    totalTime = (pomodoroCount % 4 === 0) ? longBreakTime : shortBreakTime;
  }

  elapsedTime = 0;
  updateVisuals();
}

// Sidebar toggle (if needed)
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('active');
}

// Event listeners
document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('pause').addEventListener('click', pauseTimer);
document.getElementById('continue').addEventListener('click', continueTimer);
document.getElementById('reset').addEventListener('click', resetTimer);
document.getElementById('alarm-close').addEventListener('click', closeAlarmPopup);
document.getElementById('apply-times').addEventListener('click', applyCustomTimes);
document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);

window.addEventListener('DOMContentLoaded', () => {
  updatePomodoroCount();
  updateVisuals();
  showButtons('start', 'reset');
});

function isInAppBrowser() {
  const ua = navigator.userAgent || navigator.vendor;
  return /Instagram|FBAN|FBAV|FB_IAB|FB4A|FBCR|FBIOS|FBSV|TikTok/i.test(ua);
}

if (isInAppBrowser()) {
  document.getElementById('openInBrowserPopup').style.display = 'block';

  document.getElementById('openInBrowserBtn').addEventListener('click', () => {
    window.open(window.location.href, '_blank'); // This opens it in the default browser (if allowed)
  });
}
