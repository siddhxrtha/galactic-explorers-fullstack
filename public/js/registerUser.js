document.addEventListener("DOMContentLoaded", function () {
  /// ========================================
  /// Callback Function
  /// ========================================
  const callback = (responseStatus, responseData) => {
    if (responseStatus === 200) {
      createSuccessToast("Account created successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "login.html"; // Redirect to login page
      }, 2000);
    } else if (responseStatus === 409) {
      const errorMessage = responseData.message || "Email or Username already exists.";
      showErrorCard(errorMessage);
    } else {
      createErrorToast(responseData.message || "An unknown error occurred.");
    }
  };

  /// ========================================
  /// Form Submission Handler
  /// ========================================
  const signupForm = document.getElementById("signup-form");
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form values
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      createErrorToast("All fields are required.");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      createErrorToast("Passwords do not match.");
      return;
    }

    // Payload
    const data = { username, email, password };

    // Submit data to the backend
    axiosMethod(currentUrl + "/api/register", callback, "POST", data);

    // Reset form fields after submission
    signupForm.reset();
    resetPasswordRequirements(); // Reset checklist and strength bar
  });

  /// ========================================
  /// Reset Password Requirements Checklist
  /// ========================================
  function resetPasswordRequirements() {
    const requirements = document.querySelectorAll("#password-requirements .requirement");
    const strengthBar = document.getElementById("password-strength-bar");
    const strengthText = document.getElementById("password-strength-text");

    requirements.forEach((item) => {
      item.setAttribute("data-fulfilled", "false");
      const icon = item.querySelector("i");
      icon.className = "bi bi-x-circle-fill text-danger me-2";
    });

    strengthBar.style.width = "0%";
    strengthBar.className = "progress-bar bg-danger";
    strengthText.textContent = "Very Weak";
  }

  /// ========================================
  /// Display Error Messages in the Card
  /// ========================================
  function showErrorCard(message) {
    const errorCard = document.getElementById("error-card");
    const errorMessage = document.getElementById("error-message");

    errorCard.style.display = "block";
    errorMessage.textContent = message;

    setTimeout(() => {
      errorCard.style.display = "none";
    }, 5000); 
  }
});
