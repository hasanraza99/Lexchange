// Data and content loading functions

// Language partner data
const languagePartners = [
    {
      id: 1,
      name: "Sarah",
      avatar: "🦉",
      teaches: "French",
      learns: "English",
      bio: "Bonjour! I can help you with conversational French."
    },
    {
      id: 2,
      name: "John",
      avatar: "🐶",
      teaches: "English",
      learns: "Spanish",
      bio: "Hey there! Let's practice English together."
    },
    {
      id: 3,
      name: "Maria",
      avatar: "🐱",
      teaches: "Spanish",
      learns: "French",
      bio: "Hola! I can help you with Spanish."
    },
    {
      id: 4,
      name: "David",
      avatar: "🐻",
      teaches: "German",
      learns: "Italian",
      bio: "Hallo! Let's learn German together."
    },
    {
      id: 5,
      name: "Anna",
      avatar: "🐰",
      teaches: "Italian",
      learns: "German",
      bio: "Ciao! I can help you with Italian."
    },
    {
      id: 6,
      name: "Tom",
      avatar: "🐢",
      teaches: "English",
      learns: "French",
      bio: "Hi! Let's practice English and French."
    },
    {
      id: 7,
      name: "Lina",
      avatar: "🐸",
      teaches: "Chinese",
      learns: "English",
      bio: "你好! I can help you with Chinese."
    },
    {
      id: 8,
      name: "Mark",
      avatar: "🐷",
      teaches: "English",
      learns: "Chinese",
      bio: "Hello! Let's practice English and Chinese."
    },
    {
      id: 9,
      name: "Emma",
      avatar: "🐵",
      teaches: "Spanish",
      learns: "English",
      bio: "Hola! I can help you with Spanish."
    },
    {
      id: 10,
      name: "Lucas",
      avatar: "🐸",
      teaches: "French",
      learns: "Spanish",
      bio: "Bonjour! Let's learn French together."
    },
    {
      id: 11,
      name: "Sophia",
      avatar: "🐶",
      teaches: "English",
      learns: "German",
      bio: "Hello! I'd love to practice German with native speakers." 
    },
  ];
  
  // ============ PARTNER LOADING FUNCTIONS ============
  
// Enhanced loading with realistic delay and states
function loadPartners() {
    const container = document.getElementById('partners-container');
    if (!container) return;
    
    // Show loading spinner
    container.innerHTML = '<div class="col-12 text-center"><div class="loading-indicator"></div> Loading partners...</div>';
    
    // Simulate realistic loading delay
    setTimeout(() => {
      filterPartners('');
    }, 800);
    
    // Set up search functionality
    setupPartnerSearch();
  }
  
  // Set up search functionality for partner filtering
  function setupPartnerSearch() {
    const searchInput = document.getElementById('partner-search');
    const searchButton = document.getElementById('search-button');
    
    if (searchInput && searchButton) {
      // Search on button click
      searchButton.addEventListener('click', () => {
        filterPartners(searchInput.value.trim());
      });
      
      // Search on Enter key
      searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          filterPartners(searchInput.value.trim());
        }
      });
    }
  }
  
// Filter partners based on search term with pagination
function filterPartners(searchTerm) {
    // Reset to first page when filtering
    currentPage = 1;
    
    // Filter partners based on search term
    allFilteredPartners = searchTerm ? 
      languagePartners.filter(partner => 
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.teaches.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.learns.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.bio.toLowerCase().includes(searchTerm.toLowerCase())
      ) : languagePartners;
  
    // Display current page
    displayCurrentPage();
    
    // Update pagination controls
    updatePaginationControls(allFilteredPartners.length);
  }
  
  // Create a partner card element
  function createPartnerCard(partner) {
    const partnerCard = document.createElement('div');
    partnerCard.className = 'col-md-4';
    partnerCard.setAttribute('data-aos', 'fade-up');
    
    partnerCard.innerHTML = `
      <div class="p-4 border rounded shadow-sm h-100 partner-card">
        <h4>${partner.avatar} ${partner.name}</h4>
        <p><strong>Teaches:</strong> ${partner.teaches}</p>
        <p><strong>Wants to learn:</strong> ${partner.learns}</p>
        <p class="small">${partner.bio}</p>
        <button class="btn btn-outline-primary btn-sm connect-btn" 
                data-id="${partner.id}">Connect</button>
      </div>
    `;
    
    return partnerCard;
  }
  
  // Set up event listeners for connect buttons
  function setupConnectButtons() {
    document.querySelectorAll('.connect-btn').forEach(button => {
      button.addEventListener('click', function() {
        const partnerId = this.getAttribute('data-id');
        saveRecentlyViewed(partnerId);
        alert(`Connection requested with partner #${partnerId}`);
      });
    });
  }
  
  // ============ RECENTLY VIEWED FUNCTIONS ============
  
  // Keep track of recently viewed partners
  function saveRecentlyViewed(partnerId) {
    // Get current partner
    const partner = languagePartners.find(p => p.id === parseInt(partnerId));
    if (!partner) return;
    
    // Get existing recently viewed partners
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    // Remove partner if already in list
    recentlyViewed = recentlyViewed.filter(p => p.id !== partner.id);
    
    // Add to front of list
    recentlyViewed.unshift({
      id: partner.id,
      name: partner.name,
      avatar: partner.avatar,
      teaches: partner.teaches
    });
    
    // Keep only last 5
    recentlyViewed = recentlyViewed.slice(0, 5);
    
    // Save back to localStorage
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }
  
  // ============ DASHBOARD FUNCTIONS ============
  
  // Load user dashboard with profile and recently viewed partners
  function loadDashboard() {
    const userProfile = document.getElementById('user-profile');
    const userGreeting = document.getElementById('user-greeting');
    if (!userProfile || !userGreeting) return;
  
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      window.location.href = 'login.html';
      return;
    }
  
    const userData = JSON.parse(localStorage.getItem(currentUser));
    if (!userData) {
      userProfile.innerHTML = '<p>Error loading profile. Please log in again.</p>';
      return;
    }
  
    // Load recently viewed partners section
    loadRecentlyViewed();
  
    // Update user greeting
    userGreeting.textContent = `👋 Welcome back, ${userData.avatar}`;
  
    // Create user profile section
    userProfile.innerHTML = `
      <div class="text-center mb-4">
        <div style="font-size: 4rem;">${userData.avatar}</div>
      </div>
      <p><strong>Email:</strong> ${currentUser}</p>
      <p><strong>I teach:</strong> ${userData.teach}</p>
      <p><strong>I'm learning:</strong> ${userData.learn}</p>
      <p><strong>Bio:</strong> ${userData.bio}</p>
      <button id="logout-btn" class="btn btn-outline-danger mt-3">Log Out</button>
    `;
  
    // Set up logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
      localStorage.removeItem('currentUser');
      alert('Logged out successfully!');
      window.location.href = 'login.html';
    });
  
    // Create progress chart if container exists
    if (document.getElementById('progressChart')) {
      createProgressChart();
    }
  }
  
  // Load recently viewed partners into dashboard
  function loadRecentlyViewed() {
    const recentlyViewedContainer = document.getElementById('recently-viewed');
    if (!recentlyViewedContainer) return;
  
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    if (recentlyViewed.length === 0) {
      recentlyViewedContainer.innerHTML = '<p>You haven\'t viewed any partners yet.</p>';
    } else {
      let html = '<ul class="list-unstyled">';
      recentlyViewed.forEach(partner => {
        html += `<li class="mb-2">• ${partner.avatar} ${partner.name} (${partner.teaches})</li>`;
      });
      html += '</ul>';
      recentlyViewedContainer.innerHTML = html;
    }
  }
  
  // ============ CHART FUNCTIONS ============
  
  // Create progress chart for dashboard
  function createProgressChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;
    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'To Do'],
        datasets: [{
          data: [65, 25, 10],
          backgroundColor: ['#20bf6b', '#f7b731', '#eb3b5a']
        }]
      },
      options: {
        responsive: true,
        plugins: { 
          legend: { 
            position: 'bottom' 
          } 
        }
      }
    });
  }
  
  // ============ MATCHING ALGORITHM ============
  // Smart partner matching algorithm
function findBestMatches(userTeaches, userLearns) {
  return languagePartners
    .filter(partner => 
      partner.teaches === userLearns && partner.learns === userTeaches
    )
    .concat(
      languagePartners.filter(partner => 
        partner.teaches === userLearns || partner.learns === userTeaches
      )
    )
    .slice(0, 3); // Top 3 matches
}

// Add match button to dashboard
function addMatchingToDashboard() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return;
  
  const userData = JSON.parse(localStorage.getItem(currentUser));
  if (!userData) return;
  
  const userProfile = document.getElementById('user-profile');
  if (userProfile) {
    const matchButton = document.createElement('button');
    matchButton.className = 'btn btn-success mt-2';
    matchButton.textContent = 'Find My Best Matches';
    matchButton.onclick = () => {
      const matches = findBestMatches(userData.teach, userData.learn);
      const matchNames = matches.map(m => `${m.avatar} ${m.name}`).join(', ');
      alert(`Your best matches: ${matchNames || 'No perfect matches found'}`);
    };
    userProfile.appendChild(matchButton);
  }
}

// Add to loadDashboard
addMatchingToDashboard();

  
  // ============ SPEECH FUNCTIONS ============
  
  // Simple text-to-speech function for pronunciation practice
  function speakText(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported');
    }
  }
  
  // Make speakText globally available for HTML onclick events
  window.speakText = speakText;

// ============ PAGINATION FUNCTIONS ============

// Pagination state
let currentPage = 1;
const itemsPerPage = 6;
let allFilteredPartners = []; // Store all filtered results

// Calculate pagination info
function getPaginationInfo(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    totalPages,
    startIndex,
    endIndex,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
}

// Get items for current page
function getCurrentPageItems(items) {
  const { startIndex, endIndex } = getPaginationInfo(items.length);
  return items.slice(startIndex, endIndex);
}

// Update pagination controls
function updatePaginationControls(totalItems) {
  const paginationContainer = document.querySelector('.pagination');
  if (!paginationContainer) return;
  
  const { totalPages, hasNext, hasPrev } = getPaginationInfo(totalItems);
  
  // Clear existing pagination
  paginationContainer.innerHTML = '';
  
  // Previous button
  const prevItem = document.createElement('li');
  prevItem.className = `page-item ${hasPrev ? '' : 'disabled'}`;
  prevItem.innerHTML = `
    <a class="page-link" href="#" ${!hasPrev ? 'tabindex="-1" aria-disabled="true"' : ''}>
      Previous
    </a>
  `;
  if (hasPrev) {
    prevItem.addEventListener('click', (e) => {
      e.preventDefault();
      changePage(currentPage - 1);
    });
  }
  paginationContainer.appendChild(prevItem);
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement('li');
    pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
    pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    
    pageItem.addEventListener('click', (e) => {
      e.preventDefault();
      changePage(i);
    });
    
    paginationContainer.appendChild(pageItem);
  }
  
  // Next button
  const nextItem = document.createElement('li');
  nextItem.className = `page-item ${hasNext ? '' : 'disabled'}`;
  nextItem.innerHTML = `
    <a class="page-link" href="#" ${!hasNext ? 'tabindex="-1" aria-disabled="true"' : ''}>
      Next
    </a>
  `;
  if (hasNext) {
    nextItem.addEventListener('click', (e) => {
      e.preventDefault();
      changePage(currentPage + 1);
    });
  }
  paginationContainer.appendChild(nextItem);
}

// Change to specific page
function changePage(newPage) {
  currentPage = newPage;
  displayCurrentPage();
  updatePaginationControls(allFilteredPartners.length);
  
  // Scroll to top of results
  const container = document.getElementById('partners-container');
  if (container) {
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Display partners for current page
function displayCurrentPage() {
  const container = document.getElementById('partners-container');
  const noResults = document.getElementById('no-results');
  if (!container) return;
  
  // Clear container
  container.innerHTML = '';
  
  // Get items for current page
  const currentPageItems = getCurrentPageItems(allFilteredPartners);
  
  // Show/hide no results message
  if (allFilteredPartners.length === 0) {
    if (noResults) noResults.classList.remove('d-none');
    return;
  } else {
    if (noResults) noResults.classList.add('d-none');
  }
  
  // Add partners to container
  currentPageItems.forEach(partner => {
    const partnerCard = createPartnerCard(partner);
    container.appendChild(partnerCard);
  });
  
  // Set up connect buttons
  setupConnectButtons();

    // Update results info
    updateResultsInfo();
}

// Update results information
function updateResultsInfo() {
    const resultsInfo = document.getElementById('results-info');
    if (!resultsInfo) return;
    
    const totalItems = allFilteredPartners.length;
    if (totalItems === 0) {
      resultsInfo.innerHTML = '';
      return;
    }
    
    const { startIndex, endIndex } = getPaginationInfo(totalItems);
    const actualEndIndex = Math.min(endIndex, totalItems);
    
    resultsInfo.innerHTML = `
      <small class="text-muted">
        Showing ${startIndex + 1}-${actualEndIndex} of ${totalItems} partners
      </small>
    `;
  }