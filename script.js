const themeToggle = document.getElementById('theme-toggle');
const icon = document.getElementById('theme-icon');
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
  root.classList.toggle('light', savedTheme === 'light');
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  root.classList.add('light');
}

const isLightInit = root.classList.contains('light');
icon.src = isLightInit ? 'navy.png' : 'yellow.png';

themeToggle.addEventListener('click', () => {
  const isLight =root.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');

  icon.src = isLight ? 'navy.png'  : 'yellow.png';
});


