// Functions for loading components and shared UI elements

// Load HTML components into the page
const injectHTML = (targetId, filePath) => {
    fetch(filePath)
      .then(response => response.text())
      .then(data => {
        document.getElementById(targetId).innerHTML = data;
        
        // Handle specific components after loading
        if (targetId === 'navbar-container') {
          highlightCurrentPage();
          initializeThemeToggle();
        }
      })
      .catch(error => console.error(`Error loading ${filePath}:`, error));
  };
  
  // Highlight current page in navigation
  function highlightCurrentPage() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (currentPage.includes(href) && href.length > 1) {
        link.classList.add('active');
      }
    });
  }