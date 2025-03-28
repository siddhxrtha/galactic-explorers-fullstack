document.addEventListener("DOMContentLoaded", function () {
  const userId = getUserIdFromToken(); 
  const url = `${currentUrl}/api/users/${userId}`;

  const loadingFields = ["userId", "username", "email", "skillpoints", "guildName"];

  // Reset all fields to "Loading..." during fetch
  loadingFields.forEach((field) => {
    document.getElementById(field).textContent = "Loading...";
  });

  // Fetch user details
  fetchMethod(url, (status, data) => {
    if (status === 200) {
      document.getElementById("userId").textContent = data["User ID"];
      document.getElementById("username").textContent = data.Username;
      document.getElementById("email").textContent = data.Email; // Display email
      document.getElementById("skillpoints").textContent = data.Skillpoints;
      document.getElementById("guildName").textContent = data["User's Guild"];
    } else {
      console.error("Failed to fetch user details:", data.message);
      loadingFields.forEach((field) => {
        document.getElementById(field).textContent = "Error fetching data";
      });
    }
  });
});
