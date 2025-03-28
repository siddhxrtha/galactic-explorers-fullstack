document.addEventListener("DOMContentLoaded", function () {
  loadChallenges();
});

/////////////////////////////
// Load Challenges
/////////////////////////////
function loadChallenges() {
  const challengesList = document.getElementById("challengesList");

  fetchMethod("/api/challenges", (status, data) => {
    if (status === 200 && Array.isArray(data) && data.length > 0) {
      challengesList.innerHTML = ""; // Clear the list
      data.forEach((challenge) => {
        // Create a challenge list item
        const listItem = document.createElement("button");
        listItem.className = "list-group-item list-group-item-action";
        listItem.textContent = `${challenge.challenge} (Skill Points: ${challenge.skillpoints})`;
        listItem.dataset.challengeId = challenge.challenge_id;

        // Attach click listener to load participants
        listItem.addEventListener("click", () => {
          loadCompletionRecords(challenge.challenge_id, challenge.challenge);
        });

        challengesList.appendChild(listItem);
      });
    } else {
      challengesList.innerHTML = `<p class="text-muted text-center">No challenges found.</p>`;
    }
  });
}

/////////////////////////////
// Load Completion Records
/////////////////////////////
function loadCompletionRecords(challengeId, challengeName) {
  const selectedChallengeTitle = document.getElementById("selectedChallengeTitle");
  const completionRecords = document.getElementById("completionRecords");

  // Update the selected challenge title
  selectedChallengeTitle.textContent = `Completion Records for: ${challengeName}`;

  fetchMethod(`/api/challenges/${challengeId}`, (status, data) => {
    if (status === 200 && Array.isArray(data) && data.length > 0) {
      completionRecords.innerHTML = ""; // Clear previous records

      // For each record, fetch username synchronously
      data.forEach((record) => {
        getUsername(record.user_id, (username) => {
          // Add a row for each record after fetching the username
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${username}</td>
            <td>${record.completed ? "Yes 🎉" : "No 😅"}</td>
            <td>${new Date(record.creation_date).toLocaleDateString()}</td>
            <td>${record.notes}</td>
          `;
          completionRecords.appendChild(row);
        });
      });
    } else {
      completionRecords.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No attempts found. Try it now! 💪</td></tr>`;
    }
  });
}

/////////////////////////////
// Get Username by User ID
/////////////////////////////
function getUsername(userId, callback) {
  fetchMethod(`/api/users/${userId}`, (status, data) => {
    if (status === 200 && data.Username) {
      callback(data.Username); // Execute callback with the username
    } else {
      callback("Unknown User"); // Fallback if unable to fetch
    }
  });
}
