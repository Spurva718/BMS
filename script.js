const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const form = document.getElementById("loginForm");

// Regex patterns
const phonePattern = /^[0-9]{10}$/;   // 10-digit phone
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // basic email

// Function to check inputs
function checkInputs() {
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  let emailValid = emailPattern.test(emailValue) || phonePattern.test(emailValue);
  let passwordValid = passwordValue.length >= 6;

  // Show errors
  emailError.textContent = (!emailValid && emailValue !== "") 
    ? "Enter valid email or 10-digit phone number." : "";

  passwordError.textContent = (!passwordValid && passwordValue !== "") 
    ? "Password must be at least 6 characters." : "";

  loginBtn.disabled = !(emailValid && passwordValid);
}

// Function to handle form submission
function handleLogin(e) {
  e.preventDefault(); // prevent page refresh

  if (loginBtn.disabled) {
    alert("Please enter valid details.");
    return;
  }

  // Log values (can later be sent to API)
  console.log("User Email/Phone:", email.value);
  console.log("User Password:", password.value);

  alert("Login Successful!");
}

// Event listeners
email.addEventListener("keyup", checkInputs);
password.addEventListener("keyup", checkInputs);
form.addEventListener("submit", handleLogin);
