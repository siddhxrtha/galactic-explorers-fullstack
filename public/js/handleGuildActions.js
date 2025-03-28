////////////////////////////
// JOIN GUILD FUNCTION
////////////////////////////

function joinGuild(guildId, guildName) {
  ////////////////////////////
  // Endpoint and Token
  ////////////////////////////
  const url = `${currentUrl}/api/guilds/join`; // API endpoint for joining a guild
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage

  // Check if the user is logged in
  if (!token) {
    createErrorToast("You must be logged in to join a guild!");
    return;
  }

  ////////////////////////////
  // Prepare Data
  ////////////////////////////
  const data = {
    guild_id: guildId,
    user_id: getUserIdFromToken(), // Retrieve user_id from the token
  };

  ////////////////////////////
  // API Request
  ////////////////////////////
  fetchMethod(
    url,
    function (status, responseData) {
      ////////////////////////////
      // Handle Token Expiry
      ////////////////////////////
      checkStatusForRefresh(status); // Checks if token refresh is required

      ////////////////////////////
      // Handle Responses
      ////////////////////////////
      if (status === 200 || status === 201) {
        // Success Toast
        createSuccessToast(`Great Choice! You are now part of ${guildName} 🚀`);
        setTimeout(() => {
          location.reload()
        }, 1500);
      } else if (status === 409) {
        // Conflict or already in another guild
        createErrorToast(responseData.message || "You are already in a guild!");
      } else if (status === 404) {
        // Guild not found
        createErrorToast(responseData.message || "Guild not found. Please try again.");
      } else if (status === 401) {
        // Unauthorized
        createErrorToast("Your session has expired. Refreshing Token...");
      } else {
        // General Error
        createErrorToast(responseData.message || "Failed to join the guild. Please try again.");
      }
    },
    "POST", 
    data,   // Data to send
    token   // Authorisation token
  );
}

////////////////////////////
// LEAVE GUILD FUNCTION
////////////////////////////

function leaveGuild(guildId, guildName) {
  ////////////////////////////
  // Endpoint and Token
  ////////////////////////////
  const url = `${currentUrl}/api/guilds/leave`; // API endpoint for leaving a guild
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage

  // Check if the user is logged in
  if (!token) {
    createErrorToast("You must be logged in to leave a guild!");
    return;
  }

  ////////////////////////////
  // Prepare Data
  ////////////////////////////
  const data = {
    guild_id: guildId,
    user_id: getUserIdFromToken(), // Retrieve user_id from the token
  };

  ////////////////////////////
  // API Request
  ////////////////////////////
  fetchMethod(
    url,
    function (status, responseData) {
      ////////////////////////////
      // Handle Token Expiry
      ////////////////////////////
      checkStatusForRefresh(status); // Checks if token refresh is required

      ////////////////////////////
      // Handle Responses
      ////////////////////////////
      if (status === 200) {
        // Success Toast with Guild Name
        createSuccessToast(
          `You have successfully left "${guildName}". We're sad to see you go 😔, but feel free to join another guild!`
        );
        setTimeout(() => {
          location.reload(); // Reload page to reflect changes
        }, 2200);
      } else if (status === 404) {
        // Guild not found
        createErrorToast(responseData.message || "Guild not found. Please try again.");
      } else if (status === 409) {
        // Not a member of the guild
        createErrorToast(responseData.message || "You are not a member of this guild!");
      } else if (status === 401) {
        // Unauthorized
        createErrorToast("Your session has expired. Please log in again.");
      } else {
        // General Error
        createErrorToast(responseData.message || "Failed to leave the guild. Please try again.");
      }
    },
    "POST", // HTTP Method
    data,   // Data to send
    token   // Authorisation token
  );
}

document.addEventListener("DOMContentLoaded", function () {
  ////////////////////////////
  // Modal Elements
  ////////////////////////////
  const guildToDeleteName = document.getElementById("guildToDeleteName");
  const deleteGuildButton = document.getElementById("deleteGuildButton");

  ////////////////////////////
  // Handle Bin Icon Click
  ////////////////////////////
  document.body.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-guild-icon")) {
      const guildId = event.target.getAttribute("data-guild-id");
      const guildName = event.target.getAttribute("data-guild-name");

      // Debugging: Check if data is being fetched correctly
      console.log("Guild ID:", guildId);
      console.log("Guild Name:", guildName);

      // Populate modal with guild details
      guildToDeleteName.textContent = guildName;

      // Attach delete function to the "Delete Now" button
      deleteGuildButton.onclick = function () {
        console.log("Deleting Guild:", guildId, guildName); 
        deleteGuild(guildId); // Call the deleteGuild function!!
      };
    }
  });
});

////////////////////////////
// DELETE GUILD FUNCTION
////////////////////////////
function deleteGuild(guildId) {
  const url = `${currentUrl}/api/guilds`; // API endpoint for deleting a guild
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage

  // Check if the user is logged in
  if (!token) {
    createErrorToast("You must be logged in to delete a guild!");
    return;
  }

  // Prepare Data
  const data = {
    guild_id: guildId,
    user_id: getUserIdFromToken(), // Retrieve user_id from the token
  };

  // API Request
  fetchMethod(
    url,
    function (status, responseData) {
      console.log("Delete Guild API Response:", status, responseData);

      ////////////////////////////
      // Handle Token Expiry
      ////////////////////////////
      checkStatusForRefresh(status); // Checks if token refresh is required

      ////////////////////////////
      // Handle Responses
      ////////////////////////////
      if (status === 200) {
        // Success Toast
        createSuccessToast(`The guild has been successfully deleted! 🗑️`);
        setTimeout(() => {
          location.reload(); // Reload page to reflect changes
        }, 2200);
      } else if (status === 403) {
        createErrorToast(responseData.message || "You are not authorised to delete this guild.");
      } else if (status === 404) {
        createErrorToast(responseData.message || "Guild not found. Please try again.");
      } else if (status === 401) {
        createErrorToast("Your session has expired. Refreshing Token...");
      } else {
        createErrorToast(responseData.message || "Failed to delete the guild. Please try again.");
      }
    },
    "DELETE", 
    data, // Data to send
    token // Authorisation token
  );
}


