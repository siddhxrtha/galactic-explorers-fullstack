document.addEventListener("DOMContentLoaded", function () {
  /////////////////////////////
  // Event Listeners for Buttons
  /////////////////////////////

  // Attach event listener for "Complete Now" button
  const completeButton = document.getElementById("completeChallengeButton");
  completeButton.addEventListener("click", function () {
    const notesInput = document.getElementById("completionNotes").value;
    const modal = document.getElementById("completionModal");

    // Extract challenge details from modal
    const challenge = {
      challenge_id: modal.getAttribute("data-challenge-id"),
    };

    handleChallengeCompletion(challenge, notesInput);
  });

  // Attach event listener for "Attempt Now" button
  const attemptButton = document.getElementById("attemptChallengeButton");
  attemptButton.addEventListener("click", function () {
    const notesInput = document.getElementById("attemptNotes").value;
    const modal = document.getElementById("attemptModal");

    // Extract challenge details from modal
    const challenge = {
      challenge_id: modal.getAttribute("data-challenge-id"),
    };

    handleChallengeAttempt(challenge, notesInput);
  });
});

/////////////////////////////
// Handle Challenge Completion
/////////////////////////////
function handleChallengeCompletion(challenge, notes) {
  const modal = document.getElementById("completionModal");

  // Ensure notes are not empty
  if (!notes.trim()) {
    createErrorToast("Please add notes before completing the challenge.");
    return;
  }

  // Get the user's token
  const token = localStorage.getItem("token");
  if (!token) {
    createErrorToast("You must be logged in to complete this challenge.");
    return;
  }

  // Extract user_id from token
  const user_id = getUserIdFromToken();

  // Validate user_id
  if (!user_id) {
    createErrorToast("Unable to identify user. Please log in again.");
    return;
  }

  // Constructing request data
  const completionData = {
    user_id: user_id,
    completed: true,
    creation_date: new Date().toISOString().slice(0, 10), // Format as YYYY-MM-DD
    notes: notes.trim(),
  };

  // Callback to handle API response
  const handleResponse = function (status, data) {
    if (status === 201) {
      createSuccessToast("Challenge completed successfully! 🎉 Skillpoints added.");

      // Close modal
      bootstrap.Modal.getInstance(modal).hide();

      // Reload the page to reflect updated skillpoints
      setTimeout(() => {
        location.reload();
      }, 1200); // Delay reload to allow toast display
    } else if (status === 401) {
      checkStatusForRefresh(status); // Handle expired token
    } else {
      createErrorToast(data.message || "Failed to complete the challenge. Please try again.");
    }
  };

  // Perform the POST request using `fetchMethod`
  fetchMethod(
    `${currentUrl}/api/challenges/${challenge.challenge_id}`,
    handleResponse,
    "POST",
    completionData,
    token
  );
}

/////////////////////////////
// Handle Challenge Attempt
/////////////////////////////
function handleChallengeAttempt(challenge, notes) {
  const modal = document.getElementById("attemptModal");

  // Ensure notes are not empty
  if (!notes.trim()) {
    createErrorToast("Please add notes before attempting the challenge.");
    return;
  }

  // Get the user's token
  const token = localStorage.getItem("token");
  if (!token) {
    createErrorToast("You must be logged in to attempt the challenge.");
    return;
  }

  // Extract user_id from token
  const user_id = getUserIdFromToken();

  // Validate user_id
  if (!user_id) {
    createErrorToast("Unable to identify user. Please log in again.");
    return;
  }

  // Construct request data
  const attemptData = {
    user_id: user_id,
    challenge_id: challenge.challenge_id,
    completed: false, // Indicating this is an attempt, not a completion!
    creation_date: new Date().toISOString().slice(0, 10), // Format as YYYY-MM-DD
    notes: notes.trim(),
  };

  // Callback to handle API response
  const handleResponse = function (status, data) {
    if (status === 201) {
      createSuccessToast("Challenge attempt recorded successfully! 🎉");
      bootstrap.Modal.getInstance(modal).hide(); // Close modal

      // Reload the page to reflect updated skillpoints
      setTimeout(() => {
        location.reload();
      }, 1200); // Delay reload to allow toast display
    } else if (status === 401) {
      checkStatusForRefresh(status); // Handle expired token
    } else {
      createErrorToast(data.message || "Failed to record the challenge attempt. Please try again.");
    }
  };

  // Perform the POST request using `fetchMethod`
  fetchMethod(
    `${currentUrl}/api/challenges/${challenge.challenge_id}`,
    handleResponse,
    "POST",
    attemptData,
    token
  );
}
