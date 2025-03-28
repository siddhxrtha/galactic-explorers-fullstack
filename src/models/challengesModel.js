const pool = require('../services/db');

// POST /challenges (Task 4)

// Creates a new challenge
module.exports.createChallenge = (data, callback) =>
  {
      const SQLSTATMENT = `
      INSERT INTO FitnessChallenge (creator_id, challenge, skillpoints)
      VALUES (?, ?, ?);
      `;
    const VALUES = [data.user_id, data.challenge, data.skillpoints];
  
    pool.query(SQLSTATMENT, VALUES, callback);
  }


// GET /challenges (TASK 5)

// Fetches all challenges to display in correct order
module.exports.selectAllChallenges = (callback) =>
  {
    const SQLSTATMENT = `
    SELECT challenge_id, challenge, creator_id, skillpoints FROM FitnessChallenge; 
    `;
  
    pool.query(SQLSTATMENT, callback);
  }

// PUT /challenges/{challenge_id} (TASK 6)

// Middleware function to check if challenge exists
module.exports.checkChallenge = (data, callback) =>
  {
    const SQLSTATMENT = `
      SELECT * 
      FROM FitnessChallenge 
      WHERE challenge_id = ?;
    `;
    const VALUES = [data.id];
  
    pool.query(SQLSTATMENT, VALUES, callback);
  }

// Middleware that checks if creator_id matches user_id 
module.exports.checkCreatorId = (data, callback) =>
  {
    const SQLSTATMENT = `
      SELECT FitnessChallenge.creator_id, User.user_id
      FROM FitnessChallenge
      JOIN User ON FitnessChallenge.creator_id = User.user_id
      WHERE FitnessChallenge.challenge_id = ? AND User.user_id = ?;

    `;
    const VALUES = [data.id, data.user_id];
  
    pool.query(SQLSTATMENT, VALUES, callback);
  }

// Updates challenge with given request
module.exports.updateChallengeById = (data, callback) =>
  {
    const SQLSTATMENT = `
    UPDATE FitnessChallenge 
    SET challenge = ?, skillpoints = ?
    WHERE challenge_id = ?; 
    `;
    const VALUES = [data.challenge, data.skillpoints, data.id];
  
    pool.query(SQLSTATMENT, VALUES, callback);
  }

// DELETE /challenges/{challenge_id} (TASK 7)

// Deletes challenge by ID provided in web context
  module.exports.deleteById = (data, callback) =>
    {
      const SQLSTATMENT = `
      DELETE FROM FitnessChallenge 
      WHERE challenge_id = ?;
      `;
      const VALUES = [data.id];
    
      pool.query(SQLSTATMENT, VALUES, callback);
    } 

// POST /challenges/{challenge_id} (TASK 8)

// Middleware to check if user_id or challenge_id requested exists
module.exports.checkUserChallenge = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT * 
    FROM FitnessChallenge
    WHERE FitnessChallenge.challenge_id = ?
      AND (? IS NULL OR EXISTS (
        SELECT 1 FROM User WHERE User.user_id = ?
      ));
  `;
  
  const VALUES = [data.id, data.user_id, data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Middleware to add skillpoints (Additional Requirement)
module.exports.setSkillpoints = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE User
    SET skillpoints = skillpoints + 
    (CASE WHEN ? = FALSE THEN 5 ELSE (SELECT skillpoints FROM FitnessChallenge WHERE challenge_id = ?) END)
    WHERE user_id = ?;
  `;
  
  const VALUES = [data.completed, data.id, data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Creates new completion record and inserts into UserCompletion table
module.exports.createCompletion = (data, callback) =>
  {
      const SQLSTATMENT = `
      INSERT INTO UserCompletion (challenge_id, user_id, completed, creation_date, notes)
      VALUES (?, ?, ?, ?, ?);
      `;
    const VALUES = [data.id, data.user_id, data.completed, data.creation_date, data.notes];
  
    pool.query(SQLSTATMENT, VALUES, callback);
  }


//GET /challenges/{challenge_id} (TASK 9) 

// Selects all the completion records in provided challenge_id
module.exports.readUsersByChallengeId = (data, callback) =>
  {
      const SQLSTATMENT = `
      SELECT user_id, completed, creation_date, notes FROM usercompletion
      WHERE challenge_id = ?;
      `;
      const VALUES = [data.id];
  
      pool.query(SQLSTATMENT, VALUES, callback);
  } 


// DELETE /challenges/{challenge_id}

module.exports.checkChallengeOwner = (data, callback) => {
    const SQLSTATEMENT = `
      SELECT creator_id
      FROM FitnessChallenge
      WHERE challenge_id = ? AND creator_id = ?;
    `;
    const VALUES = [data.id, data.user_id];
  
    pool.query(SQLSTATEMENT, VALUES, callback);
  };

// GET /challenges/user/{user_id} - Fetch total completed challenges for user

// Get count of completed challenges for a specific user
module.exports.getCompletedChallenges = (userId, callback) => {
  const SQLSTATEMENT = `
    SELECT COUNT(DISTINCT challenge_id) AS completed_count 
    FROM UserCompletion 
    WHERE user_id = ? AND completed = TRUE;
  `;

  const VALUES = [userId];
  pool.query(SQLSTATEMENT, VALUES, callback);
};
