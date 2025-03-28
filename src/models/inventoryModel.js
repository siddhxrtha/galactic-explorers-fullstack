const pool = require('../services/db');

// GET /inventory/{user_id} (Allows user to see his inventory after purchasing from marketplace by user_id) 

// Middleware for checking if user exists
module.exports.checkUserIdExistence = (data, callback) =>
  {
      const SQLSTATMENT = `
      SELECT * FROM User
      WHERE user_id = ?;
      `;
      const VALUES = [data.id];
  
      pool.query(SQLSTATMENT, VALUES, callback);
  }

// Middleware to check if basic pack already in inventory to prevent duplicate insertion!
module.exports.selectInventoryForPack = (data, callback) =>
  {
      const SQLSTATMENT = `
      SELECT * FROM Inventory WHERE user_id = ? AND item_name = 'Essential Survival Pack'
      `;
      const VALUES = [data.id];
  
      pool.query(SQLSTATMENT, VALUES, callback);
  }

// Middleware which adds new inventory record for each VALID user_id, with default survival pack as in "Galactic Explorers" 
module.exports.addNewInventoryRecord = (data, callback) =>
  {
      const SQLSTATMENT = `
      INSERT INTO Inventory (user_id, item_id, item_name, item_description, item_type)
      VALUES (?, 0, 'Essential Survival Pack', 'A basic survival pack containing essential items for space exploration.', 'Gear')
      `;
      const VALUES = [data.id];
  
      pool.query(SQLSTATMENT, VALUES, callback);
  }


// Selects inventory of user with provided user_id
module.exports.selectInventoryByUserId = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT 
      Inventory.item_id, 
      Inventory.item_name, 
      Inventory.item_description, 
      Inventory.item_type, 
      Inventory.acquisition_date,
      Marketplace.cost
    FROM Inventory
    LEFT JOIN Marketplace ON Inventory.item_id = Marketplace.item_id
    WHERE Inventory.user_id = ?;
  `;
  const VALUES = [data.id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};



// GET /inventory/{user_id}/{item_type} (Allows easy view for users to filter their inventory by item_type)

// Selects inventory of user with provided user_id and item_type
module.exports.selectInventoryByType = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT 
      Inventory.item_id, 
      Inventory.item_name, 
      Inventory.item_description, 
      Inventory.item_type, 
      Inventory.acquisition_date,
      Marketplace.cost
    FROM Inventory
    LEFT JOIN Marketplace ON Inventory.item_id = Marketplace.item_id
    WHERE Inventory.user_id = ? AND Inventory.item_type = ?;
  `;
  const VALUES = [data.id, data.type];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

