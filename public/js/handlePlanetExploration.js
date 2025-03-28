document.addEventListener("DOMContentLoaded", function () {
  setupExploreButtonHandlers(); // Set up "Explore Now" button handlers
});

//////////// Setup "Explore Now" Button Handlers ////////////
function setupExploreButtonHandlers() {
  const exploreButtons = document.querySelectorAll(".explore-btn");

  exploreButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const planetId = this.dataset.id;
      const planetName = this.dataset.name;
      const planetDescription = this.dataset.description;
      const rewardSkillpoints = this.dataset.reward;
      const planetImage = this.dataset.image;
      const requiredItems = this.dataset.items;

      // Populate modal content
      document.getElementById("modalPlanetName").textContent = planetName;
      document.getElementById("modalPlanetNameLarge").textContent = planetName;
      document.getElementById("modalPlanetDescription").textContent = planetDescription;
      document.getElementById("modalRewardSkillpoints").textContent = rewardSkillpoints;
      document.getElementById("modalPlanetImage").src = planetImage;
      document.getElementById("modalRequiredItems").innerHTML = requiredItems;

      // Add a handler for the Explore Now button
      document.getElementById("exploreNowButton").onclick = function () {
        explorePlanet(planetId, planetName, rewardSkillpoints);
      };

      // Show the modal
      const exploreModal = new bootstrap.Modal(document.getElementById("exploreModal"));
      exploreModal.show();
    });
  });
}

//////////// Explore Planet ////////////
function explorePlanet(planetId, planetName, rewardSkillpoints) {
  const userId = getUserIdFromToken();
  const token = localStorage.getItem("token");

  if (!userId || !token) {
    createErrorToast("Please log in or register to begin exploring!");
    return;
  }

  const url = `${currentUrl}/api/explore/${planetId}`;
  const data = { user_id: userId };

  const exploreButton = document.getElementById("exploreNowButton");
  exploreButton.disabled = true;

  const callback = (status, response) => {
    if (status === 200) {
      // Success: Show success toast with planet name and reward skillpoints
      createSuccessToast(
        `🎉 Congratulations! You have successfully explored ${planetName} and earned a bonus reward of ${rewardSkillpoints} skillpoints.`
      );
      setTimeout(() => location.reload(), 3000);
    } else {
      // Failure: Show error toast and handle session expiration
      createErrorToast(response.message || "Failed to explore the planet.");
      exploreButton.disabled = false;
      checkStatusForRefresh(status, () => explorePlanet(planetId, planetName, rewardSkillpoints)); // Retry on token expiration
    }
  };

  // Call the API
  fetchMethod(url, callback, "POST", data, token);
}
