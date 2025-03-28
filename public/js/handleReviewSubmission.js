/////////////////////////////
// DOMContentLoaded Event
/////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const reviewForm = document.getElementById("reviewForm");

  /////////////////////////////
  // Validate Review Form
  /////////////////////////////
  if (!reviewForm) {
    console.error("Review form element is missing.");
    return;
  }

  /////////////////////////////
  // Handle Form Submission
  /////////////////////////////
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form submission

    /////////////////////////////
    // Collect Form Data
    /////////////////////////////
    const challengeId = document.getElementById("challengeDropdown").value;
    const reviewAmt = document.getElementById("reviewAmt").value;
    const reviewText = document.getElementById("reviewText").value;
    const userId = getUserIdFromToken(); // Get user ID from token

    if (!userId) {
      createErrorToast("You must be logged in to submit reviews! Please log in!");
      return;
    }

    if (!challengeId || !reviewAmt) {
      createErrorToast("Please select a challenge and provide a rating.");
      return;
    }

    if (reviewAmt < 1 || reviewAmt > 5) {
      createErrorToast("Rating must be between 1 and 5.");
      return;
    }

    /////////////////////////////
    // Prepare Data for Submission
    /////////////////////////////
    const reviewData = {
      user_id: userId, // Include user_id in the payload
      challenge_id: challengeId,
      review_amt: reviewAmt,
      review_text: reviewText || null,
    };

    /////////////////////////////
    // POST Request to API
    /////////////////////////////
    const token = localStorage.getItem("token"); // Retrieve token from local storage

    fetchMethod(
      `${currentUrl}/api/reviews`, // API endpoint
      (status, response) => {
        if (status === 201) {
          createSuccessToast("Review submitted successfully!");
          reviewForm.reset(); // Reset the form
          setTimeout(() => {
            location.reload(); // Reload the page to refresh reviews
          }, 2200);
        } else if (status === 401) {
          /////////////////////////////
          // Handle Token Expiry
          /////////////////////////////
          checkStatusForRefresh(status); // Call the token refresh function
        } else {
          createErrorToast("You may only submit one review per challenge.");
          reviewForm.reset(); // Reset the form
        }
      },
      "POST",
      reviewData,
      token
    );
  });
});
