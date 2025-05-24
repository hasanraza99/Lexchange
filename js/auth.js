// Authentication and user management

// Validation helpers
const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function validateField(field) {
    const value = field.value.trim();
    let isValid = !!value;
    
    if (field.type === 'email') isValid = value && isValidEmail(value);
    if (field.id === 'password-confirm') {
        const password = document.getElementById('password');
        isValid = password && field.value === password.value;
    }
    
    field.classList.toggle('is-invalid', !isValid);
    field.classList.toggle('is-valid', isValid);
    
    return isValid;
}

// Setup forms
function setupForm(formId, handler) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    // Real-time validation
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => input.classList.remove('is-invalid'));
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent || 'Submit';
        
        // Validate all fields
        const fields = form.querySelectorAll('[required]');
        let isValid = true;
        fields.forEach(field => {
            if (!validateField(field)) isValid = false;
        });
        
        if (!isValid) {
            showAlert('danger', 'Please fill in all required fields correctly');
            return;
        }
        
        // Show loading
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
        }
        
        // Process form
        await new Promise(resolve => setTimeout(resolve, 500));
        const result = await handler(form);
        
        // Reset button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
        
        if (result) {
            showAlert(result.type, result.message);
            if (result.redirect) {
                setTimeout(() => window.location.href = result.redirect, 1500);
            }
        }
    });
}

// Login handler
async function handleLogin(form) {
    const email = form.email.value;
    const password = form.password.value;
    const userData = localStorage.getItem(email);
    
    if (!userData) {
        return { type: 'warning', message: 'No account found. Please sign up first.' };
    }
    
    const user = JSON.parse(userData);
    if (user.password !== password) {
        form.password.classList.add('is-invalid');
        return { type: 'danger', message: 'Incorrect password.' };
    }
    
    localStorage.setItem('currentUser', email);
    return { type: 'success', message: 'Login successful!', redirect: 'dashboard.html' };
}

// Profile handler  
async function handleProfile(form) {
    const email = form.email.value;
    const password = form.password.value;
    const passwordConfirm = form['password-confirm'].value;
    
    if (password !== passwordConfirm) {
        form['password-confirm'].classList.add('is-invalid');
        return { type: 'danger', message: 'Passwords do not match' };
    }
    
    const userData = {
        avatar: form.avatar.value,
        teach: form.teach.value,
        learn: form.learn.value,
        bio: form.bio.value,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    if (userData.teach === userData.learn) {
        return { type: 'warning', message: 'You cannot teach and learn the same language.' };
    }
    
    localStorage.setItem(email, JSON.stringify(userData));
    return { type: 'success', message: 'Profile created!', redirect: 'login.html' };
}

// Alert system
function showAlert(type, message) {
    const existingAlert = document.querySelector('.alert-dismissible');
    existingAlert?.remove();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alert.style.cssText = 'z-index: 9999; min-width: 300px;';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 150);
    }, 5000);
}

// Initialize forms
function setupLoginForm() {
    setupForm('login-form', handleLogin);
}

function setupProfileForm() {
    setupForm('profile-form', handleProfile);
}

// Logout function
window.logout = function() {
    localStorage.removeItem('currentUser');
    showAlert('success', 'Logged out successfully');
    setTimeout(() => window.location.href = 'index.html', 1000);
};