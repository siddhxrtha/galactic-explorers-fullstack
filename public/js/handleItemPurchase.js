function buyItem(itemId) {
  const token = localStorage.getItem("token"); // Fetch JWT token from localStorage

  if (!token) {
    createErrorToast("Please log in to buy items from the Galactic Marketplace!");
    return;
  }

  // Get userId from the token
  const userId = getUserIdFromToken();
  if (!userId) {
    createErrorToast("Unable to identify the user. Please log in again.");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    window.location.href = "login.html";
    return;
  }

  const callback = (status, data) => {
    console.log(data);

    if (status !== 200 && status !== 201) {
      // Handle errors and session expiration
      createErrorToast(data.message || "Failed to process the purchase.");
      checkStatusForRefresh(status); // Check if token needs refresh
      return;
    }

    // Purchase successful: show success modal
    const modal = new bootstrap.Modal(document.getElementById("purchaseSuccessModal"));
    const modalBody = document.getElementById("successModalBody");

    console.log("Response Data:", data);

    // Update modal content
    modalBody.innerHTML = `
      <p>You have successfully purchased <strong>${data.item_bought}</strong>!</p>
      <p>Use these items to explore planets! Check your inventory for updates.</p>
    `;

    // Create "Go to Profile" button
    const redirectButton = document.createElement("button");
    redirectButton.innerHTML = "Go to Profile";
    redirectButton.className = "btn btn-primary mt-3";

    redirectButton.addEventListener("click", function () {
      window.location.href = currentUrl + "/profile.html"; 
    });

    // Append button to modal body
    modalBody.appendChild(redirectButton);

    // Create "Go to Explore" button
    const exploreButton = document.createElement("button");
    exploreButton.innerHTML = "Explore Planets";
    exploreButton.className = "btn btn-outline-info mt-3 mx-3";

    exploreButton.addEventListener("click", function () {
      window.location.href = currentUrl + "/explore.html"; 
    });

    // Append button to modal body
    modalBody.appendChild(redirectButton);
    modalBody.appendChild(exploreButton);
    
    modal.show();

    // Reload the page after a delay to update balance or inventory
    setTimeout(() => {
      location.reload();
    }, 3000); // Reload after 3 seconds
  };

  // Prepare API request data
  const data = {
    item_id: itemId,
    user_id: userId, // Include extracted userId in payload
  };

  fetchMethod(currentUrl + "/api/marketplace/buy", callback, "POST", data, token);
}

