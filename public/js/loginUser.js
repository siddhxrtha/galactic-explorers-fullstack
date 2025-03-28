document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  // Callback function to handle the login response
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
    
    if (responseStatus === 200) {
      createSuccessToast("Login successful! Redirecting...");
      // Store the token and refresh token in localStorage
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("refresh", responseData.refresh);

      // Redirect to the profile page
      setTimeout(() => {
        window.location.href = "home.html";
      }, 2000);
    } else if (responseStatus === 401) {
      createErrorToast("Invalid username or password. Please try again.");
    } else {
      createErrorToast(responseData.message || "An error occurred. Please try again.");
    }
  };

  // Form submission handler
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collecting form inputs
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate input
    if (!username || !password) {
      createErrorToast("Both username and password are required.");
      return;
    }

    // Preparing data for API request
    const data = { username, password };

    // Call the login API using fetchMethod
    fetchMethod(currentUrl + "/api/login", callback, "POST", data);

    loginForm.reset();
  });
});
