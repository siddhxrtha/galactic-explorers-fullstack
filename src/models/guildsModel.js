const pool = require('../services/db');

// POST /guilds (Allows users to create guilds in GalacticExplorers!)

// Middleware to check if user_id exists before creating guild! (Selects all from user table to check if user_id exists)
module.exports.checkUserExists = (data, callback) =>
  {
      const SQLSTATMENT = `
      SELECT * FROM User
      WHERE user_id = ?;
      `;
      const VALUES = [data.user_id];
  
      pool.query(SQLSTATMENT, VALUES, callback);
  }
  
// Creates guild based off request from user!
module.exports.createGuild = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO Guilds (user_id, guild_name, guild_description)
    VALUES (?, ?, ?);
  `;
  const VALUES = [data.user_id, data.guild_name, data.guild_description];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Check if user has already created a guild
module.exports.checkUserGuildLimit = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM Guilds WHERE user_id = ?;
  `;
  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// GET /guilds (Allows users to view the guilds available in GalacticExplorers!)

// Selects all guilds and allows users to view
module.exports.selectAllGuilds = (callback) =>
  {
    const SQLSTATMENT = `
    SELECT 
    Guilds.guild_id, 
    Guilds.guild_name, 
    Guilds.guild_description, 
    COUNT(GuildMembers.member_id) AS member_count, 
    IFNULL(SUM(User.skillpoints), 0) AS total_skillpoints,
    Guilds.user_id AS creator_id,
    (SELECT username FROM User WHERE User.user_id = Guilds.user_id) AS creator_name
    FROM 
      Guilds
    LEFT JOIN 
      GuildMembers ON Guilds.guild_id = GuildMembers.guild_id
    LEFT JOIN 
      User ON GuildMembers.user_id = User.user_id
    GROUP BY 
      Guilds.guild_id;

    `;
    pool.query(SQLSTATMENT, callback);
  }

// POST /guilds/join (Allows a user to join an existing guild by providing their user_id and guild_id)

// Checks if user exists 
  module.exports.checkUserExistence = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM User WHERE user_id = ?
    `;
    const VALUES = [data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);

  };

// Checks if guild exists
module.exports.checkGuildExistence = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT * FROM Guilds WHERE guild_id = ?
  `;
  const VALUES = [data.guild_id];
  pool.query(SQLSTATEMENT, VALUES, callback);

};

// Checks if user is already in a guild!
module.exports.checkUserInGuild = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT * FROM GuildMembers WHERE user_id = ? ;
  `;
  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Adds user to the guild that user wishes to join!
module.exports.addUserToGuild = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO GuildMembers (user_id, guild_id) 
    VALUES (?, ?)
  `;
  const VALUES = [data.user_id, data.guild_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// POST /guilds/leave (Allows a user to leave a guild that they have joined by providing their user_id and the corresponding guild_id!)

// Deletes user records from guildMembers and successfully processes leave request!
module.exports.removeUserFromGuild = (data, callback) => {
  const SQLSTATEMENT = `
    DELETE FROM GuildMembers 
    WHERE user_id = ? AND guild_id = ?
  `;
  const VALUES = [data.user_id, data.guild_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Checks if user is inside the guild provided in req (Middleware)
module.exports.checkUserGuildMembership = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT * FROM GuildMembers WHERE user_id = ? and guild_id = ?;
  `;
  const VALUES = [data.user_id, data.guild_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// GET /guilds/{guild_id} (Fetches members in provided guild_id)

// Selects all the members from that guild provided
module.exports.getGuildMembers = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT User.user_id, User.username, User.skillpoints
    FROM GuildMembers
    JOIN User ON GuildMembers.user_id = User.user_id
    WHERE GuildMembers.guild_id = ?;
  `;
  const VALUES = [data.guild_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// DELETE /guilds (Allows user whom created guilds to delete a guild they own)

// Check if the user is the creator of the guild (Middleware)
module.exports.checkGuildCreator = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM Guilds WHERE guild_id = ? AND user_id = ?
  `;
  const VALUES = [data.guild_id, data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteGuild = (data, callback) => {
  const SQLSTATEMENT = `
    -- Delete all messages in the guild chat
    DELETE FROM GuildMessages WHERE guild_id = ?;

    -- Delete all members from the guild
    DELETE FROM GuildMembers WHERE guild_id = ?;

    -- Delete the guild itself
    DELETE FROM Guilds WHERE guild_id = ?; 
  `;

  const VALUES = [data.guild_id, data.guild_id, data.guild_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


/////////////////////////////
// Select Top 10 Guilds for Leaderboard
/////////////////////////////
module.exports.selectGuildLeaderboard = (callback) => {
  const SQLSTATEMENT = `
    SELECT 
      Guilds.guild_id,
      Guilds.guild_name,
      Guilds.guild_description,
      COUNT(ExplorationLog.planet_id) AS total_planets_explored,
      Guilds.user_id AS creator_id,
      (SELECT username FROM User WHERE User.user_id = Guilds.user_id) AS creator_name
    FROM Guilds
    LEFT JOIN GuildMembers ON Guilds.guild_id = GuildMembers.guild_id
    LEFT JOIN ExplorationLog ON GuildMembers.user_id = ExplorationLog.user_id
    GROUP BY Guilds.guild_id
    ORDER BY total_planets_explored DESC, Guilds.guild_name ASC
    LIMIT 10;
  `;

  pool.query(SQLSTATEMENT, callback);
};

/////////////////////////////////////////////////////////////////
// POST /guilds/:guild_id/messages - Send a message in the guild
/////////////////////////////////////////////////////////////////

// Inserts a new message into the GuildMessages table (Tried a different approach to get the username in the model)
module.exports.sendGuildMessage = (data, callback) => {
  const fetchUsernameQuery = `
    SELECT username FROM User WHERE user_id = ?;
  `;

  const insertMessageQuery = `
    INSERT INTO GuildMessages (guild_id, user_id, username, message_text) 
    VALUES (?, ?, ?, ?);
  `;

  // Fetch the username first
  pool.query(fetchUsernameQuery, [data.user_id], (error, results) => {
    if (error) {
      console.error("Error fetching username:", error);
      return callback(error, null);
    }

    if (results.length === 0) {
      return callback({ message: "User not found." }, null);
    }

    const username = results[0].username; // Extracts username

    // Now insert the message with the username
    pool.query(insertMessageQuery, [data.guild_id, data.user_id, username, data.message_text], callback);
  });
};


/////////////////////////////////////////////////////////////////
// GET /guilds/:guild_id/messages - Fetch all messages from a guild
/////////////////////////////////////////////////////////////////

// Fetch messages from a guild
module.exports.fetchGuildMessages = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT 
      GuildMessages.message_id,
      GuildMessages.guild_id,
      GuildMessages.user_id,
      User.username,
      GuildMessages.message_text,
      GuildMessages.sent_at
    FROM GuildMessages
    JOIN User ON GuildMessages.user_id = User.user_id
    WHERE GuildMessages.guild_id = ?
    ORDER BY GuildMessages.sent_at ASC;
  `;

  const VALUES = [data.guild_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

/////////////////////////////////////////////////////////////////
// DELETE /guilds/:guild_id/messages/:message_id - Delete a message
/////////////////////////////////////////////////////////////////

// Check if the user is the owner of the message before deletion
module.exports.checkMessageOwnership = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM GuildMessages
    WHERE message_id = ? AND user_id = ?;
  `;
  const VALUES = [data.message_id, data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Delete the message from the database
module.exports.deleteGuildMessage = (data, callback) => {
  const SQLSTATEMENT = `
    DELETE FROM GuildMessages WHERE message_id = ?;
  `;
  const VALUES = [data.message_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

/////////////////////////////////////////////////////////////////
// PUT /guilds/:guild_id/messages/:message_id - Update a message
/////////////////////////////////////////////////////////////////

// Updates a message in the database
module.exports.updateGuildMessage = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE GuildMessages 
    SET message_text = ?, sent_at = CURRENT_TIMESTAMP 
    WHERE message_id = ?;
  `;

  const VALUES = [data.message_text, data.message_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};