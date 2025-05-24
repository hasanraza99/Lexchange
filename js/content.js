// Language partner data
const languagePartners = [
  { id: 1, name: "Sarah", avatar: "🦉", teaches: "French", learns: "English", bio: "Bonjour! I can help you with conversational French." },
  { id: 2, name: "John", avatar: "🐶", teaches: "English", learns: "Spanish", bio: "Hey there! Let's practice English together." },
  { id: 3, name: "Maria", avatar: "🐱", teaches: "Spanish", learns: "French", bio: "Hola! I can help you with Spanish." },
  { id: 4, name: "David", avatar: "🐻", teaches: "German", learns: "Italian", bio: "Hallo! Let's learn German together." },
  { id: 5, name: "Anna", avatar: "🐰", teaches: "Italian", learns: "German", bio: "Ciao! I can help you with Italian." },
  { id: 6, name: "Tom", avatar: "🐢", teaches: "English", learns: "French", bio: "Hi! Let's practice English and French." },
  { id: 7, name: "Lina", avatar: "🐸", teaches: "Chinese", learns: "English", bio: "你好! I can help you with Chinese." },
  { id: 8, name: "Mark", avatar: "🐷", teaches: "English", learns: "Chinese", bio: "Hello! Let's practice English and Chinese." },
  { id: 9, name: "Emma", avatar: "🐵", teaches: "Spanish", learns: "English", bio: "Hola! I can help you with Spanish." },
  { id: 10, name: "Lucas", avatar: "🐸", teaches: "French", learns: "Spanish", bio: "Bonjour! Let's learn French together." },
  { id: 11, name: "Sophia", avatar: "🐶", teaches: "English", learns: "German", bio: "Hello! I'd love to practice German with native speakers." }
];

// Pagination state
const pagination = {
  currentPage: 1,
  itemsPerPage: 6,
  filteredPartners: [],

  filter(searchTerm) {
    this.currentPage = 1;
    this.filteredPartners = searchTerm ? 
      languagePartners.filter(partner => 
        Object.values(partner).some(value => 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) : languagePartners;
    this.display();
  },

  display() {
    const container = document.getElementById('partners-container');
    const noResults = document.getElementById('no-results');
    if (!container) return;

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const items = this.filteredPartners.slice(start, start + this.itemsPerPage);

    container.innerHTML = '';
    noResults?.classList.toggle('d-none', this.filteredPartners.length > 0);

    items.forEach((partner, index) => {
      const card = createPartnerCard(partner);
      card.setAttribute('data-aos-delay', index * 50);
      container.appendChild(card);
    });

    setupConnectButtons();
    this.updateControls();
    this.updateInfo();
  },

  updateControls() {
    const paginationEl = document.querySelector('.pagination');
    if (!paginationEl) return;

    const totalPages = Math.ceil(this.filteredPartners.length / this.itemsPerPage);
    const current = this.currentPage;

    let html = `
      <li class="page-item ${current === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="pagination.changePage(${current - 1}); return false;">Previous</a>
      </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
      html += `
        <li class="page-item ${i === current ? 'active' : ''}">
          <a class="page-link" href="#" onclick="pagination.changePage(${i}); return false;">${i}</a>
        </li>
      `;
    }

    html += `
      <li class="page-item ${current === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="pagination.changePage(${current + 1}); return false;">Next</a>
      </li>
    `;

    paginationEl.innerHTML = html;
  },

  updateInfo() {
    const info = document.getElementById('results-info');
    if (!info || this.filteredPartners.length === 0) {
      if (info) info.innerHTML = '';
      return;
    }

    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(start + this.itemsPerPage - 1, this.filteredPartners.length);
    
    info.innerHTML = `<small class="text-muted">Showing ${start}-${end} of ${this.filteredPartners.length} partners</small>`;
  },

  changePage(page) {
    const totalPages = Math.ceil(this.filteredPartners.length / this.itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    this.currentPage = page;
    this.display();
    document.getElementById('partners-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Create partner card
function createPartnerCard(partner) {
  const card = document.createElement('div');
  card.className = 'col-md-4';
  card.setAttribute('data-aos', 'fade-up');
  
  card.innerHTML = `
    <div class="p-4 border rounded shadow-sm h-100 partner-card">
      <h4>${partner.avatar} ${partner.name}</h4>
      <p><strong>Teaches:</strong> ${partner.teaches}</p>
      <p><strong>Wants to learn:</strong> ${partner.learns}</p>
      <p class="small">${partner.bio}</p>
      <button class="btn btn-outline-primary btn-sm connect-btn" 
              data-partner='${JSON.stringify({id: partner.id, name: partner.name, avatar: partner.avatar, teaches: partner.teaches})}'>
        Connect
      </button>
    </div>
  `;
  
  return card;
}

// Setup connect buttons
function setupConnectButtons() {
  document.querySelectorAll('.connect-btn').forEach(button => {
    button.addEventListener('click', function() {
      const partner = JSON.parse(this.getAttribute('data-partner'));
      saveRecentlyViewed(partner);
      
      this.textContent = 'Connected!';
      this.classList.replace('btn-outline-primary', 'btn-success');
      
      setTimeout(() => {
        this.textContent = 'Connect';
        this.classList.replace('btn-success', 'btn-outline-primary');
      }, 2000);
    });
  });
}

// Recently viewed management
function saveRecentlyViewed(partner) {
  let viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  viewed = [partner, ...viewed.filter(p => p.id !== partner.id)].slice(0, 5);
  localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
}

// Load partners
function loadPartners() {
  const container = document.getElementById('partners-container');
  if (!container) return;
  
  container.innerHTML = '<div class="col-12 text-center"><div class="loading-indicator"></div> Loading partners...</div>';
  
  setTimeout(() => pagination.filter(''), 800);
  
  // Setup search
  const searchInput = document.getElementById('partner-search');
  const searchButton = document.getElementById('search-button');
  
  if (searchInput && searchButton) {
    const performSearch = () => pagination.filter(searchInput.value.trim());
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', e => e.key === 'Enter' && performSearch());
  }
}

// Dashboard functions
function loadDashboard() {
  const userProfile = document.getElementById('user-profile');
  const userGreeting = document.getElementById('user-greeting');
  const currentUser = localStorage.getItem('currentUser');
  
  if (!userProfile || !userGreeting || !currentUser) {
    if (!currentUser) window.location.href = 'login.html';
    return;
  }

  const userData = JSON.parse(localStorage.getItem(currentUser) || '{}');
  if (!userData.avatar) {
    userProfile.innerHTML = '<p>Error loading profile. Please log in again.</p>';
    return;
  }

  // Load recently viewed
  const recentlyViewedContainer = document.getElementById('recently-viewed');
  if (recentlyViewedContainer) {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    recentlyViewedContainer.innerHTML = recentlyViewed.length === 0 ? 
      '<p class="text-muted">You haven\'t viewed any partners yet.</p>' :
      '<ul class="list-unstyled">' + 
      recentlyViewed.map(p => `<li class="mb-2">• ${p.avatar} ${p.name} (${p.teaches})</li>`).join('') + 
      '</ul>';
  }

  // Update profile display
  userGreeting.textContent = `👋 Welcome back, ${userData.avatar}`;
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

  // Setup buttons
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    alert('Logged out successfully!');
    window.location.href = 'login.html';
  });
  
  document.getElementById('find-matches-btn')?.addEventListener('click', () => {
    const matches = languagePartners.filter(p => 
      p.teaches === userData.learn && p.learns === userData.teach
    ).slice(0, 3);
    
    alert(matches.length > 0 ? 
      `Your best matches: ${matches.map(m => `${m.avatar} ${m.name}`).join(', ')}` :
      'No perfect matches found. Try browsing all partners!'
    );
  });
}

// Speech synthesis
window.speakText = function(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  } else {
    alert('Speech synthesis not supported in your browser');
  }
};

// Topic generation
window.generateTopic = function(level) {
  const topics = {
    beginner: ["Describe your morning routine", "What's your favorite season?", "Tell me about your best friend"],
    intermediate: ["How has social media changed communication?", "Describe a memorable travel experience", "What are your career goals?"],
    advanced: ["Should AI be regulated?", "Ethical implications of genetic engineering", "Balancing economic growth with environmental protection"]
  };
  
  const list = topics[level];
  const topic = list[Math.floor(Math.random() * list.length)];
  
  const display = document.getElementById('random-topic-display');
  const text = document.getElementById('topic-text');
  
  if (display && text) {
    display.classList.remove('d-none');
    text.textContent = topic;
  }
};