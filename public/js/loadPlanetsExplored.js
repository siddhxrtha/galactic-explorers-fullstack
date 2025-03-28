document.addEventListener("DOMContentLoaded", function () {
  loadPlanetsExplored(); // Load explored planets on page load
});

function loadPlanetsExplored() {
  ///////// Variables and Initial Setup /////////
  const userId = getUserIdFromToken(); // Fetch user ID from token
  const token = localStorage.getItem("token"); // Fetch JWT token
  const url = `${currentUrl}/api/explore/${userId}`; // API endpoint for explored planets (CA1)
  const planetsRow = document.getElementById("planets-row"); // Target row for planets

  ///////// Loading Spinner /////////
  planetsRow.innerHTML = `
    <div class="col text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;

  ///////// Fetch Data Callback /////////
  const callback = (status, data) => {
    console.log("Fetch Status:", status); // Log response status
    console.log("Fetch Data:", data); // Log response data

    ///////// Success Response (200) /////////
    if (status === 200) {
      planetsRow.innerHTML = ""; // Clear previous content

      ///////// No Planets Explored /////////
      if (data.length === 0) {
        planetsRow.innerHTML = `
          <div class="text-center text-muted">
            <i class="bi bi-emoji-smile fs-1 mb-2"></i>
            <p class="fs-5">You haven’t explored any planets yet. Start exploring now!</p>
            <a href="explore.html" class="btn btn-primary mt-3">Explore Now</a>
          </div>
        `;
        return;
      }

      ///////// Populate Planets Explored /////////
      data.forEach((planet) => {
        console.log("Planet Data:", planet); // Log each planet object
        const planetId = planet["Planet ID"]; // Extract planet ID
        const planetName = planet["Planet Name"]; // Extract planet name
        const explorationDate = planet["Exploration Date"]; // Extract exploration date
        const rewardSkillpoints = planet["Reward Skillpoints"]; // Extract reward skillpoints

        if (!planetId || !planetName) {
          console.error("Missing data for planet:", planet);
          return; // Skip this planet if data is incomplete
        }

        ///////// Create Planet Card /////////
        const planetCol = document.createElement("div");
        planetCol.className = "col-md-4 d-flex align-items-stretch";

        const planetCard = `
          <div class="card shadow-sm h-100">
            <img 
              src="https://cashmoneysid.sirv.com/Images/planets/planet_${planetId}.png" 
              class="card-img-top" 
              alt="${planetName}" 
              style="height: 250px; object-fit: cover;"
            />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${planetName}</h5>
              <p class="card-text mb-2">Explored on: ${explorationDate}</p>
              <p class="text-muted mb-3">Bonus Skillpoints: ${rewardSkillpoints}</p>
              <button 
                class="btn btn-primary mt-auto view-details-btn" 
                data-id="${planetId}" 
                data-name="${planetName}" 
                data-date="${explorationDate}" 
                data-reward="${rewardSkillpoints}" 
                data-bs-toggle="modal" 
                data-bs-target="#planetDetailsModal">
                View Details
              </button>
            </div>
          </div>
        `;

        planetCol.innerHTML = planetCard;
        planetsRow.appendChild(planetCol);
      });

      ///////// Attach Modal Event Listeners /////////
      document.querySelectorAll(".view-details-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const planetId = this.dataset.id;
          const planetName = this.dataset.name;
          const explorationDate = this.dataset.date;
          const rewardSkillpoints = this.dataset.reward;

          // Debugging logs to ensure values are passed correctly
          console.log("Planet Name (from dataset):", planetName);

          ///////// Populate Modal Details /////////
          document.getElementById("planetImage").src = `https://cashmoneysid.sirv.com/Images/planets/planet_${planetId}.png`;
          document.getElementById("planetName").textContent = planetName;
          document.getElementById("explorationDate").textContent = `Explored on: ${explorationDate}`;
          document.getElementById("rewardSkillpoints").textContent = `Bonus Skillpoints: ${rewardSkillpoints}`;
        });
      });
    } 
    ///////// No Planets Found (404) /////////
    else if (status === 404 && data.message === "No planets explored yet.") {
      planetsRow.innerHTML = `
        <div class="text-center text-muted">
          <i class="bi bi-emoji-smile fs-1 mb-2 text-warning"></i>
          <p class="fs-5 text-warning">You haven’t explored any planets yet. Start exploring now!</p>
          <a href="explore.html" class="btn btn-primary mt-1">Explore Now</a>
        </div>
      `;
    } 
    ///////// Error Response /////////
    else {
      console.error("Failed to load planets:", data.message || data);
      planetsRow.innerHTML = `
        <div class="text-center text-danger">
          <p class="fs-5">Error loading planets. Please try again later.</p>
        </div>
      `;
    }
  };

  ///////// API Call /////////
  fetchMethod(url, callback, "GET", null, token);
}
