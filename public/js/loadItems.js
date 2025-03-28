document.addEventListener("DOMContentLoaded", function () {
  loadItems();
});

function loadItems() {
  ///////////////////////////////////////
  // DOM References
  ///////////////////////////////////////
  const itemRow = document.getElementById("marketplace-items");
  const loadingScreen = document.getElementById("loading-screen");

  ///////////////////////////////////////
  // Show the Loading Screen
  ///////////////////////////////////////
  loadingScreen.classList.add("d-block");
  loadingScreen.classList.remove("d-none");

  ///////////////////////////////////////
  // Fetch Inventory and Marketplace Data
  ///////////////////////////////////////
  const userId = getUserIdFromToken();
  fetchMethod(`${currentUrl}/api/inventory/${userId}`, (inventoryStatus, inventoryData) => {
    if (inventoryStatus !== 200) {
      console.error("Failed to fetch inventory data:", inventoryData);
      itemRow.innerHTML = `<p class="text-center text-danger">Failed to load items. Please try again later.</p>`;
      loadingScreen.classList.remove("d-block");
      loadingScreen.classList.add("d-none");
      return;
    }

    fetchMethod(`${currentUrl}/api/marketplace`, (marketplaceStatus, marketplaceData) => {
      if (marketplaceStatus !== 200) {
        console.error("Failed to fetch marketplace data:", marketplaceData);
        itemRow.innerHTML = `<p class="text-center text-danger">Failed to load items. Please try again later.</p>`;
        loadingScreen.classList.remove("d-block");
        loadingScreen.classList.add("d-none");
        return;
      }

      ///////////////////////////////////////
      // Process Marketplace Items
      ///////////////////////////////////////
      itemRow.innerHTML = "";

      const ownedItemIds = new Set(inventoryData.map((item) => item.item_id));

      marketplaceData.forEach((item) => {
        const isOwned = ownedItemIds.has(item.item_id);

        const itemCol = document.createElement("div");
        itemCol.className = "col-md-4 mb-4";

        const buttonHtml = isOwned
        ? `<button class="btn-buy owned w-100 mt-3 text-black" disabled>OWNED</button>`
        : `<button class="btn-buy btn-primary w-100 mt-3 text-white" onclick="buyItem(${item.item_id})">Buy Now</button>`;      

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
              <p class="fw-bold">Cost: ${item.cost} <span class="text-success">Skillpoints</span></p>
              ${buttonHtml}
            </div>
          </div>
        `;

        itemCol.innerHTML = itemCard;
        itemRow.appendChild(itemCol);
      });

      ///////////////////////////////////////
      // Hide the Loading Screen
      ///////////////////////////////////////
      loadingScreen.classList.remove("d-block");
      loadingScreen.classList.add("d-none");
    }, "GET");
  }, "GET");
}
