document.addEventListener("DOMContentLoaded", function () {
  const deleteButton = document.getElementById("confirmDeleteButton");

  deleteButton.addEventListener("click", function () {
    const modal = document.getElementById("deleteChallengeModal");
    const challengeId = modal.dataset.challengeId; // Get challenge ID from modal

    if (challengeId) {
      deleteChallenge(challengeId);
    }
  });
});

/////////////////////////////
// Delete Challenge
/////////////////////////////
function deleteChallenge(challengeId) {
  const token = localStorage.getItem("token"); // Get token for authorization
  const userId = getUserIdFromToken(); // Extract userId from token

  if (!userId) {
    createErrorToast("You must be logged in to delete a challenge.");
    return;
  }

  const url = `${currentUrl}/api/challenges/${challengeId}`;
  const payload = { user_id: userId }; // Send user_id in the request body

  fetchMethod(
    url,
    function (status, data) {
      if (status === 204) {
        // Successful deletion
        removeChallengeFromUI(challengeId);
        createSuccessToast("Challenge deleted successfully!");
        closeDeleteModal();
        location.reload();
      } else if (status === 403) {
        // Forbidden deletion
        createErrorToast("You are not authorised to delete this challenge.");
      } else if (status === 401) {
        // Handle token expiration
        checkStatusForRefresh(status);
      } else {
        // General error
        createErrorToast("Failed to delete the challenge. Please try again.");
      }
    },
    "DELETE",
    payload,
    token
  );
}

/////////////////////////////
// Remove Challenge from UI
/////////////////////////////
function removeChallengeFromUI(challengeId) {
  const challengeCard = document.querySelector(`[data-challenge-id="${challengeId}"]`);
  if (challengeCard) {
    challengeCard.parentElement.removeChild(challengeCard);
  }
}

/////////////////////////////
// Close Delete Modal
/////////////////////////////
function closeDeleteModal() {
  const modalInstance = bootstrap.Modal.getInstance(
    document.getElementById("deleteChallengeModal")
  );
  if (modalInstance) {
    modalInstance.hide();
  }
}

/////////////////////////////
// Set Challenge ID in Modal
/////////////////////////////
function setDeleteModalChallengeId(challengeId) {
  const modal = document.getElementById("deleteChallengeModal");
  modal.dataset.challengeId = challengeId;
}

/////////////////////////////
// Show Toast Notification
/////////////////////////////
function showToast(message, type) {
  if (type === "success") {
    createSuccessToast(message);
  } else if (type === "error") {
    createErrorToast(message);
  }
}
