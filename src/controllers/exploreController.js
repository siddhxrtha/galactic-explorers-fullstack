const model = require("../models/exploreModel")

// GET /explore (Retrieves a list of all available planets for exploration for user to view!) 

// Fetches all Planets for user to view.
module.exports.getAllPlanets = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error getAllPlanets:", error);
      res.status(500).json({
        error : "Internal server error."
      });
    } else {
      res.status(200).json(results)
    }
  }

  model.selectAllPlanets(callback)
}


// POST /explore/{planet_id} (Allows user to explore a planet based on the planet ID and recieve skillpoints reward!)

// Checks if planet exists and returns appropriate error message.
module.exports.checkPlanetExistence = (req, res, next) => {
  if (req.body.user_id == undefined) {
    res.status(400).json({
      message: "Missing user_id."
    })
    return;
  }

  const data = {
    id: req.params.planet_id
  }
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkPlanetExistence:", error);
      res.status(500).json({
        error: 'Internal Server Error'
      });
    }
    else {
      if (results.length == 0) {
        res.status(404).json({
          message: "Planet not found!"
        })
      }
      else {
        const rewardSkillpoints = results[0].reward_skillpoints
        req.rewardItem = {
          rewardSkillpoints : rewardSkillpoints
        }
        next();
      }
    }
  }
  model.checkPlanetExists(data, callback)
}

// Checks if user has already explored the planet and returns appropriate message to user!
module.exports.checkExploredLog = (req, res, next) => {
  const data = {
    id: req.params.planet_id,
    user_id : req.body.user_id
  }
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkExploredLog:", error);
      res.status(500).json({
        error: 'Internal Server Error'
      });
    }
    else {
      if (results.length > 0) {
        res.status(409).json({
          message: "Planet already explored. Try exploring a new planet!"
        })
      }
      else {
        next();
      }
    }
  }
  model.checkIfExplored(data, callback)
}

// Checks user's inventory if he has the required items to be eligible to explore Planet!
module.exports.checkInventoryForRequiredItems = (req, res, next) => {
  const data = {
    user_id: req.body.user_id,
    planet_id: req.params.planet_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkInventoryForRequiredItems:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0 || !results[0].required_items) {
      return res.status(404).json({ message: "Planet not found or no required items specified." });
    }

    const requiredItems = results[0].required_items ? results[0].required_items.split(',') : [];

    if (requiredItems.length === 0) {
      // No required items, proceeds to next middleware
      return next();
    }

    // Filter out null values and map item IDs
    const userItems = results
      .filter((item) => item.item_id !== null)
      .map((item) => item.item_id.toString());

    const hasAllItems = requiredItems.every((item) => userItems.includes(item));

    if (!hasAllItems) {
      return res.status(409).json({
        message: "You do not have the required items to explore this planet.",
      });
    }

    next();
  };

  model.checkRequiredItems(data, callback);
};

// Creates a new exploration log to indicate user has explored the planet!
module.exports.insertExplorationLog = (req, res, next) => {
  const data = {
    id : req.params.planet_id,
    user_id : req.body.user_id
  }

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error insertExplorationLog:", error);
      res.status(500).json({
        message: "Internal Server error."
      });
    }

    else {
      next();
    }
  }
  model.insertCompletion(data, callback);
}

// Rewards skillpoints to user upon completion of exploration!
module.exports.rewardSkillpoints = (req, res, next) => {
  const data = {
    id: req.params.planet_id,
    user_id : req.body.user_id
  }
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error rewardSkillpoints:", error);
      return res.status(500).json({
        error: 'Internal Server Error'
      });
    }
    else {
        res.status(200).json({
          message : "Exploration completed successfully!",
          reward_skillpoints : req.rewardItem.rewardSkillpoints
        })
    }
  }
  model.rewardSkillpointsToUser(data, callback)
}

// GET /explore/{user_id} (Retreives the explored planets for user_id)

//Checks if provided user_id exists and returns appropriate error message (Middleware)
module.exports.checkUserExists = (req, res, next) => {
  const data = { 
    user_id : req.params.user_id 
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkUserExists:", error);
      return res.status(500).json({ error: "Internal Server Error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found! Planets explored cannot be fetched!" });
    }

    next();  
  };

  model.checkUserExistence(data, callback);
};


// Fetches explored planets by user to display!
module.exports.getExploredPlanets = (req, res, next) => {
  const data = {
    user_id : req.params.user_id
  }
  const callback = (error, results, fields) => {
    if (results.length === 0) {
      return res.status(404).json({
        message: "No planets explored yet."
      });
    }
    if (error) {
      console.error("Error getExploredPlanets:", error);
      res.status(500).json({
        error : "Internal server error."
      });
    } else {
      res.status(200).json(results)
    }
  }

  model.selectExploredPlanets(data, callback)
}