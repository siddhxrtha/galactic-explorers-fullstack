const model = require("../models/inventoryModel")

// GET /inventory/{user_id} (Allows user to see his inventory after purchasing from marketplace by user_id) 

// Middleware to check if user_id exists
module.exports.checkUserIdExists = (req, res, next) => {
  const data = { 
    id: req.params.id 
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkUserIdExists:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found! Inventory cannot be fetched!" });
    }

    next();  
  };

  model.checkUserIdExistence(data, callback);
};


// Middleware to check if basic pack already in inventory to prevent duplicate insertion!
module.exports.checkInventory = (req, res, next) => {
  const data = { id: req.params.id };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkInventory:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
    // I applied boolean flags, to skip insertion if basic pack already exists (To avoid duplication)
    if (results.length > 0) {
      req.hasSurvivalPack = true;  
    } else {
      req.hasSurvivalPack = false; 
    }

    next();  
  };

  model.selectInventoryForPack(data, callback);
};


// Middleware to insert inventory record when user accesses the inventory/{user_id} web context
module.exports.createNewInventoryRecord = (req, res, next) => {
  if (req.hasSurvivalPack) {
    return next();  // If survival pack exists, skip insertion, and displays results!    
  }

  const data = {
     id: req.params.id 
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error createNewInventoryRecord:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }

    next();  
  };

  model.addNewInventoryRecord(data, callback);
};


// Lastly, Fetches inventory of user with provided user_id!
module.exports.readInventoryByUser = (req,res,next) => {
  const data = {
    id : req.params.id
  }
  const callback = (error,results,fields) => {
    if (error) {
      console.error("Error readInventoryByUser:", error);
      res.status(500).json({
        message : "Internal Server Error."
      });
    } else {
        res.status(200).json(results)
    }
  }
  model.selectInventoryByUserId(data,callback)
}



// GET /inventory/{user_id}/{item_type} (Allows easy view for users to filter their inventory by item_type)

// Selects inventory records by item_type
module.exports.readInventoryByType = (req, res, next) => {
  const data = {
    id: req.params.id,
    type: req.params.item_type
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readInventoryByType:", error);
      return res.status(500).json({
        message: "Internal Server Error."
      });
    }

    if (results.length == 0) {
      return res.status(404).json({
        message: "No such Item Type exists! Inventory cannot be fetched!"
      });
    }

    return res.status(200).json(results);
  };

  model.selectInventoryByType(data, callback);
};

