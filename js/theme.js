// Theme management functions

// Toggle between light and dark themes
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');
    
    body.classList.toggle('dark-theme');
    
    if (body.classList.contains('dark-theme')) {
      icon.textContent = '☀️';
      text.textContent = 'Light Mode';
      localStorage.setItem('theme', 'dark');
    } else {
      icon.textContent = '🌙';
      text.textContent = 'Dark Mode';
      localStorage.setItem('theme', 'light');
    }
  }
  
  // Load saved theme preference
  function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    }
  }
  
  // Setup theme toggle button
  function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
  }