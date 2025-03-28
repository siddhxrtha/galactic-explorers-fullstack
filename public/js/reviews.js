/////////////////////////////
// DOMContentLoaded Event
/////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const challengeDropdown = document.getElementById("challengeDropdown");
  const loadingScreen = document.getElementById("loading-screen");
  const heroSubtitle = document.querySelector(".hero .lead"); // Target the subtitle for typewriter effect

  /////////////////////////////
  // Typewriter Effect for Hero Subtitle
  /////////////////////////////
  if (heroSubtitle) {
    const text = "Share your thoughts and help others choose the best challenges! 🎯";
    const speed = 45; // Speed of typing in milliseconds
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        heroSubtitle.innerHTML += text.charAt(i); // Append each character
        i++;
        setTimeout(typeWriter, speed); // Call recursively until complete
      }
    }

    typeWriter(); // Start the typewriter animation
  }

  /////////////////////////////
  // Validate Dropdown Element
  /////////////////////////////
  if (!challengeDropdown) {
    console.error("Challenge dropdown element is missing.");
    return;
  }

  /////////////////////////////
  // Show Loading Screen
  /////////////////////////////
  if (loadingScreen) {
    loadingScreen.classList.remove("d-none");
  }

  /////////////////////////////
  // Fetch and Populate Challenges
  /////////////////////////////
  const token = localStorage.getItem("token");

  fetchMethod(
    `${currentUrl}/api/challenges`, // API endpoint for fetching challenges
    (status, data) => {
      if (status === 200 && Array.isArray(data) && data.length > 0) {
        /////////////////////////////
        // Populate Dropdown
        /////////////////////////////
        challengeDropdown.innerHTML = `<option value="" disabled selected>Select a challenge...</option>`; // Default option

        data.forEach((challenge) => {
          const option = document.createElement("option");
          option.value = challenge.challenge_id; // Challenge ID as value
          option.textContent = challenge.challenge; // Display name
          challengeDropdown.appendChild(option); // Append to dropdown
        });
      } else {
        /////////////////////////////
        // Handle Empty/No Challenges
        /////////////////////////////
        challengeDropdown.innerHTML =
          `<option value="" disabled>No challenges available.</option>`;
        console.error("Failed to load challenges or no challenges available.");
      }

      /////////////////////////////
      // Hide Loading Screen
      /////////////////////////////
      if (loadingScreen) {
        loadingScreen.classList.add("d-none");
      }
    },
    "GET",
    null, // No request body for GET request!!
    token // Include the user's token for authentication
  );

  /////////////////////////////
  // Handle Star Click
  /////////////////////////////
  const stars = document.querySelectorAll(".star-rating .bi"); // Select all star elements
  const reviewAmtInput = document.getElementById("reviewAmt"); // Hidden input to store the rating value

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      reviewAmtInput.value = index + 1; // Sets the clicked star's value (1-based index)
      resetStars(); // Reset all stars to default
      highlightStars(index); // Highlight up to the clicked star
    });
  });

  /////////////////////////////
  // Helper Function: Highlight Stars
  /////////////////////////////
  function highlightStars(index) {
    for (let i = 0; i <= index; i++) {
      stars[i].classList.remove("bi-star"); // Remove the empty star class
      stars[i].classList.add("bi-star-fill", "text-warning"); // Add the filled star and color class
    }
  }

  /////////////////////////////
  // Helper Function: Reset Stars
  /////////////////////////////
  function resetStars() {
    stars.forEach((star) => {
      star.classList.remove("bi-star-fill", "text-warning"); // Remove the filled star and color class
      star.classList.add("bi-star");
    });
  }
});

////////////////////////////////////
// EDIT REVIEW STAR RATING HANDLERS
////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  // Star Rating Logic for Edit Modal
  const starIcons = document.querySelectorAll("#editReviewModal .star-rating .bi");

  starIcons.forEach((star) => {
    star.addEventListener("click", () => {
      const rating = star.getAttribute("data-value");
      document.getElementById("editReviewAmt").value = rating;

      // Updates stars visually
      starIcons.forEach((s) => {
        s.classList.remove("bi-star-fill");
        s.classList.add("bi-star");
        if (s.getAttribute("data-value") <= rating) {
          s.classList.remove("bi-star");
          s.classList.add("bi-star-fill");
        }
      });
    });
  });

  // Prepopulate stars in the modal when editing based off former input, so user can see their previous rating
  document.addEventListener("click", (event) => {
    const editIcon = event.target.closest(".edit-icon");
    if (editIcon) {
      const reviewRating = editIcon.getAttribute("data-review-rating");
      document.getElementById("editReviewAmt").value = reviewRating;

      // Update stars visually
      starIcons.forEach((star) => {
        star.classList.remove("bi-star-fill");
        star.classList.add("bi-star");
        if (star.getAttribute("data-value") <= reviewRating) {
          star.classList.remove("bi-star");
          star.classList.add("bi-star-fill");
        }
      });
    }
  });
});
