/////////////////////////////
// DOMContentLoaded Event
/////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const reviewsContainer = document.getElementById("reviewsContainer");
  const loadingScreen = document.getElementById("loading-screen");

  /////////////////////////////
  // Validates Reviews Container
  /////////////////////////////
  if (!reviewsContainer) {
    console.error("Reviews container element is missing.");
    return;
  }

  /////////////////////////////
  // Show Loading Screen
  /////////////////////////////
  if (loadingScreen) {
    loadingScreen.classList.remove("d-none");
  }

  ///////////////////////////////
  // Fetches and Populate Reviews
  ///////////////////////////////
  fetchMethod(
    `${currentUrl}/api/reviews`, // API endpoint for fetching reviews
    (status, data) => {
      if (status === 200 && Array.isArray(data) && data.length > 0) {
        reviewsContainer.innerHTML = ""; 

        /////////////////////////////
        // Populate Reviews
        /////////////////////////////
        data.forEach((review) => {
          // Creates review card
          const reviewCard = createReviewCard(review);

          // Appends card to the container
          reviewsContainer.appendChild(reviewCard);
        });
      } else {
        /////////////////////////////
        // Handles Empty/No Reviews
        /////////////////////////////
        reviewsContainer.innerHTML =
          "<p class='text-center text-muted'>No reviews available at the moment.</p>";
        console.error("Failed to load reviews or no reviews available.");
      }

      /////////////////////////////
      // Hide Loading Screen
      /////////////////////////////
      if (loadingScreen) {
        loadingScreen.classList.add("d-none");
      }
    },
    "GET",
    null // No request body for GET requests
  );
});

/////////////////////////////
// Create Review Card
/////////////////////////////
function createReviewCard(review) {
  const userId = getUserIdFromToken(); // Get logged-in user ID

  // Checks if the review belongs to the logged-in user
  const isUserReview = review.reviewer_id === userId;

  // Defines the badge class based on ownership
  const badgeClass = isUserReview
    ? "bg-warning text-black fw-bold" // Highlighted style for the logged-in user's review
    : "bg-info text-dark"; // Default style for other reviews

  // Defines border colour based on rating
  const borderClass =
    review.review_amt > 2
      ? "border-success border-2"
      : "border-danger border-2";

  const card = document.createElement("div");
  card.className = "col-md-6";

  card.innerHTML = `
<div class="card shadow-sm rounded-4 ${borderClass}">
  <div class="card-body position-relative">
    <!-- Delete Icon -->
    ${
      isUserReview
        ? `
      <div class="delete-icon-wrapper position-absolute top-0 end-0 m-2">
        <i 
          class="bi bi-trash-fill delete-icon d-flex align-items-center justify-content-center text-danger"
          data-review-id="${review.review_id}" 
          data-bs-toggle="modal" 
          data-bs-target="#deleteReviewModal" 
          data-challenge-id="${review.challenge_id}"
          style="cursor: pointer; font-size: 1.2rem;" 
          title="Delete Review"
        ></i>
        <span class="delete-text mx-2 text-danger">Delete</span>
      </div>
      <!-- Edit Icon -->
      <div class="edit-icon-wrapper position-absolute top-0 end-0 mt-5 me-2">
        <i 
          class="bi bi-pencil-square edit-icon d-flex align-items-center justify-content-center mt-2 text-primary rounded-circle"
          data-review-id="${review.review_id}" 
          data-review-text="${review.review_text}" 
          data-review-rating="${review.review_amt}" 
          data-challenge-id="${review.challenge_id}"
          data-bs-toggle="modal" 
          data-bs-target="#editReviewModal" 
          style="cursor: pointer; font-size: 1.2rem;" 
          title="Edit Review"
        ></i>
        <span class="edit-text mx-2 text-primary mt-2">Edit</span>
      </div>
    `
        : ""
    }
    <h5 class="card-title challenge-name-text">${review.challenge_name}</h5>
    <p class="card-text">
      <span class="badge ${badgeClass} mb-2">
        Reviewer: ${review.reviewer_username}
        ${isUserReview ? "<span class='you-badge'>(You)</span>" : ""}
      </span><br />
      <span style="font-size: 1.4rem"><strong>Rating:</strong> ${"⭐".repeat(review.review_amt)}</span><br />
      <strong>Review:</strong> ${review.review_text || "No review text provided."}
    </p>
    <p class="badge bg-light text-dark mb-0">
      <small>Reviewed on: ${new Date(review.created_at).toLocaleDateString()}</small>
    </p>
  </div>
</div>
  `;

  return card;
}

/////////////////////////////
// Load Challenges for Filter Dropdown
/////////////////////////////
function loadChallenges() {
  const challengeDropdown = document.getElementById("filterByChallenge");

  fetchMethod(`${currentUrl}/api/challenges`, (status, data) => {
    if (status === 200 && Array.isArray(data)) {
      challengeDropdown.innerHTML = `<option value="all" selected>All Challenges</option>`; // Default option

      data.forEach((challenge) => {
        challengeDropdown.innerHTML += `<option value="${challenge.challenge_id}">${challenge.challenge}</option>`;
      });
    } else {
      console.error("Failed to load challenges.");
    }
  }, "GET");
}

/////////////////////////////
// Handle Sorting Dropdown
/////////////////////////////
const sortDropdown = document.getElementById("sortReviewsDropdown");
sortDropdown.addEventListener("change", () => {
  const sortOrder = sortDropdown.value;
  const selectedChallenge = document.getElementById("filterByChallenge").value;
  loadReviews(sortOrder, selectedChallenge);
});

/////////////////////////////
// Fetch and Load Reviews with Sorting & Filtering
/////////////////////////////
function loadReviews(sortOrder = "highest", challengeId = "all") {
  const reviewsContainer = document.getElementById("reviewsContainer");
  const loadingScreen = document.getElementById("loading-screen");

  if (!reviewsContainer) {
    console.error("Reviews container element is missing.");
    return;
  }

  if (loadingScreen) {
    loadingScreen.classList.remove("d-none");
  }

  // Ensure sorting is always passed correctly in the API endpoint
  let endpoint = `${currentUrl}/api/reviews?sort=${sortOrder}`; // Default: All reviews

  if (challengeId !== "all") {
    endpoint = `${currentUrl}/api/reviews/challenge/${challengeId}?sort=${sortOrder}`;
  }

  console.log("Fetching reviews from:", endpoint); // Debugging log

  fetchMethod(endpoint, (status, data) => {
    console.log("API Response:", data); // Debugging log

    if (status === 200 && Array.isArray(data) && data.length > 0) {
      reviewsContainer.innerHTML = ""; 
      data.forEach((review) => {
        const reviewCard = createReviewCard(review); 
        reviewsContainer.appendChild(reviewCard);
      });
    } else {
      reviewsContainer.innerHTML =
        "<p class='text-center text-black'>No reviews available for this challenge yet.</p>";
    }

    if (loadingScreen) {
      loadingScreen.classList.add("d-none");
    }
  }, "GET");
}

/////////////////////////////
// Handle Challenge Filter Dropdown
/////////////////////////////
const challengeDropdown = document.getElementById("filterByChallenge");
challengeDropdown.addEventListener("change", () => {
  const selectedChallenge = challengeDropdown.value;
  const sortOrder = document.getElementById("sortReviewsDropdown").value;
  loadReviews(sortOrder, selectedChallenge);
});

// Load challenges & reviews when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadChallenges();
  loadReviews();
});
