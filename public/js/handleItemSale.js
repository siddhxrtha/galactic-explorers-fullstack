document.addEventListener("DOMContentLoaded", function () {
  setupSellButtonHandlers(); // Set up "Sell Now" button handlers
});

//////////// Setup "Sell Now" Button Handlers ////////////
function setupSellButtonHandlers() {
  const sellButtons = document.querySelectorAll(".btn-sell");

  sellButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const itemId    = this.dataset.id; //  item ID from button dataset
      const itemName  = this.dataset.name; //  item name from button dataset
      const itemImage = this.dataset.image;  //  item image from button dataset
      const costValue = this.getAttribute("data-cost"); //  item cost from button dataset
      const itemCost  = parseFloat(costValue) || 0; 
      
      // calculate the refund amount (50% of the item cost)
      const refundAmount = Math.floor(itemCost / 2);
      console.log("Item cost:", itemCost, "Refund:", refundAmount);

      document.getElementById("sellItemMessage").textContent = `Are you sure you want to sell "${itemName}"?`;
      document.getElementById("sellItemImage").src = itemImage;
      document.getElementById("refundBadge").textContent = `Refund: ${refundAmount} Skillpoints`;

      const confirmButton = document.getElementById("confirmSellButton");
      confirmButton.dataset.id = itemId;

      const sellItemModal = new bootstrap.Modal(document.getElementById("sellItemModal"));
      sellItemModal.show();
    });
  });
}

//////////// Handle the Item Sale ////////////
document.getElementById("confirmSellButton").addEventListener("click", function () {
  const itemId = this.dataset.id; // Retrieve item ID from button dataset
  const userId = getUserIdFromToken(); // Retrieve user ID
  const token = localStorage.getItem("token"); // Retrieve token

  if (!itemId || !userId) {
    createErrorToast("Error: Missing item or user information.");
    return;
  }

  const url = `${currentUrl}/api/marketplace/sell`;
  const data = { user_id: userId, item_id: itemId };

  const callback = (status, response) => {
    const sellItemModal = bootstrap.Modal.getInstance(document.getElementById("sellItemModal"));

    if (status === 200) {
      // Success: Show a success toast
      createSuccessToast("Item sold successfully! You earned back your skillpoints.");

      // Close the modal
      if (sellItemModal) sellItemModal.hide();

      // Reloads the page to reflect changes (inventory and profile updates)
      setTimeout(() => {
        location.reload();
      }, 1000);

      
    } else {
      // Failure: Handle errors and session expiration!
      const errorMessage = response.message || "Unknown error occurred while selling the item.";
      createErrorToast(errorMessage);
      checkStatusForRefresh(status); // Checks if token needs refresh (`refreshToken.js`)
    }
  };

  fetchMethod(url, callback, "POST", data, token);
});


//////////// Handle Sale Response ////////////
function handleSaleResponse(status, response) {
  const sellItemModal = bootstrap.Modal.getInstance(document.getElementById("sellItemModal"));

  if (status === 200) {
    // Success: Show a success toast
    createSuccessToast("Item sold successfully! You earned back your skillpoints.");

    // Close the modal
    if (sellItemModal) sellItemModal.hide();

    // Reload the page to reflect changes (inventory and profile updates)
    setTimeout(() => {
      location.reload();
    }, 1000); 

    checkStatusForRefresh(status); // Checking if token needs refresh
    return;
  } else {
    // Failure: Show an error toast with the error message
    const errorMessage = response.message || "Unknown error occurred while selling the item.";
    createErrorToast(errorMessage);
  }
}
