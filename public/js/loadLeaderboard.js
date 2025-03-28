document.addEventListener("DOMContentLoaded", function () {
  loadLeaderboard(); // Load the leaderboard when the DOM is ready
});

//////////// Load Leaderboard ////////////
function loadLeaderboard() {
  const leaderboardUrl = `${currentUrl}/api/users/leaderboard`; // API endpoint
  const leaderboardTable = document.getElementById("leaderboard-body"); // Table body for leaderboard
  const loadingMessage = document.getElementById("loading-leaderboard"); // Loading message
  const userId = getUserIdFromToken(); // Function to retrieve the logged-in user's ID

  // Show loading message if it exists
  if (loadingMessage) loadingMessage.style.display = "block";

  fetchMethod(leaderboardUrl, (status, data) => {
    // Hide loading message
    if (loadingMessage) loadingMessage.style.display = "none";

    if (status === 200) {
      leaderboardTable.innerHTML = ""; // Clear existing rows

      if (data.length === 0) {
        // No data message
        leaderboardTable.innerHTML = `
          <tr>
            <td colspan="3" class="text-center text-muted">No explorers have been ranked yet!</td>
          </tr>
        `;
        return;
      }

      // Populating leaderboard rows
      data.forEach((user, index) => {
        const isCurrentUser = user["User ID"] === userId;
        const row = `
          <tr class="${isCurrentUser ? "table-success" : ""}">
            <td class="text-center">${index + 1}</td>
            <td>${user["Username"]}</td>
            <td class="text-center">${user["Planets Explored"]}</td>
          </tr>
        `;
        leaderboardTable.innerHTML += row;
      });
    } else {
      // Error handling
      console.error("Failed to load leaderboard:", data.message || data);
      createErrorToast("Failed to load leaderboard. Please try again later.");

      leaderboardTable.innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-danger">Error loading leaderboard.</td>
        </tr>
      `;
    }
  });
}
