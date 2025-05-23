// Authentication and user management functions - Enhanced version

// ============ VALIDATION HELPERS ============

// Basic email validation
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Password strength checker
function checkPasswordStrength(password) {
    if (password.length < 6) return { valid: false, message: "Password must be at least 6 characters" };
    if (password.length < 8) return { valid: true, message: "Weak password" };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return { valid: true, message: "Strong password" };
    return { valid: true, message: "Medium password" };
}

// ============ FORM VALIDATION ============

// Validate a single form field with enhanced feedback
function validateSingleField(field) {
    // Skip if field has no id
    if (!field.id) return true;
    
    // Remove previous validation
    field.classList.remove('is-invalid', 'is-valid');
    
    // Get or create feedback element
    let feedback = field.nextElementSibling;
    if (!feedback || !feedback.classList.contains('invalid-feedback')) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        field.parentNode.insertBefore(feedback, field.nextSibling);
    }
    
    // Check if empty
    if (!field.value.trim()) {
        field.classList.add('is-invalid');
        feedback.textContent = `Please enter your ${field.id.replace('-', ' ')}`;
        return false;
    }
    
    // Special validation for email
    if (field.id === 'email' && !isValidEmail(field.value)) {
        field.classList.add('is-invalid');
        feedback.textContent = 'Please enter a valid email address';
        return false;
    }
    
    // Special validation for password
    if (field.id === 'password' && field.form.id === 'profile-form') {
        const strength = checkPasswordStrength(field.value);
        if (!strength.valid) {
            field.classList.add('is-invalid');
            feedback.textContent = strength.message;
            return false;
        }
    }
    
    // Special validation for password confirmation
    if (field.id === 'password-confirm') {
        const password = document.getElementById('password');
        if (password && field.value !== password.value) {
            field.classList.add('is-invalid');
            feedback.textContent = 'Passwords do not match';
            return false;
        }
    }
    
    // Field is valid
    field.classList.add('is-valid');
    return true;
}

// Validate entire form
function validateForm(form, fields) {
    let isValid = true;
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !validateSingleField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// ============ LOGIN FUNCTIONALITY ============

// Handle login functionality with improved UX
function setupLoginForm() {
    const loginForm = document.getElementById("login-form");
    if (!loginForm) return;
    
    // Add loading state management
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.textContent || 'Login';
    
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Show loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Logging in...';
        }
        
        // Simulate async operation for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        // Validate fields
        if (!validateForm(loginForm, ['email', 'password'])) {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
            return;
        }
        
        const userData = localStorage.getItem(email);
        
        if (userData) {
            const user = JSON.parse(userData);
            if (user.password === password) {
                localStorage.setItem('currentUser', email);
                
                // Show success message before redirect
                showAlert('success', 'Login successful! Redirecting...');
                
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);
            } else {
                showAlert('danger', 'Incorrect password. Please try again.');
                document.getElementById("password").classList.add('is-invalid');
            }
        } else {
            showAlert('warning', 'No account found with this email. Please sign up first.');
        }
        
        // Reset button state
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// ============ PROFILE FUNCTIONALITY ============

// Handle profile form submission with enhanced validation
function setupProfileForm() {
    const profileForm = document.getElementById("profile-form");
    if (!profileForm) return;
    
    // Add loading state management
    const submitButton = profileForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.textContent || 'Save Profile';
    
    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const requiredFields = ['email', 'password', 'avatar', 'teach', 'learn', 'bio'];
        if (!validateForm(profileForm, requiredFields)) {
            showAlert('danger', 'Please fill in all required fields correctly');
            return;
        }
        
        // Check password confirmation
        const password = document.getElementById("password").value;
        const passwordConfirm = document.getElementById("password-confirm").value;
        
        if (password !== passwordConfirm) {
            document.getElementById("password-confirm").classList.add('is-invalid');
            showAlert('danger', 'Passwords do not match');
            return;
        }
        
        // Show loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
        }
        
        // Simulate async save
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Collect form data
        const email = document.getElementById("email").value;
        const userData = {
            avatar: document.getElementById("avatar").value,
            teach: document.getElementById("teach").value,
            learn: document.getElementById("learn").value,
            bio: document.getElementById("bio").value,
            password: password,
            createdAt: new Date().toISOString()
        };
        
        // Check if teach and learn are the same
        if (userData.teach === userData.learn) {
            showAlert('warning', 'You cannot teach and learn the same language. Please choose different languages.');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
            return;
        }
        
        // Save user data
        localStorage.setItem(email, JSON.stringify(userData));
        
        // Show success message
        showAlert('success', 'Profile created successfully! Redirecting to login...');
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    });
}

// ============ REAL-TIME VALIDATION ============

// Add real-time validation to forms
function setupRealTimeValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', function() {
            validateSingleField(this);
        });
        
        // Clear validation on input
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
            }
        });
    });
}

// ============ ALERT SYSTEM ============

// Show Bootstrap alert messages
function showAlert(type, message) {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert-dismissible');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alert.style.zIndex = '9999';
    alert.style.minWidth = '300px';
    
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 150);
    }, 5000);
}

// ============ AUTH STATE MANAGEMENT ============

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Get current user data
function getCurrentUserData() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return null;
    
    const userData = localStorage.getItem(currentUser);
    return userData ? JSON.parse(userData) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    showAlert('success', 'Logged out successfully');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Make logout function globally available
window.logout = logout;