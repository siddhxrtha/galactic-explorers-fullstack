document.addEventListener("DOMContentLoaded", function () {
  setDefaultFilter(); // Set default filter to "All Items"
  loadInventory(); // Load all inventory items initially
  setupFilterDropdown(); // Setup filter dropdown functionality
});

///// Function to load inventory items /////
function loadInventory(itemType = null) {
  const token = localStorage.getItem("token");
  const inventoryRow = document.getElementById("item-row");

  // Check if user is logged in
  if (!token) {
    console.error("User not logged in. Cannot load inventory.");
    inventoryRow.innerHTML = `<p class="text-center text-danger">Please log in to view your inventory.</p>`;
    return;
  }

  // Construct the API endpoint URL
  const userId = getUserIdFromToken();
  if (!userId) {
    console.error("User ID not found. Ensure getUserIdFromToken() is working correctly.");
    inventoryRow.innerHTML = `<p class="text-center text-danger">Error loading inventory: Invalid user ID.</p>`;
    return;
  }

  const url = itemType
    ? `${currentUrl}/api/inventory/${userId}/${itemType}`
    : `${currentUrl}/api/inventory/${userId}`;

  console.log(`Fetching inventory from: ${url}`); // Debug log

  // Show loading spinner
  inventoryRow.innerHTML = `
    <div class="col text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;

  // Fetch inventory items
  const callback = (status, data) => {
    console.log(`API Response Status: ${status}`); // Debug log
    console.log(`API Response Data:`, data); // Debug log

    if (status === 200) {
      inventoryRow.innerHTML = ""; // Clear previous items

      if (data.length === 0) {
        inventoryRow.innerHTML = `<p class="text-center text-muted">No items found in your inventory.</p>`;
        return;
      }

      data.forEach((item) => {
        const inventoryCol = document.createElement("div");
        inventoryCol.className = "col-md-4";

        const inventoryCard = `
          <div class="card shadow-sm h-100">
            <img
              src="https://cashmoneysid.sirv.com/Images/items/item_${item.item_id}.png"
              class="card-img-top"
              alt="${item.item_name}"
            />
            <div class="card-body">
              <h5 class="card-title">${item.item_name}</h5>
              <p class="card-text">${item.item_description}</p>
              <p class="text-muted">Type: ${item.item_type}</p>
              <p class="text-muted">Acquired on: ${item.acquisition_date}</p>
              <button 
                class="btn-sell btn-danger w-100 mt-3" 
                data-id="${item.item_id}" 
                data-name="${item.item_name}" 
                data-cost="${item.cost}"
                data-image="https://cashmoneysid.sirv.com/Images/items/item_${item.item_id}.png"
              >
                Sell Now
              </button>
            </div>
          </div>
        `;

        inventoryCol.innerHTML = inventoryCard;
        inventoryRow.appendChild(inventoryCol);
      });

      setupSellButtonHandlers(); // Ensure sell button handlers are added
    } else {
      console.error("Failed to load inventory:", data.message || "Unknown error");
      inventoryRow.innerHTML = `<p class="text-center text-danger">Error loading inventory. Please try again later.</p>`;
    }
  };

  // Make API call using fetchMethod
  fetchMethod(url, callback, "GET", null, token);
}

///// Function to setup the filter dropdown /////
function setupFilterDropdown() {
  const filterDropdown = document.getElementById("itemTypeFilter");

  filterDropdown.addEventListener("change", function () {
    const selectedType = this.value;
    console.log(`Filter selected: ${selectedType}`); // Debug log
    loadInventory(selectedType === "all" ? null : selectedType); // Load inventory based on selected filter
  });
}

///// Function to set the default filter to "All Items" /////
function setDefaultFilter() {
  const filterDropdown = document.getElementById("itemTypeFilter");
  filterDropdown.value = "all"; // Set the dropdown to "All Items"
}
