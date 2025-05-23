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
    }
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
  
  // Filter partners based on search term
  function filterPartners(searchTerm) {
    const container = document.getElementById('partners-container');
    const noResults = document.getElementById('no-results');
    if (!container) return;
  
    // Clear container
    container.innerHTML = '';
  
    // Filter partners based on search term
    const filteredPartners = searchTerm ? 
      languagePartners.filter(partner => 
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.teaches.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.learns.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.bio.toLowerCase().includes(searchTerm.toLowerCase())
      ) : languagePartners;
  
    // Show/hide no results message
    if (filteredPartners.length === 0) {
      if (noResults) noResults.classList.remove('d-none');
    } else {
      if (noResults) noResults.classList.add('d-none');
      
      // Add filtered partners to container
      filteredPartners.forEach(partner => {
        const partnerCard = createPartnerCard(partner);
        container.appendChild(partnerCard);
      });
      
      // Add event listeners to connect buttons
      setupConnectButtons();
    }
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

