document.addEventListener("DOMContentLoaded", function() {
    const registrationForm = document.getElementById("registrationForm");
    if (registrationForm) {
      registrationForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        
        // Perform validation
        if (username === "" || email === "" || password === "") {
          alert("All fields are required!");
          return;
        }
        // Submit the form if validation passes
        this.submit();
      });
    }
  
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        
        // Perform validation
        if (email === "" || password === "") {
          alert("Email and password are required!");
          return;
        }
  
        // Submit the form if validation passes
        this.submit();
      });
    }
  });
  