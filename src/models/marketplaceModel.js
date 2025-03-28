const pool = require('../services/db');

// POST /marketplace (To allow addition of new items to shop!) {createNewItem} [ADMINS ONLY]

// Checks if item in request already exists in The Galactic Marketplace (Middleware)
module.exports.checkItemExists = (data, callback) =>
  {
    const SQLSTATMENT = `
      SELECT * FROM Marketplace WHERE item_name = ?;
    `;
    const VALUES = [data.item_name];
  
    pool.query(SQLSTATMENT, VALUES, callback);
  }

// Adds new item to marketplace
module.exports.addItem = (data, callback) =>
  {
      const SQLSTATMENT = `
      INSERT INTO Marketplace (item_name, item_description, item_type, cost)
      VALUES (?, ?, ?, ?);
      `;
    const VALUES = [data.item_name, data.item_description, data.item_type, data.cost];
  
    pool.query(SQLSTATMENT, VALUES, callback);
  }


// GET /marketplace (To allow users to check out the items for sale at The Galactic Marketplace!) 

// Selects all the items in The Galactic Marketplace to display!
module.exports.getMarketplace = (callback) =>
  {
    const SQLSTATMENT = `
    SELECT * FROM Marketplace;
    `;
  
    pool.query(SQLSTATMENT, callback);
  }


// GET /marketplace/{item_type} (To allow users to filter out the items for sale at The Galactic Marketplace!)

// Selects items by type in The Galactic Marketplace to display!
module.exports.selectMarketplaceByType = (data, callback) =>
  {
    const SQLSTATMENT = `
      SELECT * FROM Marketplace WHERE item_type = ?;
    `;
    const VALUES = [data.item_type];
  
    pool.query(SQLSTATMENT, VALUES, callback);
  }


// POST /marketplace/buy (To allow users to buy items from The Galactic Marketplace)

// Middleware to check if user_id or item_id provided exists (Checking if user or item exists)
module.exports.checkUserItemExists = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT *
    FROM user
    JOIN marketplace ON marketplace.item_id = ? 
    WHERE user.user_id = ?;
  `;
  
  const VALUES = [data.item_id, data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Check if user already owns the item before initiating a purchase!
module.exports.checkInventoryExists = (data, callback) => {
  const SQLSTATEMENT = `
    select * from inventory where user_id = ? and item_id = ?;
  `;
  
  const VALUES = [data.user_id, data.item_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Handles buying logic & update users new skillpoints after purchase!
module.exports.updateSkillpoints = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE user
    SET skillpoints = ?
    WHERE user_id = ?;
  `;
  
  const VALUES = [data.updatedSkillpoints, data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Inserts purchased item into inventory!
module.exports.insertInventory = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO Inventory (user_id, item_id, item_name, item_description, item_type) 
    VALUES (?, ?, ?, ?, ?);
  `;
  
  const VALUES = [data.user_id, data.item_id, data.userItemName, data.userItemDesc, data.userItemType];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Deletes inventory with given user_id and item_id
module.exports.deleteInventory = (data, callback) => {
  const SQLSTATEMENT = `
  DELETE FROM Inventory
  WHERE user_id = ? AND item_id = ?;
  `;
  
  const VALUES = [data.user_id, data.item_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};