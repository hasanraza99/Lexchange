// Authentication flow management - controls page visibility based on login status

// Define page access rules
const pageAccess = {
    // Pages that require authentication
    protected: ['dashboard.html', 'browse.html'],
    // Pages only for non-authenticated users
    guestOnly: ['login.html'],
    // Always accessible
    public: ['index.html', 'about.html', 'practice.html']
  };
  
  // Check page access on load
  function checkPageAccess() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isLoggedIn = localStorage.getItem('currentUser') !== null;
    
    // Redirect if accessing protected page without login
    if (pageAccess.protected.includes(currentPage) && !isLoggedIn) {
      window.location.href = 'login.html';
      return;
    }
    
    // Redirect if accessing guest-only page while logged in
    if (pageAccess.guestOnly.includes(currentPage) && isLoggedIn) {
      window.location.href = 'dashboard.html';
      return;
    }
  }
  
  // Update navigation visibility based on auth state
  function updateNavigationVisibility() {
    const isLoggedIn = localStorage.getItem('currentUser') !== null;
    
    // Wait for navbar to load
    setTimeout(() => {
      // Get navigation items
      const loginLink = document.querySelector('a[href="login.html"]')?.parentElement;
      const dashboardLink = document.querySelector('a[href="dashboard.html"]')?.parentElement;
      const browseLink = document.querySelector('a[href="browse.html"]')?.parentElement;
      const profileLink = document.querySelector('a[href="profile.html"]');
      
      if (!isLoggedIn) {
        // Guest user view
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (profileLink) profileLink.textContent = 'Sign Up';
        
        // Change "Edit Profile" in dropdown to "Create Profile"
        const editProfileLink = document.querySelector('.dropdown-item[href="profile.html"]');
        if (editProfileLink) editProfileLink.textContent = 'Create Profile';
      } else {
        // Logged in user view
        if (loginLink) loginLink.style.display = 'none';
        
        // Update profile link in dropdown
        const editProfileLink = document.querySelector('.dropdown-item[href="profile.html"]');
        if (editProfileLink) editProfileLink.textContent = 'Edit Profile';
      }
    }, 500);
  }
  
  // Update home page CTAs based on auth
  function updateHomeCTAs() {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      const isLoggedIn = localStorage.getItem('currentUser') !== null;
      
      setTimeout(() => {
        const primaryCTA = document.querySelector('a[href="profile.html"].btn-light');
        if (primaryCTA) {
          if (isLoggedIn) {
            primaryCTA.href = 'browse.html';
            primaryCTA.textContent = 'Find Partners';
          } else {
            primaryCTA.href = 'profile.html';
            primaryCTA.textContent = 'Get Started Free';
          }
        }
      }, 100);
    }
  }
  
  // Initialize auth flow
  document.addEventListener('DOMContentLoaded', () => {
    checkPageAccess();
    updateNavigationVisibility();
    updateHomeCTAs();
  });
  
  // Export for use in other files
  window.authFlow = {
    checkPageAccess,
    updateNavigationVisibility,
    updateHomeCTAs
  };