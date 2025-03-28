document.addEventListener("DOMContentLoaded", function () {
  const confirmDeleteButton = document.getElementById("confirmDeleteButton");

  // Exit if no delete button found
  if (!confirmDeleteButton) return;

  confirmDeleteButton.addEventListener("click", function () {
    const userId = getUserIdFromToken();
    const token = localStorage.getItem("token");
    const url = `${currentUrl}/api/users/${userId}`;

    const callback = (status, responseData) => {
      checkStatusForRefresh(status);

      if (status === 200) {
        // Close the original Delete Account modal
        const deleteModal = new bootstrap.Modal(document.getElementById("deleteAccountModal"));
        deleteModal.hide();

        // Show the farewell modal
        const farewellModalEl = document.getElementById("farewellModal");
        const farewellModal = new bootstrap.Modal(farewellModalEl);
        farewellModal.show();

        // Trigger the farewell animation
        const farewellMessage = document.getElementById("farewellMessage");
        const farewellLine = document.getElementById("farewellLine");
        farewellMessage.classList.remove("d-none");
        farewellLine.classList.remove("d-none");
        farewellLine.style.width = "100%"; // animate over 2s

        // Redirect after animation finishes
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("refresh");
          window.location.href = "login.html";
        }, 4000);
      } else if (status === 404) {
        createErrorToast("User not found!");
      } else if (status === 403) {
        createErrorToast("Cannot delete another user's account!");
      } else {
        createErrorToast(responseData.message || "Failed to delete account.");
      }
    };

    // Send DELETE request
    fetchMethod(url, callback, "DELETE", null, token);
  });
});
