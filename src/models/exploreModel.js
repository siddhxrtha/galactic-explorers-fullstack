const pool = require('../services/db');

// GET /explore (Retrieves a list of all available planets for exploration for user to view!) 

// Selects all planets for user to view!
module.exports.selectAllPlanets = (callback) =>
  {
    const SQLSTATMENT = `
    SELECT * FROM Planets; 
    `;
  
    pool.query(SQLSTATMENT, callback);
  }

// POST /explore/{planet_id} (Allows user to explore a planet based on the planet ID and recieve skillpoints reward!)

// Selects all planet with the planet_id provided to check if valid planet_id
module.exports.checkPlanetExists = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM Planets WHERE planet_id = ?;
  `;
  
  const VALUES = [data.id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Selects all exploration logs with the user_id and planet_id provided to see if user has already explored planet!
module.exports.checkIfExplored = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM ExplorationLog WHERE user_id = ? AND planet_id = ?;
  `;
  
  const VALUES = [data.user_id, data.id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Selects required items for each planet and checks if user has required items in order to explore the planet
module.exports.checkRequiredItems = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT 
      Planets.required_items, 
      Inventory.item_id
    FROM Planets
    LEFT JOIN Inventory ON Inventory.user_id = ? 
      AND FIND_IN_SET(Inventory.item_id, Planets.required_items)
    WHERE Planets.planet_id = ?;
  `;

  const VALUES = [data.user_id, data.planet_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Insert exploration log to indicate user has completed exploration to that planet
module.exports.insertCompletion = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO ExplorationLog (user_id, planet_id) VALUES (?, ?);
  `;
  
  const VALUES = [data.user_id, data.id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Rewards skillpoints to user upon exploring Planet!
module.exports.rewardSkillpointsToUser = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE User
    SET skillpoints = skillpoints + (
      SELECT reward_skillpoints FROM Planets WHERE planet_id = ?
    )
    WHERE user_id = ?;

  `;
  
  const VALUES = [data.id, data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// GET /explore/{user_id} (Retreives the explored planets for user_id)

//Checks if provided user_id exists (Middleware)
module.exports.checkUserExistence = (data, callback) =>
  {
      const SQLSTATMENT = `
      SELECT * FROM User
      WHERE user_id = ?;
      `;
      const VALUES = [data.user_id];
  
      pool.query(SQLSTATMENT, VALUES, callback);
  }

// Selects explored planets using user_id for user.
module.exports.selectExploredPlanets = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT 
        Planets.planet_id AS "Planet ID", 
        Planets.planet_name AS "Planet Name", 
        ExplorationLog.exploration_date AS "Exploration Date", 
        Planets.reward_skillpoints AS "Reward Skillpoints"
    FROM ExplorationLog
    JOIN Planets ON ExplorationLog.planet_id = Planets.planet_id
    WHERE ExplorationLog.user_id = ?;
  `;
  
  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

