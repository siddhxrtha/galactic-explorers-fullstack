//////////// Handle Token Refresh on Expiry ////////////
function checkStatusForRefresh(status) {
  const loadingScreen = document.getElementById("loading-screen");
  //////////// Check if Unauthorized (401) ////////////
  if (status === 401) {
    const refreshToken = localStorage.getItem("refresh");

  //////////// Callback for Refresh API Response ////////////
    const callback = (status, data) => {
      // Hide loading screen
      loadingScreen.classList.remove("d-block");
      loadingScreen.classList.add("d-none");

      if (status === 200) {
        // Update tokens and reload
        localStorage.setItem("token", data.token);
        localStorage.setItem("refresh", data.refresh);
        alert("Your session has been refreshed. Please continue.");
        location.reload();
      } else {
        // Clears tokens and redirects to login
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        alert("Session expired. Please log in again.");
        window.location.href = "login.html";
      }
    };

    const data = {
      refreshToken: refreshToken,
    };

    // Show loading screen
    loadingScreen.classList.remove("d-none");
    loadingScreen.classList.add("d-block");

    // Notify user about token refresh
    alert("Your session is being refreshed. Please wait...Click OK to continue.");

    //////////// Call API to Refresh Token ////////////
    fetchMethod(`${currentUrl}/api/refresh`, callback, "POST", data);
  }
}
