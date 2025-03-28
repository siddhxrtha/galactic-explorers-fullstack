/////////////////////////////
// Load Guilds Leaderboard
/////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  fetchUserGuild((userGuild) => {
    loadGuildLeaderboard(userGuild);
  });
});

/////////////////////////////
// Fetch User's Current Guild
/////////////////////////////
function fetchUserGuild(callback) {
  const url = `${currentUrl}/api/users/${getUserIdFromToken()}`; // API to fetch user's details

  fetchMethod(
    url,
    function (status, data) {
      if (status === 200) {
        const userGuild = data["User's Guild"] || null; // Extract user's guild or null
        callback(userGuild); // Pass user guild to callback
      } else {
        console.error("Failed to fetch user details. Proceeding without user guild.");
        callback(null); // Proceed with null if user guild cannot be fetched
      }
    },
    "GET"
  );
}

function loadGuildLeaderboard(userGuild) {
  const leaderboardContainer = document.getElementById("leaderboard-container");

  if (!leaderboardContainer) {
    console.error("Leaderboard container element is missing.");
    return;
  }

  // Show loading state
  leaderboardContainer.innerHTML = `
    <tr>
      <td colspan="4" class="text-center">
        <div class="spinner-border text-warning" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </td>
    </tr>
  `;

  fetchMethod(`${currentUrl}/api/guilds/leaderboard`, (status, data) => {
    if (status === 200 && Array.isArray(data) && data.length > 0) {
      leaderboardContainer.innerHTML = ""; 

      data.forEach((guild, index) => {
        const rankEmoji = getRankEmoji(index + 1);
        const isUserGuild = userGuild === guild.guild_name; // Checks if it's the logged-in user's guild

        const rowClass = isUserGuild ? "table-success fw-bold text-dark" : ""; // Highlight user’s guild
        const creatorClass = isUserGuild ? "text-success fw-bold" : "text-info"; // Highlight creator only if user is in the guild

        const row = `
          <tr class="${rowClass}">
            <td><strong>${rankEmoji} #${index + 1}</strong></td>
            <td class="fw-bold">${guild.guild_name}</td>
            <td class="text-warning fw-bold">${guild.total_planets_explored} 🌍</td>
            <td class="${creatorClass}"><i class="bi bi-person-fill"></i> ${guild.creator_name || "Unknown"}</td>
          </tr>
        `;

        leaderboardContainer.innerHTML += row;
      });
    } else {
      leaderboardContainer.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-muted">No leaderboard data available yet.</td>
        </tr>
      `;
    }
  }, "GET");
}


/////////////////////////////
// Get Rank Emoji 🏆🥈🥉
/////////////////////////////
function getRankEmoji(rank) {
  switch (rank) {
    case 1: return "🏆";
    case 2: return "🥈";
    case 3: return "🥉";
    default: return "🎖️";
  }
}
