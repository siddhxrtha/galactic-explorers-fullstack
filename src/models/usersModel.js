//////////////////////////////////////////////////////
// IMPORT REQUIRED SERVICES
//////////////////////////////////////////////////////
const pool = require('../services/db');

//////////////////////////////////////////////////////
// POST /users - INSERT A NEW USER
//////////////////////////////////////////////////////
module.exports.createUser = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO User (username, email, password, skillpoints)
    VALUES (?, ?, ?, 0);
  `;
  const VALUES = [data.username, data.email, data.password];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

//////////////////////////////////////////////////////
// POST /register - CHECK IF USERNAME EXISTS (MIDDLEWARE)
//////////////////////////////////////////////////////
module.exports.checkUsernameExists = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM user WHERE username = ?;
  `;
  const VALUES = [data.username];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

//////////////////////////////////////////////////////
// GET /users - FETCH ALL USERS
//////////////////////////////////////////////////////
module.exports.selectAllUsers = (callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM user;
  `;

  pool.query(SQLSTATEMENT, callback);
};

//////////////////////////////////////////////////////
// PUT /users/{user_id} - UPDATE USER DETAILS
//////////////////////////////////////////////////////
module.exports.updateUser = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE User 
    SET username = ?, email = ?
    WHERE user_id = ?;
  `;
  const VALUES = [data.username, data.email, data.id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

//////////////////////////////////////////////////////
// GET /users/leaderboard - FETCH LEADERBOARD
//////////////////////////////////////////////////////
module.exports.selectLeaderboard = (callback) => {
  const SQLSTATEMENT = `
    SELECT
      User.user_id AS "User ID",
      User.username AS "Username",
      COUNT(ExplorationLog.planet_id) AS "Planets Explored"
    FROM User
    LEFT JOIN ExplorationLog ON User.user_id = ExplorationLog.user_id
    GROUP BY User.user_id
    ORDER BY COUNT(ExplorationLog.planet_id) DESC
    LIMIT 10;
  `;

  pool.query(SQLSTATEMENT, callback);
};

//////////////////////////////////////////////////////
// GET /users/{user_id} - FETCH USER DETAILS WITH GUILD INFO
//////////////////////////////////////////////////////
module.exports.getUserDetailsWithGuild = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT 
      User.user_id, 
      User.username, 
      User.email, 
      User.skillpoints, 
      IFNULL(Guilds.guild_name, 'No guild joined yet!') AS guild_name,
      IFNULL(Guilds.guild_id, NULL) AS guild_id 
    FROM 
      User
    LEFT JOIN 
      GuildMembers ON User.user_id = GuildMembers.user_id
    LEFT JOIN 
      Guilds ON GuildMembers.guild_id = Guilds.guild_id
    WHERE 
      User.user_id = ?;
  `;
  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


//////////////////////////////////////////////////////
// POST /api/register - CHECK IF EMAIL EXISTS
//////////////////////////////////////////////////////
module.exports.selectByEmail = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM User
    WHERE email = ?;
  `;
  const VALUES = [data.email];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


///////////////////////////////////////////////////////////////////////////////////
// POST /api/login - SELECTS USERS BASED ON GIVEN USERNAME INPUT TO CHECK EXISTENCE
///////////////////////////////////////////////////////////////////////////////////
module.exports.selectByUsername = (data, callback) => {
  const SQLSTATEMENT = `
      SELECT * FROM User WHERE username = ?;
  `;
  const VALUES = [data.username];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

//////////////////////////////////////////////////////
// MIDDLEWARE: CHECK IF USERNAME EXISTS FOR UPDATE
//////////////////////////////////////////////////////
module.exports.checkUsernameExistsForUpdate = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM User
    WHERE username = ?
      AND user_id != ?;
  `;
  const VALUES = [data.username, data.user_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};


//////////////////////////////////////////////////////
// MODEL: CHECK IF EMAIL EXISTS FOR UPDATE
//////////////////////////////////////////////////////
module.exports.checkEmailExistsForUpdate = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM User
    WHERE email = ?
      AND user_id != ?;
  `;
  const VALUES = [data.email, data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

//////////////////////////////////////////////////////
// DELETE /users/{user_id} - DELETE A USER AND RELATED DATA
//////////////////////////////////////////////////////
module.exports.deleteUser = (data, callback) => {
  const SQLSTATEMENT = `
    -- Remove all members from the user's owned guilds before deleting the guild!
    DELETE FROM GuildMembers WHERE guild_id IN (SELECT guild_id FROM Guilds WHERE user_id = ?);
    
    -- Delete user's completion records
    DELETE FROM UserCompletion WHERE user_id = ?;
    
    -- Delete fitness challenges created by the user
    DELETE FROM FitnessChallenge WHERE creator_id = ?;
    
    -- Delete user's reviews
    DELETE FROM Reviews WHERE user_id = ?;
    
    -- Delete user's guild memberships
    DELETE FROM GuildMembers WHERE user_id = ?;
    
    -- Delete user's owned guilds (cascade deletes members first)
    DELETE FROM Guilds WHERE user_id = ?;
    
    -- Delete user's marketplace inventory
    DELETE FROM Inventory WHERE user_id = ?;

    -- Delete user's exploration logs
    DELETE FROM ExplorationLog WHERE user_id = ?;

    -- Delete user's messages in the guild chat
    DELETE FROM GuildMessages WHERE user_id = ?;

    -- Finally, delete the user account!
    DELETE FROM User WHERE user_id = ?;
  `;

  const VALUES = [
    data.user_id, data.user_id, data.user_id, 
    data.user_id, data.user_id, data.user_id, 
    data.user_id, data.user_id, data.user_id,
    data.user_id
  ];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

