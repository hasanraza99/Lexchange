// Main application initialization

document.addEventListener("DOMContentLoaded", () => {
    // Load theme first to prevent flicker
    loadTheme();
    
    // Load components
    injectHTML("navbar-container", "components/navbar.html");
    injectHTML("footer-container", "components/footer.html");
    
    // Initialize animations
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 800,
        once: true
      });
    }
    
    // Initialize forms
    setupLoginForm();
    setupProfileForm();
    
    // Initialize real-time validation
    setupRealTimeValidation('profile-form');
    setupRealTimeValidation('login-form');
    
    // Load page-specific content
    if (document.getElementById('partners-container')) {
      setTimeout(loadPartners, 800);
    }
    
    if (document.getElementById('user-profile')) {
      loadDashboard();
    }
  });