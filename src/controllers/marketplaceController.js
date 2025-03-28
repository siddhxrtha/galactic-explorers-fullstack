const model = require("../models/marketplaceModel")

// POST /marketplace (To allow addition of new items to shop!) {createNewItem} [ADMINS ONLY]

// Middleware that checks if item already exists in The Galactic Marketplace
module.exports.checkItemExistence = (req,res,next) => {
  const data = {
    item_name : req.body.item_name
  }

  const callback = (error,results,fields) => {
    if (error) {
      console.error("Error checkItemExistence:", error);
      res.status(500).json({
        message : 'Internal Server Error'
      });
    }
    else{ 
      if (results.length > 0) {
        return res.status(409).json({
          message: "Item already exists in The Galactic Marketplace"
        });
      }
      else{
        next();
      }
    }
  }
  model.checkItemExists(data,callback)
}

// Allows admins only to access and add new item to marketplace
module.exports.createNewItem = (req, res, next) => {

  const ADMIN_TOKEN = "supersecureadminkey123"; // Made an admin token, so only if this is included, user can add items!

  // Check for admin token
  if (!req.body.admin_token || req.body.admin_token !== ADMIN_TOKEN) {
    res.status(403).json({
      message: "You are NOT AUTHORISED to add items to the Galactic Marketplace!",
    });
    return;
  }

  if (
    req.body.item_name == undefined ||
    req.body.item_type == undefined ||
    req.body.cost == undefined
  ) {
    res.status(400).json({
      message: "Missing required data: item_name, item_type, or cost!",
    });
    return;
  }

  const data = {
    item_name: req.body.item_name,
    item_description: req.body.item_description,
    item_type: req.body.item_type,
    cost: req.body.cost,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error createNewItem:", error);
      res.status(500).json({
        message: "Internal Server Error.",
      });
    } else {
      res.status(201).json({
        item_id: results.insertId,
        message: "Item successfully added to The Galactic Marketplace.",
      });
    }
  };

  model.addItem(data, callback);
};


// GET /marketplace (To allow users to check out the items for sale at The Galactic Marketplace!)

// Fetches all the items in The Galactic Marketplace to display!
module.exports.readMarketplace = (req, res, next) =>
  {
    const callback = (error, results, fields) => {
      if (error) {
        console.error("Error readMarketplace:", error);
        res.status(500).json({
          message : "Internal Server Error."
        });
      } else {
        res.status(200).json(results)
      }
    }
  
    model.getMarketplace(callback)
  }

// GET /marketplace/{item_type} (To allow users to filter out the items for sale at The Galactic Marketplace!)

// Fetches filtered items in The Galactic Marketplace to display!
module.exports.readMarketplaceByType = (req,res,next) => {
  const data = {
    item_type : req.params.item_type
  }
  const callback = (error,results,fields) => {
    if (error) {
      console.error("Error readMarketplaceByType:", error);
      res.status(500).json(error);
    } else {
      if (results.length == 0 ) {
        res.status(404).json({
          message : "Item Type Not Found!"
        })
      }
      else {
        res.status(200).json(results) 
      }
    }
  }
  model.selectMarketplaceByType(data,callback)
}


// POST /marketplace/buy (To allow users to buy items from The Galactic Marketplace)

// Middleware to check if user_id and item_id is valid, and also if user has sufficent skillpoints to buy item!
module.exports.checkUserItemExistence = (req, res, next) => {
  if(req.body.user_id == undefined || req.body.item_id == undefined) {
    res.status(400).json({
      message : "Missing user_id or item_id."
    })
    return;
  }
  const data = {
    item_id: req.body.item_id,
    user_id: req.body.user_id
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkUserItemExistence:", error);
      res.status(500).json({
        message: "Internal server error while processing the purchase."
      });
    }

    if (results.length == 0) {
      res.status(404).json({
        message: "User or item not found in The Galactic Marketplace."
      });
    }
    else {
    // Retrieving user's skillpoints and the item cost
    const userSkillpoints = results[0].skillpoints;
    const itemCost = results[0].cost;

    // To use for inserting into inventory
    const itemName = results[0].item_name;
    const itemDesc = results[0].item_description;
    const itemType = results[0].item_type;
    
    if (userSkillpoints < itemCost) {
      return res.status(409).json({
        message: "Insufficient skillpoints to purchase this item."
      });
    }

    req.userItem = {
      skillpoints: userSkillpoints,
      cost: itemCost,
      itemName : itemName,
      itemDesc : itemDesc,
      type : itemType
    };
    next();  
  }
  };

  model.checkUserItemExists(data, callback);
};

// Check if user already owns the item before initiating a purchase!
module.exports.checkInventoryExists = (req, res, next) => {
  const data = {
    item_id: req.body.item_id,
    user_id: req.body.user_id
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkInventoryExists:", error);
      res.status(500).json({
        message: "Internal server error while processing the purchase."
      });
    }

    if (results.length > 0) {
      res.status(409).json({
        message: "User already owns this item. Please check Inventory!"
      });
    }
    else {
      next();
    }
  };

  model.checkInventoryExists(data, callback);
};


// Handles buying logic & update users new skillpoints after purchase!
module.exports.buyItem = (req,res,next) => {
  const data = {
    user_id: req.body.user_id,        
    item_id: req.body.item_id,        
    userSkillpoints: req.userItem.skillpoints,  // From middleware (user's current skillpoints)
    itemCost: req.userItem.cost         // From middleware (item's cost)
  };
  
   // Calculating the updated skillpoints after deducting the item cost
  const updatedSkillpoints = data.userSkillpoints - data.itemCost;

  // Updating the data object to contain updatedSkillpoints
  data.updatedSkillpoints = updatedSkillpoints

  const callback = (error,results,fields) => {
    if (error) {
      console.error("Error buyItem:", error);
      res.status(500).json({
        message : "Internal server error while updating skillpoints. "
      });
    } 
    else {
        next();
    }
  }
  model.updateSkillpoints(data,callback)
}


// Updates inventory with purchased item!
module.exports.updateInventory = (req,res,next) => {
  const data = {
    item_id: req.body.item_id,
    user_id: req.body.user_id,
    userSkillpoints: req.userItem.skillpoints,  // From middleware (user's current skillpoints)
    userItemName: req.userItem.itemName, // From middleware
    userItemDesc : req.userItem.itemDesc, // From middleware
    userItemType : req.userItem.type, // From middleware
    itemCost: req.userItem.cost // From middleware
  }
  const updatedSkillpoints = data.userSkillpoints - data.itemCost;
  const callback = (error,results,fields) => {
    if (error) {
      console.error("Error updateInventory:", error);
      res.status(500).json({
        message : "Internal server error."
      });
    }
    else{
        res.status(200).json({
          message: "Purchase successful!",
          item_bought : data.userItemName,
          remaining_skillpoints: updatedSkillpoints
        }) 
    }
  }
  model.insertInventory(data,callback);
} 

// POST /marketplace/sell (To allow users to sell items back to The Galactic Marketplace & get back their spent skillpoints)

// Middleware to check for user_id and item_id validity
module.exports.checkUserItemValidity = (req, res, next) => {
  if(req.body.user_id == undefined || req.body.item_id == undefined) {
    res.status(400).json({
      message : "Missing user_id or item_id."
    })
    return;
  }
  
  const data = {
    item_id: req.body.item_id,
    user_id: req.body.user_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkUserItemValidity:", error);
      res.status(500).json({
        message: "Internal server error while processing the sale."
      });
    }

    if (results.length == 0) {
      res.status(404).json({
        message: "Silly! You can't sell the Essential Survival Pack! It's a gift from us! 💛"
      });
    }
    else {
    // Retrieving user's skillpoints and the item cost
    const userSkillpoints = results[0].skillpoints;
    const itemCost = results[0].cost;
    const itemName = results[0].item_name;
    req.userItemSell = {
      userItemName : itemName,
      skillpoints: userSkillpoints,
      cost: itemCost
    };
    next();  
  }
  };

  model.checkUserItemExists(data, callback);
};


//Checking if user owns the item before sale
module.exports.checkItemOwnership = (req, res, next) => {
  const data = {
    item_id: req.body.item_id,
    user_id: req.body.user_id
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkItemOwnership:", error);
      res.status(500).json({
        message: "Internal server error while processing the sale."
      });
    }

    if (results.length == 0) {
      res.status(409).json({
        message: "User does not own the item! Sale failed!"
      });
    }
    else {
      next();
    }
  };

  model.checkInventoryExists(data, callback);
};


// Handles sale logic and updates skillpoints after sale
module.exports.sellItem = (req, res, next) => {
  const data = {
    user_id: req.body.user_id,
    item_id: req.body.item_id,
    userSkillpoints: req.userItemSell.skillpoints, // From middleware (user's current skillpoints)
    itemCost: req.userItemSell.cost, // From middleware (item's cost)
  };

  // Calculate the updated skillpoints (return half the item's cost)
  const refundAmount = Math.floor(data.itemCost / 2); // Use Math.floor to round down to the nearest whole number
  const updatedSkillpoints = data.userSkillpoints + refundAmount;

  // Update the data object to include the updated skillpoints and refund amount
  data.updatedSkillpoints = updatedSkillpoints;
  data.refundAmount = refundAmount;

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error sellItem:", error);
      res.status(500).json({
        message: "Internal server error while updating skillpoints.",
      });
    } else {
      next(); // Proceed to update the inventory after successfully updating skillpoints
    }
  };

  model.updateSkillpoints(data, callback);
};



// Updates inventory and removes item sold by user
module.exports.updateInventoryAfterSale = (req, res, next) => {
  const data = {
    item_id: req.body.item_id,
    user_id: req.body.user_id,
    userSkillpoints: req.userItemSell.skillpoints, // From middleware (user's current skillpoints)
    itemCost: req.userItemSell.cost, // From middleware (Item cost)
    refundAmount: Math.floor(req.userItemSell.cost / 2), // Refund half the item's cost
    itemName: req.userItemSell.userItemName,
  };
  const updatedSkillpoints = data.userSkillpoints + data.refundAmount;

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error updateInventoryAfterSale:", error);
      res.status(500).json({
        message: "Internal server error.",
      });
    } else {
      res.status(200).json({
        message: "Item sold successfully!",
        item_sold: data.itemName,
        refunded_skillpoints: data.refundAmount, // Return half the cost
        remaining_skillpoints: updatedSkillpoints,
      });
    }
  };

  model.deleteInventory(data, callback);
};
