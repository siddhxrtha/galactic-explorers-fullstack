document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("loginButton");
  const registerButton = document.getElementById("registerButton");
  const profileButton = document.getElementById("profileButton");
  const logoutButton = document.getElementById("logoutButton");
  const skillpointsPill = document.getElementById("skillpointsPill");
  const skillpointsDisplay = document.getElementById("skillpointsDisplay");

  // Check if token exists in local storage
  const token = localStorage.getItem("token");
  if (token) {
    // Token exists, show profile and logout buttons
    loginButton.classList.add("d-none");
    registerButton.classList.add("d-none");
    profileButton.classList.remove("d-none");
    logoutButton.classList.remove("d-none");

    // Fetch user details to get skill points
    const userId = getUserIdFromToken();
    const userDetailsUrl = `${currentUrl}/api/users/${userId}`;

    fetchMethod(userDetailsUrl, (status, data) => {
      if (status === 200) {
        skillpointsDisplay.textContent = `Skillpoints: ${data["Skillpoints"]}`;
        skillpointsPill.classList.remove("d-none");
      } else {
        console.error("Failed to fetch user details:", data.message || data);
      }
    }, "GET", null, token);
  } else {
    // Token does not exist, show login and register buttons
    loginButton.classList.remove("d-none");
    registerButton.classList.remove("d-none");
    profileButton.classList.add("d-none");
    logoutButton.classList.add("d-none");
    skillpointsPill.classList.add("d-none"); // Hide skill points pill
  }

  // Logout logic
  logoutButton.addEventListener("click", function () {
    // Remove the token from local storage and redirect to the home page
    localStorage.removeItem("token");
    window.location.href = "home.html";
  });
});
