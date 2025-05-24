// Main application initialization
document.addEventListener("DOMContentLoaded", () => {
  // Load theme
  loadTheme();
  
  // Load components
  injectHTML("navbar-container", "components/navbar.html");
  injectHTML("footer-container", "components/footer.html");
  
  // Initialize animations
  if (typeof AOS !== "undefined") {
      AOS.init({ duration: 800, once: true });
  }
  
  // Initialize forms
  setupLoginForm();
  setupProfileForm();
  
  // Load page-specific content
  const partnersContainer = document.getElementById('partners-container');
  if (partnersContainer) {
      setTimeout(loadPartners, 800);
  }
  
  const userProfile = document.getElementById('user-profile');
  if (userProfile) {
      loadDashboard();
  }
});