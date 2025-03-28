document.addEventListener("DOMContentLoaded", function () {
  /////////////////////////////
  // Load Fitness Challenges
  /////////////////////////////
  loadFitnessChallenges();
});

/////////////////////////////
// Load Fitness Challenges
/////////////////////////////
function loadFitnessChallenges() {
  const loadingScreen = document.getElementById("loading-screen");
  const challengesContainer = document.getElementById("challenges-container");
  const template = document.getElementById("challenge-card-template");

  // Ensure required elements exist
  if (!loadingScreen || !challengesContainer || !template) {
    console.error("Missing required elements for rendering challenges.");
    return;
  }

  toggleLoadingScreen(loadingScreen, true);

  // Check if the user is logged in
  const token = localStorage.getItem("token");
  if (token) {
    // User is logged in: Fetch logged-in user's name and then load challenges
    fetchLoggedInUser((loggedInUsername) => {
      fetchChallengesAndRenderCards(challengesContainer, template, loadingScreen, loggedInUsername);
    });
  } else {
    // User is not logged in: Load challenges without highlighting the creator
    fetchChallengesAndRenderCards(challengesContainer, template, loadingScreen, null);
  }
}

/////////////////////////////
// Fetch Challenges and Render Cards
/////////////////////////////
function fetchChallengesAndRenderCards(challengesContainer, template, loadingScreen, loggedInUsername) {
  // Callback to handle API response
  const handleResponse = function (status, data) {
    challengesContainer.innerHTML = ""; // Clear container

    if (status === 200 && Array.isArray(data) && data.length > 0) {
      data.forEach((challenge) => {
        // Fetch creator username and render the card
        fetchCreatorUsername(challenge.creator_id, (creatorUsername) => {
          // Clone and populate the template
          const card = createChallengeCard(template, challenge, creatorUsername, loggedInUsername);

          // Append the populated card to the container
          challengesContainer.appendChild(card);
        });
      });
    } else {
      // No data or error occurred
      challengesContainer.innerHTML =
        "<p class='text-center text-muted'>No challenges available at the moment.</p>";
    }

    // Hide loading screen
    toggleLoadingScreen(loadingScreen, false);
  };

  // Fetch challenges from API
  fetchMethod(`${currentUrl}/api/challenges`, handleResponse, "GET", null);
}

/////////////////////////////
// Fetch Logged-In User's Name
/////////////////////////////
function fetchLoggedInUser(callback) {
  const userId = getUserIdFromToken(); // Assume this extracts user_id from the token
  const token = localStorage.getItem("token");

  fetchMethod(`${currentUrl}/api/users/${userId}`, (status, data) => {
    if (status === 200) {
      callback(data.Username); // Pass the username to the callback
    } else {
      console.error("Failed to fetch logged-in user.");
      callback(null); // Pass null if unable to fetch
    }
  }, "GET", null, token);
}

/////////////////////////////
// Fetch Creator Username
/////////////////////////////
function fetchCreatorUsername(userId, callback) {
  const token = localStorage.getItem("token");

  fetchMethod(`${currentUrl}/api/users/${userId}`, (status, data) => {
    if (status === 200) {
      callback(data.Username); // Pass username to callback
    } else {
      console.error("Failed to fetch creator username.");
      callback("Unknown"); // Fallback if username can't be fetched
    }
  }, "GET", null, token);
}

/////////////////////////////
// Create Challenge Card
/////////////////////////////
function createChallengeCard(template, challenge, creatorUsername, loggedInUsername) {
  // Clone template content
  const clone = template.content.cloneNode(true);

  // Populate the card with challenge data
  const card = clone.querySelector(".card");
  const cardTitle = clone.querySelector(".card-title");
  const cardText = clone.querySelector(".card-text");
  const skillPointsBadge = clone.querySelector(".badge");
  const creatorInfo = clone.querySelector(".card-creator");
  const joinButton = clone.querySelector(".btn-complete");
  const attemptButton = clone.querySelector(".btn-attempt");
  const deleteIcon = card.querySelector(".bi-trash3");
  const editIcon = card.querySelector(".bi-pencil-square");

  // Apply content
  cardTitle.textContent = challenge.challenge;
  cardText.textContent = "Conquer this challenge and earn rewards!";
  skillPointsBadge.textContent = `Skill Points: ${challenge.skillpoints}`;

  // Highlight the creator's name if they are the logged-in user
  if (loggedInUsername && creatorUsername === loggedInUsername) {
    creatorInfo.innerHTML = `
      <span class="creator-badge you">
        Challenge created by: ${creatorUsername} (You)
      </span>`;

    // Show the delete and edit icons for challenges created by the logged-in user
    deleteIcon.style.display = "inline";
    editIcon.style.display = "inline";

    // Add event listener to the edit icon
    editIcon.addEventListener("click", function () {
      const modal = document.getElementById("editChallengeModal");
      modal.dataset.challengeId = challenge.challenge_id; // Pass the challenge ID to the modal
      modal.dataset.challengeName = challenge.challenge; // Pass the challenge name
      modal.dataset.skillPoints = challenge.skillpoints; // Pass the skill points
      openEditModal(challenge); // Open the edit modal with populated data
    });

    // Add event listener to the delete icon
    deleteIcon.addEventListener("click", function () {
      const modal = document.getElementById("deleteChallengeModal");
      modal.dataset.challengeId = challenge.challenge_id; // Pass the challenge ID to the modal
    });
  } else {
    creatorInfo.innerHTML = `
      <span class="creator-badge others">
        Challenge created by: ${creatorUsername}
      </span>`;

    // Hide the delete and edit icons for challenges not created by the logged-in user
    deleteIcon.style.display = "none";
    editIcon.style.display = "none";
  }

  // Set the challenge ID as a data attribute for other interactions
  card.dataset.challengeId = challenge.challenge_id;

  joinButton.textContent = "Completed?";
  attemptButton.textContent = "Attempted?";

  // Color coding based on skill points!!
  if (challenge.skillpoints >= 100) {
    card.classList.add("border-success", "bg-light");
    skillPointsBadge.classList.replace("bg-info", "bg-success");
  } else if (challenge.skillpoints >= 50) {
    card.classList.add("border-warning", "bg-light");
    skillPointsBadge.classList.replace("bg-info", "bg-warning");
  } else {
    card.classList.add("border-primary", "bg-light");
    skillPointsBadge.classList.replace("bg-info", "bg-primary");
  }

  // Attach event listener for "Completed?" button
  joinButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent scrolling or navigation
    openCompletionModal(challenge);
  });

  // Attach event listener for "Attempted?" button
  attemptButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent scrolling or navigation
    openAttemptModal(challenge);
  });

  return clone;
}

/////////////////////////////
// Open Edit Modal
/////////////////////////////
function openEditModal(challenge) {
  const modal = document.getElementById("editChallengeModal");
  const challengeNameInput = modal.querySelector("#editChallengeName");
  const skillPointsInput = modal.querySelector("#editSkillPoints");
  const saveButton = modal.querySelector("#confirmEditButton"); // Correct ID

  // Populate modal with current challenge details
  challengeNameInput.value = challenge.challenge;
  skillPointsInput.value = challenge.skillpoints;

  // Remove any existing event listeners on the save button to prevent duplication
  saveButton.replaceWith(saveButton.cloneNode(true));
  const newSaveButton = modal.querySelector("#confirmEditButton"); // Correct ID

  // Attach event listener for saving the edits
  newSaveButton.addEventListener("click", function () {
    // Call the existing updateChallenge function to handle the edit
    updateChallenge(challenge.challenge_id, challengeNameInput.value, skillPointsInput.value);
  });

  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.show();

  // Debugging to ensure modal instance is initialized
  console.log("Modal Instance Initialized:", bootstrapModal);
}

/////////////////////////////
// Toggle Loading Screen
/////////////////////////////
function toggleLoadingScreen(loadingScreen, show) {
  if (show) {
    loadingScreen.classList.remove("d-none");
  } else {
    loadingScreen.classList.add("d-none");
  }
}

/////////////////////////////
// Open Completion Modal
/////////////////////////////
function openCompletionModal(challenge) {
  // Select modal elements
  const modal = document.getElementById("completionModal");
  const challengeDetails = document.getElementById("challengeDetails");
  const notesInput = document.getElementById("completionNotes");
  const completeButton = document.getElementById("completeChallengeButton");

  // Populate modal with challenge details
  challengeDetails.textContent = `Complete the challenge: \"${challenge.challenge}\" to earn ${challenge.skillpoints} skill points!`;

  // Clear any previous notes
  notesInput.value = "";

  // Remove previous click event listener to avoid duplication
  completeButton.replaceWith(completeButton.cloneNode(true));
  const newCompleteButton = document.getElementById("completeChallengeButton");

  // Attach a new event listener for the "Complete Now" button
  newCompleteButton.addEventListener("click", function () {
    handleChallengeCompletion(challenge, notesInput.value);
  });

  // Show the modal
  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.show();
}

/////////////////////////////
// Open Attempt Modal
/////////////////////////////
function openAttemptModal(challenge) {
  // Select modal elements
  const modal = document.getElementById("attemptModal");
  const attemptDetails = document.getElementById("attemptDetails");
  const notesInput = document.getElementById("attemptNotes");
  const attemptButton = document.getElementById("attemptChallengeButton");

  // Populate modal with challenge details
  attemptDetails.textContent = `Attempt the challenge: \"${challenge.challenge}\". Skill points will be awarded for effort!`;

  // Clear any previous notes
  notesInput.value = "";

  // Remove previous click event listener to avoid duplication
  attemptButton.replaceWith(attemptButton.cloneNode(true));
  const newAttemptButton = document.getElementById("attemptChallengeButton");

  // Attach a new event listener for the "Attempt Now" button
  newAttemptButton.addEventListener("click", function () {
    handleChallengeAttempt(challenge, notesInput.value);
  });

  // Show the modal
  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.show();
}

document.addEventListener("DOMContentLoaded", function () {
  const modals = document.querySelectorAll(".modal");

  modals.forEach((modal) => {
    modal.addEventListener("hidden.bs.modal", function () {
      // Reset body styles
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    });
  });
});