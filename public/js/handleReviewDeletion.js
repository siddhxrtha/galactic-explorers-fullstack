/////////////////////////////
// Confirm Delete Review Event
/////////////////////////////
document.getElementById("confirmDeleteReviewButton").addEventListener("click", () => {
  // Retrieve review ID stored in the delete icon's dataset
  const reviewId = document
    .querySelector(".delete-icon[data-bs-target='#deleteReviewModal']")
    ?.getAttribute("data-review-id");

  // Fetch user ID from the token (Modular function in getUserIdFromToken.js)
  const userId = getUserIdFromToken();

  // Validate review ID and user ID
  if (!reviewId || !userId) {
    createErrorToast("Error: Missing review or user information.");
    return;
  }

  // Call deleteReview with review ID and user ID!!
  deleteReview(reviewId, userId);
});

/////////////////////////////
// Delete Review Function
/////////////////////////////
function deleteReview(reviewId, userId) {
  const token = localStorage.getItem("token"); // Retrieve the user token

  // Validate review ID and user ID
  if (!reviewId || !userId) {
    createErrorToast("Error: Missing required data for review deletion.");
    return;
  }

  // API endpoint to delete the review
  const url = `${currentUrl}/api/reviews/${reviewId}`;

  // Request data including user ID!!
  const data = { user_id: userId };

  // Make DELETE request to server
  fetchMethod(
    url,
    (status, response) => {
      if (status === 204) {
        // Review successfully deleted
        createSuccessToast("Review deleted successfully!");
        setTimeout(() => location.reload(), 1000); // Refresh the page to reflect changes
      } else {
        // Handle errors
        createErrorToast(response.message || "Failed to delete review.");
        checkStatusForRefresh(status); // Refresh token if necessary
      }
    },
    "DELETE",
    data, // Send user ID as part of the request body (API requirement)
    token
  );
}
