document.addEventListener("DOMContentLoaded", function () {
  const editButton = document.getElementById("confirmEditButton");

  // Handle "Edit" button click
  editButton.addEventListener("click", function () {
    const modal = document.getElementById("editChallengeModal");
    const challengeId = modal.dataset.challengeId; // Get challenge ID from modal
    const challengeName = document.getElementById("editChallengeName").value;
    const skillPoints = document.getElementById("editSkillPoints").value;

    if (challengeId && challengeName && skillPoints) {
      updateChallenge(challengeId, challengeName, skillPoints);
    } else {
      createErrorToast("Please fill in all fields.");
    }
  });
});

/////////////////////////////
// Update Challenge
/////////////////////////////
function updateChallenge(challengeId, challengeName, skillPoints) {
  const token = localStorage.getItem("token"); // Get token for authorization
  const userId = getUserIdFromToken(); // Extract userId from token

  if (!userId) {
    createErrorToast("You must be logged in to edit a challenge.");
    return;
  }
  /////////////////////////////////////////////////
  // Form Validation To Handle Invalid Skillpoints
  /////////////////////////////////////////////////
  if (skillPoints < 0 || skillPoints > 150) {
    createErrorToast("Skill points must be between 0 and 150.");
    return;
  }

  const url = `${currentUrl}/api/challenges/${challengeId}`;
  const payload = {
    user_id: userId,
    challenge: challengeName,
    skillpoints: skillPoints,
  };

  fetchMethod(
    url,
    function (status, data) {
      checkStatusForRefresh(status); // Check if token refresh is required

      if (status === 200) {
        // Successful update
        updateChallengeInUI(challengeId, challengeName, skillPoints);
        createSuccessToast("Challenge updated successfully!");
        closeEditModal();
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else if (status === 403) {
        // Forbidden update
        createErrorToast("You are not authorised to edit this challenge.");
      } else {
        // General error
        createErrorToast("Failed to update the challenge. Please try again.");
      }
    },
    "PUT",
    payload,
    token
  );
}

/////////////////////////////
// Update Challenge in UI
/////////////////////////////
function updateChallengeInUI(challengeId, challengeName, skillPoints) {
  const challengeCard = document.querySelector(`[data-challenge-id="${challengeId}"]`);
  if (challengeCard) {
    // Update the challenge name and skill points in the UI
    challengeCard.querySelector(".card-title").textContent = challengeName;
    challengeCard.querySelector(".badge").textContent = `Skill Points: ${skillPoints}`;
  }
}

/////////////////////////////
// Close Edit Modal
/////////////////////////////
function closeEditModal() {
  const modalInstance = bootstrap.Modal.getInstance(document.getElementById("editChallengeModal"));
  if (modalInstance) {
    modalInstance.hide();
  }

  const backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) {
    backdrop.parentNode.removeChild(backdrop);
  }

  document.body.classList.remove("modal-open");
  document.body.style.paddingRight = "";
}

// Ensure proper cleanup when modal is hidden
const editChallengeModal = document.getElementById("editChallengeModal");
editChallengeModal.addEventListener("hidden.bs.modal", () => {
  const backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) {
    backdrop.parentNode.removeChild(backdrop);
  }
  document.body.classList.remove("modal-open");
  document.body.style.paddingRight = "";
});

/////////////////////////////
// Set Challenge ID in Modal
/////////////////////////////
function setEditModalChallengeId(challengeId) {
  const modal = document.getElementById("editChallengeModal");
  modal.dataset.challengeId = challengeId;

  // Pre-fill the form with current challenge data
  const challengeCard = document.querySelector(`[data-challenge-id="${challengeId}"]`);
  if (challengeCard) {
    const challengeName = challengeCard.querySelector(".card-title").textContent;
    const skillPoints = challengeCard.querySelector(".badge").textContent.split(": ")[1];
    document.getElementById("editChallengeName").value = challengeName;
    document.getElementById("editSkillPoints").value = skillPoints;
  }
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


