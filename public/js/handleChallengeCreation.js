document.addEventListener("DOMContentLoaded", function () {
  //////////////////////////////
  // Event Listener for Form Submission
  //////////////////////////////
  const createChallengeForm = document.getElementById("create-challenge-form");

  // Ensure the form exists before adding an event listener
  if (!createChallengeForm) {
    console.error("Create challenge form not found.");
    return;
  }

  // Add form submission event listener
  createChallengeForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload

    // Extract form data
    const challengeName = document.getElementById("challengeName").value.trim();
    const skillPoints = parseInt(document.getElementById("skillPoints").value.trim(), 10);

    // Validate input
    if (!challengeName || isNaN(skillPoints)) {
      createErrorToast("Please provide a valid challenge name and skill points.");
      return;
    }

    if (skillPoints < 0 || skillPoints > 150) {
      createErrorToast("Skill points must be between 0 and 150.");
      return;
    }

    // Call the function to handle challenge creation
    handleChallengeCreation(challengeName, skillPoints);
  });
});

//////////////////////////////
// Handle Challenge Creation
//////////////////////////////
function handleChallengeCreation(challengeName, skillPoints) {
  // Get the user's token
  const token = localStorage.getItem("token");

  // Redirect if the user is not logged in
  if (!token) {
    createErrorToast("You must be logged in to create a challenge.");
    return;
  }

  // Extract user_id from token (assumes a function getUserIdFromToken exists)
  const user_id = getUserIdFromToken();

  // Redirect if the user ID is not found
  if (!user_id) {
    createErrorToast("Unable to identify user. Please log in again.");
    return;
  }

  // Prepare data for the API request
  const challengeData = {
    challenge: challengeName,
    user_id: user_id,
    skillpoints: skillPoints,
  };

  //////////////////////////////
  // Callback to Handle API Response
  //////////////////////////////
  const handleResponse = function (status, data) {
    if (status === 201) {
      createSuccessToast("Challenge created successfully! 🎉");

      // Clear the form
      document.getElementById("create-challenge-form").reset();

      // Reload the challenges
      loadFitnessChallenges();
      loadChallenges();
    } else if (status === 401) {
      // Call checkStatusForRefresh if token has expired
      checkStatusForRefresh(status);
    } else {
      createErrorToast(data.message || "Failed to create the challenge. Please try again.");
    }
  };

  //////////////////////////////
  // Make API Request
  //////////////////////////////
  fetchMethod(
    `${currentUrl}/api/challenges`, // API endpoint
    handleResponse,                // Callback function
    "POST",                        // HTTP method
    challengeData,                 // Payload data
    token                          // Authorization token
  );
}
