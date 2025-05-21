// Inject reusable HTML

// This function handles loading external HTML into a specific container on the page
// Params: targetID: Element ID (e.g. navbar-container), filePath: relative path to HTML file (e.g. components/navbar.html)
const injectHTML = (targetId, filePath) => {
    // Use fetch API to load external HTML file
    fetch(filePath)
        // Convert response to plaintext
        .then(response => response.text())
        // Insert HTML into target element by ID
        .then(data => {
            document.getElementById(targetId).innerHTML = data;
        })
        // If there's an error, log to console
        .catch(error => console.error(`Error loading ${filePath}:`, error));
};

// Inject navbar into div id navbar-container
injectHTML("navbar-container", "components/navbar.html");

// Inject footer into div id footer-container
injectHTML("footer-container", "components/footer.html");

document.addEventListener("DOMContentLoaded", () => {
  // DOM is fully loaded, safe to initialize AOS
  if (typeof AOS !== "undefined") {
    AOS.init();
  }});

// Handle profile form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profile-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const avatar = document.getElementById("avatar").value;
      const teach = document.getElementById("teach").value;
      const learn = document.getElementById("learn").value;
      const bio = document.getElementById("bio").value;
      const email = prompt("Enter your email (for login):");
      const password = prompt("Create a password:");

      const user = { avatar, teach, learn, bio, password };
      localStorage.setItem(email, JSON.stringify(user));

      alert("Profile saved! You can now log in.");
      window.location.href = "login.html";
    });
  }
});
