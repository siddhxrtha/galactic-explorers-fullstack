document.addEventListener("DOMContentLoaded", () => {
  const editReviewModal = document.getElementById("editReviewModal");
  // const editReviewForm = document.getElementById("editReviewForm");
  const editReviewText = document.getElementById("editReviewText");
  const editReviewRating = document.getElementById("editReviewAmt");
  const confirmEditReviewButton = document.getElementById("confirmEditReviewButton");

  let currentReviewId = null; // Stores the review ID being edited

  /////////////////////////////
  // Open Edit Modal with Review Data
  /////////////////////////////
  document.addEventListener("click", (event) => {
    const editIcon = event.target.closest(".edit-icon");
    if (editIcon) {
      currentReviewId = editIcon.getAttribute("data-review-id");
      const reviewText = editIcon.getAttribute("data-review-text");
      const reviewRating = editIcon.getAttribute("data-review-rating");
      const challengeId = editIcon.getAttribute("data-challenge-id"); 

      // Populate modal fields with existing review data
      editReviewText.value = reviewText || "";
      editReviewRating.value = reviewRating || "5";

      // Store challenge_id in the modal's dataset for later use
      editReviewModal.dataset.challengeId = challengeId;
      console.log("Challenge ID:", challengeId);

      // Show the modal
      const modal = new bootstrap.Modal(editReviewModal);
      modal.show();
    }
  });

  /////////////////////////////
  // Handle Edit Submission
  /////////////////////////////
  confirmEditReviewButton.addEventListener("click", () => {
    // Validate the form
    if (!editReviewText.value.trim() || !editReviewRating.value) {
      createErrorToast("Please provide both review text and rating.");
      return;
    }

    // Retrieve challenge_id from the modal's dataset
    const challengeId = editReviewModal.dataset.challengeId;

    // Prepare data for the PUT request
    const updatedReview = {
      review_text: editReviewText.value.trim(),
      review_amt: parseInt(editReviewRating.value),
      challenge_id: parseInt(challengeId),
    };

    // Send the PUT request
    editReview(currentReviewId, updatedReview);
  });
});

/////////////////////////////
// Function to Send PUT Request
/////////////////////////////
function editReview(reviewId, updatedReview) {
  const token = localStorage.getItem("token"); // Get the user token
  const userId = getUserIdFromToken(); // Fetch user ID from token

  if (!reviewId || !updatedReview || !userId) {
    createErrorToast("Error: Missing required data for review editing.");
    return;
  }

  // Includes all required fields in the data object!
  const data = {
    id: reviewId, // Review ID
    user_id: userId, // User ID
    review_amt: updatedReview.review_amt, // Rating
    review_text: updatedReview.review_text || null, // Review text
    challenge_id: updatedReview.challenge_id // Challenge ID
  };

  const url = `${currentUrl}/api/reviews/${reviewId}`;

  fetchMethod(
    url,
    (status, response) => {
      if (status === 204) {
        createSuccessToast("Review updated successfully!");
        // Reload reviews to reflect the updated review
        setTimeout(() => location.reload(), 1000);
      } else if (status === 401) {
        // Handle token expiration
        checkStatusForRefresh(status);
      } else if (status === 403) {
        createErrorToast("You are not authorised to edit this review.");
      } else {
        createErrorToast(response.message || "Failed to edit the review.");
        checkStatusForRefresh(status); // I'm Checking if token needs a refresh!!
      }
    },
    "PUT",
    data, // Send payload with all required fields
    token
  );
}

// Ensure proper cleanup when modal is hidden
const editReviewModal = document.getElementById("editReviewModal");
editReviewModal.addEventListener("hidden.bs.modal", () => {
  const backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) {
    backdrop.parentNode.removeChild(backdrop);
  }
  document.body.classList.remove("modal-open");
  document.body.style.paddingRight = "";
  document.body.style.overflow = ""; // Ensure scrolling is enabled!!
});
