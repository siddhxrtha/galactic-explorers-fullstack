document.addEventListener("DOMContentLoaded", function () {
  //////////////////////////////
  // DOM Element References
  //////////////////////////////
  const createGuildForm = document.getElementById("create-guild-form");

  //////////////////////////////
  // Validate and Submit Form
  //////////////////////////////
  if (createGuildForm) {
    createGuildForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent page reload

      // Extract form inputs
      const guildName = document.getElementById("guildName").value.trim();
      const guildDescription = document.getElementById("guildDescription").value.trim();

      // Input Validation
      if (!guildName || !guildDescription) {
        createErrorToast("Please provide both a guild name and description.");
        return;
      }

      if (guildName.length > 50) {
        createErrorToast("Guild name cannot exceed 50 characters.");
        return;
      }

      if (guildDescription.length > 200) {
        createErrorToast("Guild description cannot exceed 200 characters.");
        return;
      }

      // Proceed to create the guild
      handleGuildCreation(guildName, guildDescription, createGuildForm);
    });
  }
});

//////////////////////////////
// Handle Guild Creation
//////////////////////////////
function handleGuildCreation(guildName, guildDescription, form) {
  //////////////////////////////
  // Prepare API Data
  //////////////////////////////
  const token = localStorage.getItem("token"); // Retrieve the token
  const userId = getUserIdFromToken(); // Retrieve the user ID

  if (!token || !userId) {
    createErrorToast("You must be logged in to create a guild.");
    return;
  }

  const data = {
    user_id: userId,
    guild_name: guildName,
    guild_description: guildDescription,
  };

  //////////////////////////////
  // API Request
  //////////////////////////////
  const url = `${currentUrl}/api/guilds`; // API endpoint for guild creation

  fetchMethod(
    url,
    function (status, response) {
      checkStatusForRefresh(status); // Check token refresh if needed

      if (status === 201) {
        // Success
        createSuccessToast(response.message || "Guild created successfully!");
        form.reset(); // Reset the form inputs
        setTimeout(() => {
          location.reload();
        }, 2000);
      } else if (status === 400) {
        // Validation errors
        createErrorToast(response.message || "Invalid input. Please check your data.");
      } else if (status === 404) {
        // User not found
        createErrorToast(response.message || "User not found. Please log in again.");
      } else {
        // General errors
        createErrorToast(response.message || "Failed to create the guild. Please try again.");
        form.reset(); // Reset the form inputs
      }
    },
    "POST",
    data,
    token
  );
}
