// Authentication flow management
const pageAccess = {
    protected: ['dashboard.html', 'browse.html'],
    guestOnly: ['login.html']
};

// Check and update page access
function initAuthFlow() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isLoggedIn = localStorage.getItem('currentUser') !== null;
    
    // Redirect if needed
    if (pageAccess.protected.includes(currentPage) && !isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    if (pageAccess.guestOnly.includes(currentPage) && isLoggedIn) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Update navigation after a delay
    setTimeout(() => {
        const loginLink = document.querySelector('a[href="login.html"]')?.parentElement;
        const dashboardLink = document.querySelector('a[href="dashboard.html"]')?.parentElement;
        const editProfileLink = document.querySelector('.dropdown-item[href="profile.html"]');
        
        if (!isLoggedIn) {
            if (dashboardLink) dashboardLink.style.display = 'none';
            if (editProfileLink) editProfileLink.textContent = 'Create Profile';
        } else {
            if (loginLink) loginLink.style.display = 'none';
            if (editProfileLink) editProfileLink.textContent = 'Edit Profile';
        }
        
        // Update home page CTAs
        if (currentPage === 'index.html') {
            const primaryCTA = document.querySelector('a[href="profile.html"].btn-light');
            if (primaryCTA && isLoggedIn) {
                primaryCTA.href = 'browse.html';
                primaryCTA.textContent = 'Find Partners';
            }
        }
    }, 500);
}

document.addEventListener('DOMContentLoaded', initAuthFlow);