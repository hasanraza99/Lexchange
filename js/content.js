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
    // Other partners data...
  ];
  
  // Load language partners
  function loadPartners() {
    const container = document.getElementById('partners-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    languagePartners.forEach(partner => {
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
      
      container.appendChild(partnerCard);
    });
    
    document.querySelectorAll('.connect-btn').forEach(button => {
      button.addEventListener('click', function() {
        const partnerId = this.getAttribute('data-id');
        alert(`Connection requested with partner #${partnerId}`);
      });
    });
  }
  
  // Load dashboard user data
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
    
    userGreeting.textContent = `👋 Welcome back, ${userData.avatar}`;
    
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
    
    document.getElementById('logout-btn').addEventListener('click', function() {
      localStorage.removeItem('currentUser');
      alert('Logged out successfully!');
      window.location.href = 'login.html';
    });
  }