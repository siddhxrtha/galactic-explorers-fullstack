document.addEventListener("DOMContentLoaded", function () {
  ////////////////////////////
  // DOM Element References
  ////////////////////////////
  const guildsContainer = document.getElementById("guilds-container");
  const loadingScreen = document.getElementById("loading-screen");

  // Guild Details Modal Elements
  const modalGuildName = document.getElementById("guild-name");
  const modalGuildDescription = document.getElementById("guild-description");
  const modalGuildMembers = document.getElementById("guild-members");
  const joinGuildButton = document.getElementById("joinGuildButton");
  const viewMembersButton = document.getElementById("viewMembersButton");

  // Guild Members Modal Elements
  const guildMembersList = document.getElementById("guildMembersList");

///////////////////////////////////////////////
// Load Guilds with Highlight for User's Guild
///////////////////////////////////////////////
function loadGuilds(userGuild, userId) {
  const url = `${currentUrl}/api/guilds`; // API endpoint to view all guilds

  // Show loading screen while fetching
  loadingScreen.style.display = "flex";

  fetchMethod(
    url,
    function (status, data) {
      loadingScreen.style.display = "none"; // Hide loading screen after fetch

      if (status === 200) {
        if (data.length === 0) {
          guildsContainer.innerHTML = `
            <p class="text-center text-muted mx-auto">
              No guilds available at the moment. Create your own or check back later.
            </p>`;
          return;
        }

        // Populate guilds
        guildsContainer.innerHTML = ""; // Clear container
        data.forEach((guild) => {
          guildsContainer.innerHTML += createGuildCard(guild, userGuild, userId); // Pass userId for creator check
        });

        // Attach click events to Join Guild buttons
        attachJoinButtonEvents();
      } else {
        createErrorToast(data.message || "Failed to load guilds. Please try again.");
      }
    },
    "GET"
  );
}

////////////////////////////
// Create Guild Card
////////////////////////////
function createGuildCard(guild, userGuild, userId) {
  const isUserInGuild = userGuild === guild.guild_name; // Check if the user belongs to this guild
  const isCreator = guild.creator_id === userId; // Check if the logged-in user is the creator

  const cardClasses = isUserInGuild
    ? "user-guild-card" // Special class for the user's guild card
    : "guild-card"; // Default class

  const badgeClasses = isCreator ? "creator-badge-highlight" : "guild-owner-badge"; // Custom color for creator badge

  return `
    <div class="col-md-4">
      <div class="card ${cardClasses} shadow-sm h-100 position-relative">
        <!-- Bin Icon (Only for creator) -->
        ${
          isCreator
            ? `<i class="bi bi-trash-fill text-danger position-absolute top-0 end-0 m-2 delete-guild-icon" 
                  data-bs-toggle="modal" 
                  data-bs-target="#deleteGuildModal" 
                  data-guild-id="${guild.guild_id}" 
                  data-guild-name="${guild.guild_name}" 
                  style="cursor: pointer; z-index: 10; font-size: 1.5rem;"></i>`
            : ""
        }
        <div class="card-body d-flex flex-column align-items-center position-relative">
          <!-- Guild Owner Badge -->
          ${
            guild.creator_name
              ? `<div class="position-absolute top-0 translate-middle ${badgeClasses} text-center px-5 py-1 rounded-pill fw-bold">
                  Created by ${guild.creator_name} ${isCreator ? "(You)" : ""}
                </div>`
              : ""
          }
          <!-- Guild Icon -->
          <div class="mb-3 mt-4"> 
            <i class="bi bi-shield-fill-plus ${isUserInGuild ? "text-light" : "text-info"}" style="font-size: 3rem;"></i>
          </div>
          <!-- Guild Name -->
          <h5 class="guild-card-title text-center">${guild.guild_name}</h5>
          <!-- Guild Description -->
          <p class="guild-card-description text-center">${guild.guild_description}</p>
          <!-- Guild Stats -->
          <div class="guild-card-stats mt-auto w-100 d-flex justify-content-between">
            <span><i class="bi bi-people-fill ${isUserInGuild ? "text-light" : "text-success"}"></i> ${guild.member_count} Members</span>
            <span><i class="bi bi-stars text-warning"></i> ${guild.total_skillpoints} Skillpoints</span>
          </div>
          <!-- Badge: Your Guild -->
          ${
            isUserInGuild
              ? `<div class="mt-3 w-100 text-center">
                  <span class="badge bg-success text-white">Your Guild</span>
                </div>`
              : ""
          }
          <!-- Join & Chat Buttons -->
          <div class="mt-3 text-center w-100">
            <button
              class="btn btn-primary join-guild-btn w-75"
              data-bs-toggle="modal"
              data-bs-target="#guildDetailsModal"
              data-guild-id="${guild.guild_id}"
              data-guild-name="${guild.guild_name}"
              data-guild-description="${guild.guild_description}"
              data-guild-members="${guild.member_count}"
              data-guild-skillpoints="${guild.total_skillpoints}">
              Guild Details
            </button>

            <!-- Chat Button (Only visible if user is part of the guild) -->
            ${
              isUserInGuild
                ? `<a href="guildChat.html?guild_id=${guild.guild_id}" class="btn btn-success w-75 mt-2">
                    <i class="bi bi-chat-dots-fill"></i> Open Chat
                  </a>`
                : ""
            }
          </div>
        </div>
      </div>
    </div>
  `;
}


////////////////////////////
// Fetch Guild Members for the Second Modal
////////////////////////////
  function fetchGuildMembers(guildId) {
    const url = `${currentUrl}/api/guilds/${guildId}`; // API endpoint for fetching guild members
    const currentUserId = getUserIdFromToken(); // Get the current user's ID
  
    fetchMethod(
      url,
      function (status, data) {
        console.log("Guild Members API Response:", status, data);
  
        if (status === 200) {
          // Populate the Guild Members Modal
          if (data.members.length === 0) {
            guildMembersList.innerHTML = `
              <li class="list-group-item text-center">
                <i class="bi bi-emoji-frown text-warning" style="font-size: 2rem;"></i>
                <p class="mt-2">No members in this guild yet. Be the first to join! 🚀</p>
              </li>
            `;
          } else {
            guildMembersList.innerHTML = data.members
              .map((member) => {
                const isCurrentUser = member.user_id === currentUserId; // Checks if this member is the current user
                return `
                  <li class="list-group-item ${isCurrentUser ? "bg-info text-white fw-bold" : ""}">
                    <i class="bi bi-person-fill ${isCurrentUser ? "text-dark" : "text-info"}"></i> 
                    ${member.username} ${isCurrentUser ? "(You)" : ""} - 
                    <span class="${isCurrentUser ? "text-dark" : "text-success"}">${member.skillpoints} Skillpoints</span>
                  </li>
                `;
              })
              .join(""); // Join array of strings into a single HTML string
          }
        } else {
          createErrorToast(data.message || "Failed to fetch members. Please try again.");
        }
      },
      "GET"
    );
  }  
  

  ////////////////////////////
  // Attach Events to Join Buttons
  ////////////////////////////
  function attachJoinButtonEvents() {
    const joinButtons = document.querySelectorAll(".join-guild-btn");
    joinButtons.forEach((button) => {
      button.addEventListener("click", function () {
        populateDetailsModal(button);
      });
    });
  }

////////////////////////////
// Fetch User's Current Guild
////////////////////////////
function fetchUserGuild(callback) {
  const url = `${currentUrl}/api/users/${getUserIdFromToken()}`; // API endpoint to fetch user's details

  fetchMethod(
    url,
    function (status, data) {
      if (status === 200) {
        const userGuild = data["User's Guild"] || null; // Extract user's guild or null
        const userId = getUserIdFromToken(); // Extract userId from token
        callback(userGuild, userId); // Pass user guild and userId to callback
      } else {
        createErrorToast("Failed to fetch user details. Please log in!");
        callback(null, null); // Proceed with null if user guild or userId cannot be fetched
      }
    },
    "GET"
  );
}

////////////////////////////
// Populate Details Modal (First Modal)
////////////////////////////
function populateDetailsModal(button) {
  const guildId = button.getAttribute("data-guild-id");
  const guildName = button.getAttribute("data-guild-name");
  const guildDescription = button.getAttribute("data-guild-description");
  const guildMembers = button.getAttribute("data-guild-members");
  const guildSkillPoints = button.getAttribute("data-guild-skillpoints");

  // Using fetchUserGuild to get the user's current guild (Modularity!!)
  fetchUserGuild(function (userGuild) {
    // Populate the Details Modal content
    modalGuildName.textContent = guildName;
    modalGuildDescription.textContent = guildDescription;

    // Display member count and total skill points
    if (parseInt(guildMembers, 10) === 0) {
      modalGuildMembers.innerHTML = `
        <li class="list-group-item text-center">
          <i class="bi bi-emoji-frown text-warning" style="font-size: 2rem;"></i>
          <p class="mt-2">No members yet. Be the first to join this guild! 🚀</p>
        </li>
      `;
      viewMembersButton.style.display = "none"; // Hide the View Members button if no members
    } else {
      modalGuildMembers.innerHTML = `
        <li class="list-group-item">
          <i class="bi bi-people-fill text-success"></i> ${guildMembers} Members
        </li>
        <li class="list-group-item">
          <i class="bi bi-stars text-warning"></i> ${guildSkillPoints} Skillpoints
        </li>
      `;
      viewMembersButton.style.display = "inline-block"; // Show the View Members button if members exist
    }

    // Attach event to View Members Button to load members in the second modal
    viewMembersButton.onclick = function () {
      fetchGuildMembers(guildId);
    };

    // Toggle Join and Leave buttons based on user's guild!
    if (userGuild === guildName) {
      joinGuildButton.classList.add("d-none"); // Hide the Join Guild button
      leaveGuildButton.classList.remove("d-none"); // Show the Leave Guild button
      leaveGuildButton.onclick = function () {
        leaveGuild(guildId, guildName);// leaveGuild function
      };
    } else {
      leaveGuildButton.classList.add("d-none"); // Hide the Leave Guild button
      joinGuildButton.classList.remove("d-none"); // Show the Join Guild button
      joinGuildButton.onclick = function () {
        joinGuild(guildId, guildName); // joinGuild function
      };
    }
  });
}



  ////////////////////////////
  // Initialise Guilds on Page Load
  ////////////////////////////
  fetchUserGuild(function (userGuild, userId) {
    loadGuilds(userGuild, userId); // Load guilds with user's current guild info and userId
  });

});
