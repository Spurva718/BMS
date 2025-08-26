const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const form = document.getElementById("loginForm");
const togglePassword = document.getElementById("togglePassword");

// Regex patterns
const phonePattern = /^[0-9]{10}$/;   // 10-digit phone
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple email

// Function to check inputs
function checkInputs() {
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  let emailValid = emailPattern.test(emailValue) || phonePattern.test(emailValue);
  let passwordValid = passwordValue.length >= 8;

  // Show errors
  emailError.textContent = (!emailValid && emailValue !== "") 
    ? "Enter valid email or 10-digit phone number." : "";

  passwordError.textContent = (!passwordValid && passwordValue !== "") 
    ? "Password must be at least 8 characters." : "";

  // Enable/disable button
  loginBtn.disabled = !(emailValid && passwordValid);
}

// Handle form submission
function handleLogin(e) {
  e.preventDefault();

  if (loginBtn.disabled) {
    alert("Please enter valid details.");
    return;
  }

  // Log values
  console.log("User Email/Phone:", email.value);
  console.log("User Password:", password.value);

  alert("Login Successful!");
}

// Toggle password visibility
togglePassword.addEventListener("click", () => {
  const type = password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);

  // Change icon
  togglePassword.classList.toggle("bi-eye");
  togglePassword.classList.toggle("bi-eye-slash");
});

// Event listeners
email.addEventListener("keyup", checkInputs);
password.addEventListener("keyup", checkInputs);
form.addEventListener("submit", handleLogin);
