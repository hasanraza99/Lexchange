// Authentication and user management functions

// Basic email validation
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  
  // Form validation 
  function validateForm(form, fields) {
    let isValid = true;
    
    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (!field) return;
      
      if (!field.value.trim()) {
        field.classList.add('is-invalid');
        isValid = false;
      } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
      }
      
      if (fieldId === 'email' && field.value) {
        if (!isValidEmail(field.value)) {
          field.classList.add('is-invalid');
          isValid = false;
        }
      }
    });
    
    return isValid;
  }
  
  // Handle login functionality
  function setupLoginForm() {
    const loginForm = document.getElementById("login-form");
    if (!loginForm) return;
    
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      
      if (!email || !isValidEmail(email)) {
        alert("Please enter a valid email address");
        return;
      }
      
      const userData = localStorage.getItem(email);
      
      if (userData) {
        const user = JSON.parse(userData);
        if (user.password === password) {
          localStorage.setItem('currentUser', email);
          alert("Login successful!");
          window.location.href = "dashboard.html";
        } else {
          alert("Incorrect password!");
        }
      } else {
        alert("User not found. Please check your email or create an account.");
      }
    });
  }
  
  // Handle profile form submission
  function setupProfileForm() {
    const profileForm = document.getElementById("profile-form");
    if (!profileForm) return;
    
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const requiredFields = ['email', 'password', 'avatar', 'teach', 'learn', 'bio'];
      if (!validateForm(profileForm, requiredFields)) {
        alert("Please fill in all required fields correctly");
        return;
      }
      
      const email = document.getElementById("email").value;
      const avatar = document.getElementById("avatar").value;
      const teach = document.getElementById("teach").value;
      const learn = document.getElementById("learn").value;
      const bio = document.getElementById("bio").value;
      const password = document.getElementById("password").value;
      
      const user = { avatar, teach, learn, bio, password };
      localStorage.setItem(email, JSON.stringify(user));
      
      alert("Profile saved! You can now log in.");
      window.location.href = "login.html";
    });
  }