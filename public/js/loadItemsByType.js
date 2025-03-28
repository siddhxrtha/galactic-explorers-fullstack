document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.getElementById("itemTypeFilter");
  const itemsContainer = document.getElementById("marketplace-items");
  const loadingScreen = document.getElementById("loading-screen");

  // Event listener for dropdown change
  dropdown.addEventListener("change", function () {
    const selectedType = dropdown.value;

    // Show the loading screen while fetching data
    loadingScreen.classList.remove("d-none");
    loadingScreen.classList.add("d-block");

    // Determining the API endpoint
    const url =
      selectedType === "all"
        ? `${currentUrl}/api/marketplace`
        : `${currentUrl}/api/marketplace/${selectedType}`;

    // Fetch items from the server
    fetchMethod(url, (status, data) => {
      // Hide the loading screen
      loadingScreen.classList.remove("d-block");
      loadingScreen.classList.add("d-none");

      if (status === 200) {
        // Clear existing items
        itemsContainer.innerHTML = "";

        // Populate the container with filtered items
        data.forEach((item) => {
          const itemCol = document.createElement("div");
          itemCol.className = "col-md-4 mb-4";

          const itemCard = `
            <div class="card h-100">
              <img  
                src="https://cashmoneysid.sirv.com/Images/items/item_${item.item_id}.png" 
                class="card-img-top" 
                alt="${item.item_name}">
              <div class="card-body">
                <h5 class="card-title">${item.item_name}</h5>
                <p class="card-text">${item.item_description}</p>
                <p class="text-muted">Type: <strong>${item.item_type}</strong></p>
                <p class="fw-bold">Cost: ${item.cost} Skillpoints</p>
                <button class="btn-buy btn-primary w-100 mt-3" onclick="buyItem(${item.item_id})">Buy Now</button>
              </div>
            </div>
          `;

          itemCol.innerHTML = itemCard;
          itemsContainer.appendChild(itemCol);
        });
      } else if (status === 404) {
        itemsContainer.innerHTML = `
          <p class="text-center text-danger">No items found for the selected type.</p>
        `;
      } else {
        console.error("Failed to fetch marketplace items:", data);
        itemsContainer.innerHTML = `
          <p class="text-center text-danger">Failed to load items. Please try again later.</p>
        `;
      }
    });
  });

  // Trigger initial load (default "All Items") --> This is to ensure by default "All items" are loaded
  dropdown.dispatchEvent(new Event("change"));
});
