// Data and content loading functions - Simplified and consolidated

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
  
// ============ PAGINATION STATE ============
const paginationState = {
  currentPage: 1,
  itemsPerPage: 6,
  filteredPartners: []
};

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
    
    if (!searchInput || !searchButton) return;
    
    // Handle search action
    const performSearch = () => filterPartners(searchInput.value.trim());
    
    // Search on button click or Enter key
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}
  
// Filter partners based on search term with pagination
function filterPartners(searchTerm) {
    // Reset to first page when filtering
    paginationState.currentPage = 1;
    
    // Filter partners based on search term
    paginationState.filteredPartners = searchTerm ? 
      languagePartners.filter(partner => 
        Object.values(partner).some(value => 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) : languagePartners;
  
    // Display current page
    displayCurrentPage();
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
                data-id="${partner.id}"
                data-name="${partner.name}"
                data-avatar="${partner.avatar}"
                data-teaches="${partner.teaches}">Connect</button>
      </div>
    `;
    
    return partnerCard;
}
  
// Set up event listeners for connect buttons
function setupConnectButtons() {
    document.querySelectorAll('.connect-btn').forEach(button => {
      button.addEventListener('click', function() {
        const partnerId = this.getAttribute('data-id');
        const partnerData = {
          id: parseInt(partnerId),
          name: this.getAttribute('data-name'),
          avatar: this.getAttribute('data-avatar'),
          teaches: this.getAttribute('data-teaches')
        };
        
        saveRecentlyViewed(partnerData);
        
        // Add animation feedback
        this.textContent = 'Connected!';
        this.classList.remove('btn-outline-primary');
        this.classList.add('btn-success');
        setTimeout(() => {
          this.textContent = 'Connect';
          this.classList.remove('btn-success');
          this.classList.add('btn-outline-primary');
        }, 2000);
      });
    });
}
  
// ============ RECENTLY VIEWED FUNCTIONS ============
  
// Keep track of recently viewed partners - simplified
function saveRecentlyViewed(partner) {
    // Get existing recently viewed partners
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    // Remove partner if already in list, add to front, keep only last 5
    recentlyViewed = [partner, ...recentlyViewed.filter(p => p.id !== partner.id)].slice(0, 5);
    
    // Save back to localStorage
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}
  
// ============ DASHBOARD FUNCTIONS ============
  
// Load user dashboard with profile and recently viewed partners
function loadDashboard() {
    const userProfile = document.getElementById('user-profile');
    const userGreeting = document.getElementById('user-greeting');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!userProfile || !userGreeting) return;
    
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
  
    // Create user profile section with improved layout
    userProfile.innerHTML = `
      <div class="text-center mb-4">
        <div style="font-size: 4rem;">${userData.avatar}</div>
      </div>
      <div class="row g-3">
        <div class="col-12"><strong>Email:</strong> ${currentUser}</div>
        <div class="col-sm-6"><strong>I teach:</strong> ${userData.teach}</div>
        <div class="col-sm-6"><strong>I'm learning:</strong> ${userData.learn}</div>
        <div class="col-12"><strong>Bio:</strong> ${userData.bio}</div>
      </div>
      <div class="mt-3 d-flex gap-2 flex-wrap">
        <button id="find-matches-btn" class="btn btn-success">Find My Best Matches</button>
        <button id="logout-btn" class="btn btn-outline-danger">Log Out</button>
      </div>
    `;
  
    // Set up buttons
    document.getElementById('logout-btn')?.addEventListener('click', function() {
      localStorage.removeItem('currentUser');
      alert('Logged out successfully!');
      window.location.href = 'login.html';
    });
    
    document.getElementById('find-matches-btn')?.addEventListener('click', function() {
      const matches = findBestMatches(userData.teach, userData.learn);
      if (matches.length > 0) {
        const matchList = matches.map(m => `${m.avatar} ${m.name}`).join(', ');
        alert(`Your best matches: ${matchList}`);
      } else {
        alert('No perfect matches found. Try browsing all partners!');
      }
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
      recentlyViewedContainer.innerHTML = '<p class="text-muted">You haven\'t viewed any partners yet.</p>';
    } else {
      const html = recentlyViewed.map(partner => 
        `<li class="mb-2">• ${partner.avatar} ${partner.name} (${partner.teaches})</li>`
      ).join('');
      recentlyViewedContainer.innerHTML = `<ul class="list-unstyled">${html}</ul>`;
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
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: { 
          legend: { 
            position: 'bottom',
            labels: {
              padding: 20,
              font: { size: 14 }
            }
          } 
        }
      }
    });
}
  
// ============ MATCHING ALGORITHM ============

// Smart partner matching algorithm
function findBestMatches(userTeaches, userLearns) {
  // Perfect matches (they learn what you teach AND teach what you learn)
  const perfectMatches = languagePartners.filter(partner => 
    partner.teaches === userLearns && partner.learns === userTeaches
  );
  
  // Good matches (either teaches what you want OR learns what you teach)
  const goodMatches = languagePartners.filter(partner => 
    (partner.teaches === userLearns || partner.learns === userTeaches) &&
    !perfectMatches.includes(partner)
  );
  
  // Return perfect matches first, then good matches, limited to 3
  return [...perfectMatches, ...goodMatches].slice(0, 3);
}
  
// ============ SPEECH FUNCTIONS ============
  
// Simple text-to-speech function for pronunciation practice
function speakText(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for language learning
      speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported in your browser');
    }
}
  
// Make speakText globally available for HTML onclick events
window.speakText = speakText;

// ============ PAGINATION FUNCTIONS ============

// Calculate pagination info
function getPaginationInfo() {
  const { currentPage, itemsPerPage, filteredPartners } = paginationState;
  const totalItems = filteredPartners.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  return {
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
}

// Update pagination controls - simplified
function updatePaginationControls() {
  const paginationContainer = document.querySelector('.pagination');
  if (!paginationContainer) return;
  
  const { totalPages, hasNext, hasPrev } = getPaginationInfo();
  const { currentPage } = paginationState;
  
  // Build pagination HTML
  let paginationHTML = `
    <li class="page-item ${hasPrev ? '' : 'disabled'}">
      <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">
        Previous
      </a>
    </li>
  `;
  
  // Add page numbers
  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
      </li>
    `;
  }
  
  paginationHTML += `
    <li class="page-item ${hasNext ? '' : 'disabled'}">
      <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">
        Next
      </a>
    </li>
  `;
  
  paginationContainer.innerHTML = paginationHTML;
}

// Change to specific page
function changePage(newPage) {
  const { totalPages } = getPaginationInfo();
  
  // Validate page number
  if (newPage < 1 || newPage > totalPages) return;
  
  paginationState.currentPage = newPage;
  displayCurrentPage();
  
  // Smooth scroll to top of results
  document.getElementById('partners-container')?.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
}

// Display partners for current page
function displayCurrentPage() {
  const container = document.getElementById('partners-container');
  const noResults = document.getElementById('no-results');
  if (!container) return;
  
  const { startIndex, endIndex, totalItems } = getPaginationInfo();
  const { filteredPartners } = paginationState;
  
  // Clear container
  container.innerHTML = '';
  
  // Show/hide no results message
  if (totalItems === 0) {
    noResults?.classList.remove('d-none');
    updateResultsInfo();
    return;
  } else {
    noResults?.classList.add('d-none');
  }
  
  // Add partners to container
  filteredPartners.slice(startIndex, endIndex).forEach((partner, index) => {
    const partnerCard = createPartnerCard(partner);
    // Add staggered animation delay
    partnerCard.setAttribute('data-aos-delay', index * 50);
    container.appendChild(partnerCard);
  });
  
  // Update UI elements
  setupConnectButtons();
  updatePaginationControls();
  updateResultsInfo();
}

// Update results information
function updateResultsInfo() {
    const resultsInfo = document.getElementById('results-info');
    if (!resultsInfo) return;
    
    const { startIndex, endIndex, totalItems } = getPaginationInfo();
    
    if (totalItems === 0) {
      resultsInfo.innerHTML = '';
      return;
    }
    
    resultsInfo.innerHTML = `
      <small class="text-muted">
        Showing ${startIndex + 1}-${endIndex} of ${totalItems} partners
      </small>
    `;
}

// Make changePage globally available for pagination onclick
window.changePage = changePage;