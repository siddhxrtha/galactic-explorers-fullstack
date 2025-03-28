document.addEventListener("DOMContentLoaded", function () {
  loadItemsAndPlanets(); // Load items and planets on page load
});

function loadItemsAndPlanets() {
  const token = localStorage.getItem("token"); // Retrieve token
  const userId = getUserIdFromToken(); // Retrieve user ID

  const itemsUrl = `${currentUrl}/api/marketplace`; // API endpoint to fetch all items (CA1)
  const inventoryUrl = userId ? `${currentUrl}/api/inventory/${userId}` : null; // API endpoint to fetch user's inventory (only if logged in) (CA1)
  const planetsUrl = `${currentUrl}/api/explore`; // API endpoint to fetch planets (CA1)
  const exploredPlanetsUrl = userId ? `${currentUrl}/api/explore/${userId}` : null; // API endpoint to fetch explored planets for user (CA1)

  let itemMapping = {}; // To store item_id -> item_name mapping
  let userInventory = []; // To store user's inventory items
  let exploredPlanets = []; // To store user's explored planets

  showLoadingScreen();

  // Fetch items
  fetchMethod(itemsUrl, (itemStatus, itemData) => {
    if (itemStatus === 200) {
      // Map item IDs to item names
      itemMapping = itemData.reduce((acc, item) => {
        acc[item.item_id] = item.item_name;
        return acc;
      }, {});

      // Fetch user's inventory if logged in, otherwise fetch planets directly
      if (userId && inventoryUrl) {
        fetchMethod(inventoryUrl, (inventoryStatus, inventoryData) => {
          if (inventoryStatus === 200) {
            userInventory = inventoryData.map((item) => item.item_id); // Populate inventory
          } else {
            console.warn("Failed to load user inventory. Proceeding without inventory.");
          }

          // Fetch explored planets after inventory
          if (exploredPlanetsUrl) {
            fetchMethod(exploredPlanetsUrl, (exploredStatus, exploredData) => {
              if (exploredStatus === 200) {
                exploredPlanets = exploredData.map((planet) => planet["Planet ID"]); // Populate explored planets
              } else {
                console.warn("Failed to load explored planets. Proceeding without them.");
              }

              // Fetch planets after inventory and explored planets
              fetchPlanets(planetsUrl, itemMapping, userInventory, exploredPlanets);
            });
          } else {
            // Fetch planets if no explored planets endpoint
            fetchPlanets(planetsUrl, itemMapping, userInventory, null);
          }
        });
      } else {
        // Fetch planets if not logged in
        fetchPlanets(planetsUrl, itemMapping, null, null);
      }
    } else {
      console.error("Failed to load items:", itemData.message || itemData);
      createErrorToast("Failed to load marketplace items.");
      hideLoadingScreen();
    }
  });
}

function fetchPlanets(planetsUrl, itemMapping, userInventory, exploredPlanets) {
  const planetsRow = document.getElementById("planets-row");

  fetchMethod(planetsUrl, (status, data) => {
    hideLoadingScreen();

    if (status === 200) {
      planetsRow.innerHTML = "";

      if (data.length === 0) {
        planetsRow.innerHTML = `
          <div class="text-center text-muted">
            <p class="fs-5">No planets available for exploration at the moment.</p>
          </div>
        `;
        return;
      }

      // Populate planet cards
      data.forEach((planet) => {
        const requiredItems = planet.required_items
        ? planet.required_items.split(",").map((itemId) => {
            const itemName = itemMapping[itemId] || "Unknown Item";
            let tooltipText, iconClass;
        
            if (userInventory) {
              const hasItem = userInventory.includes(parseInt(itemId));
              iconClass = hasItem ? "✅" : "❌";
              tooltipText = hasItem
                ? "You have this item!"
                : "You need this item to explore!";
            } else {
              iconClass = "❓";
              tooltipText = "Login to check if you have this item!";
            }
          
            return `<span class="tooltip-item" data-bs-toggle="tooltip" title="${tooltipText}">
                      ${iconClass} ${itemName}
                    </span>`;
          })
        : ["None"];
        

        const isExplored = exploredPlanets && exploredPlanets.includes(planet.planet_id);

        const planetCard = `
          <div class="col-md-4">
            <div class="card shadow-sm h-100">
              <img
                src="https://cashmoneysid.sirv.com/Images/planets/planet_${planet.planet_id}.png"
                class="card-img-top"
                alt="${planet.planet_name}"
                style="max-height: 300px; object-fit: cover;"
              />
              <div class="card-body text-center">
                <h5 class="card-title fw-bold">${planet.planet_name}</h5>
                <p class="text-muted">${planet.planet_description}</p>
                <h6 class="fw-bold mt-3">Required Items:</h6>
                <ul class="list-unstyled text-muted"><li>${requiredItems.join("</li><li>")}</li></ul>
                <p class="text-muted mt-3">Bonus Skillpoints: ${planet.reward_skillpoints}</p>
                <button 
                  class="btn ${isExplored ? "btn-secondary" : "btn-primary"} explore-btn mt-2" 
                  ${isExplored ? "disabled" : ""}
                  data-id="${planet.planet_id}" 
                  data-name="${planet.planet_name}" 
                  data-description="${planet.planet_description}"
                  data-reward="${planet.reward_skillpoints}" 
                  data-image="https://cashmoneysid.sirv.com/Images/planets/planet_${planet.planet_id}.png"
                  data-items='<li>${requiredItems.join("</li><li>")}</li>'
                >
                  ${isExplored ? "Already Explored" : "Explore"}
                </button>
              </div>
            </div>
          </div>
        `;

        planetsRow.innerHTML += planetCard;
        
        // Initialised Bootstrap Tooltips!!
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl);
        });

      });

      setupExploreButtonHandlers();
    } else {
      console.error("Failed to load planets:", data.message || data);
      createErrorToast("Failed to load planets. Please try again later.");
    }
  });
}


function showLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    loadingScreen.style.display = "block";
  }
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    loadingScreen.style.display = "none";
  }
}

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
        console.log(`Exploring planet: ${planetName} with ID: ${planetId}`);
        explorePlanet(planetId);
      };

      // Show the modal
      const exploreModal = new bootstrap.Modal(document.getElementById("exploreModal"));
      exploreModal.show();
    });
  });
}
