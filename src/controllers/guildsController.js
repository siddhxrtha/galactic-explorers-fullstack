const model = require("../models/guildsModel")

// POST /guilds (Allows users to create guilds in GalacticExplorers!)

// Middleware to check if user_id exists before creating guild!
module.exports.checkUserIdExists = (req, res, next) => {
  if(req.body.user_id == undefined || req.body.guild_name == undefined || req.body.guild_description == undefined) {
    res.status(400).json({
      message : "Missing required data: user_id, guild_name, or guild_description."
    })
    return;
  }

  const data = { 
    user_id : req.body.user_id 
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkUserIdExists:", error);
      return res.status(500).json({ error: "Internal Server Error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found! Guild cannot be created!" });
    }

    next();  
  };

  model.checkUserExists(data, callback);
};

// Middleware to check if user has already created a guild!
module.exports.checkUserGuildLimit = (req, res, next) => {
  const data = { user_id: req.body.user_id };

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkUserGuildLimit:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }

    // If the user has already created a guild
    if (results.length > 0) {
      return res.status(409).json({
        message: "You can only create one guild. Please delete your existing guild to create a new one!",
      });
    }

    next();
  };

  model.checkUserGuildLimit(data, callback);
};


// Creates guild based off request from user!
module.exports.createGuild = (req, res, next) => {
  const data = {
    user_id: req.body.user_id,
    guild_name: req.body.guild_name,
    guild_description: req.body.guild_description
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error creating guild:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    res.status(201).json({
      message: "Guild created successfully! 💫",
      guild_id: results.insertId,
      guild_name: data.guild_name,
    });
  };

  model.createGuild(data, callback);
};

// GET /guilds (Allows users to view the guilds available in GalacticExplorers!)

// Fetches all the guilds available to view for user!
module.exports.getAllGuilds = (req, res, next) =>
  {
    const callback = (error, results, fields) => {
      if (error) {
        console.error("Error getAllGuilds:", error);
        res.status(500).json({
          message : "Internal Server Error."
        });
      } else {
        res.status(200).json(results)
      }
    }
  
    model.selectAllGuilds(callback)
  }

// POST /guilds/join (Allows a user to join an existing guild by providing their user_id and guild_id)

// Middleware to check if user exists before proceeding to next step!
module.exports.checkUserExists = (req, res, next) => {
  if(req.body.user_id == undefined || req.body.guild_id == undefined) {
    res.status(400).json({
      message : "Missing required data: user_id or guild_id."
    })
    return;
  }

  const data = { 
    user_id: req.body.user_id 
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkUserExists:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }
    next();
  };

  model.checkUserExistence(data, callback);
};

// Middleware to check if guild exists before proceeding to next step!
module.exports.checkGuildExists = (req, res, next) => {
  const data = {
     guild_id: req.body.guild_id 
    };

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkGuildExists:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Guild not found!" });
    }
    next();
  };

  model.checkGuildExistence(data, callback);
};

// Middleware that checks if user is already in the guild!
module.exports.checkUserAlreadyInGuild = (req, res, next) => {
  const data = {
    user_id: req.body.user_id,
    guild_id: req.body.guild_id
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkUserAlreadyInGuild:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
    if (results.length > 0) {
      return res.status(409).json({ message: "You are already in a guild and can only join one!" });
    }
    else{
      next();
    }
  };

  model.checkUserInGuild(data, callback);
};

// Finally, Adds user to the guild succesfully!
module.exports.joinGuild = (req, res) => {
  const data = {
    user_id: req.body.user_id,
    guild_id: req.body.guild_id
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error joinGuild:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }

    res.status(200).json({
      message: "Successfully joined the guild!"
    });
  };

  model.addUserToGuild(data, callback);
};


// POST /guilds/leave (Allows a user to leave a guild that they have joined by providing their user_id and the corresponding guild_id!)

// Checks if user is a member of the guild before processing leave request (Middleware)
module.exports.checkMembership = (req, res, next) => {
  const data = {
    user_id: req.body.user_id,
    guild_id: req.body.guild_id
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkMembership:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
    if (results.length === 0) {
      return res.status(409).json({ message: "User is not a member of this guild!" });
    }
    else{
      next();
    }
  };

  model.checkUserGuildMembership(data, callback);
};

// Finally, allows user to leave the guild!
module.exports.leaveGuild = (req, res) => {
  const data = {
    user_id: req.body.user_id,
    guild_id: req.body.guild_id
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error leaveGuild:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }

    res.status(200).json({
      message: "Successfully left the guild!"
    });
  };

  model.removeUserFromGuild(data, callback);
};


// GET /guilds/{guild_id} (Fetches members in provided guild_id)

// Middleware that checks if guild_id given in web context exists
module.exports.checkGuildParamsExist = (req, res, next) => {
  const data = { 
    guild_id: req.params.guild_id
   };

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkGuildExists:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Guild not found!" });
    }
    next(); 
  };

  model.checkGuildExistence(data, callback);
};


// Fetches all the guild members from the guild_id provided
module.exports.getGuildMembers = (req, res, next) => {
  const data = { 
    guild_id: req.params.guild_id 
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error getGuildMembers:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No members found in this guild." });
    }
    res.status(200).json({
      message: "Guild members fetched successfully!",
      members: results,
    });
  };

  model.getGuildMembers(data, callback);
};

// DELETE /guilds (Allows user whom created guilds to delete a guild they own)

// Middleware to check if the user is the creator of the guild
module.exports.checkGuildCreator = (req, res, next) => {
  const data = {
    guild_id: req.body.guild_id,
    user_id: req.body.user_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkGuildCreator:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(403).json({ message: "Only the guild creator can delete the guild!" });
    }

    next();
  };

  model.checkGuildCreator(data, callback);
};

// Handles guild deletion
module.exports.deleteGuild = (req, res) => {
  const data = {
    guild_id: req.body.guild_id
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error deleteGuild:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    res.status(200).json({
      message: "Guild deleted successfully!",
    });
  };

  model.deleteGuild(data, callback);
};

/////////////////////////////
// GET /guilds/leaderboard
// Fetches leaderboard of guilds ranked by total planets explored
/////////////////////////////
module.exports.getGuildLeaderboard = (req, res, next) => {
  const callback = (error, results) => {
    if (error) {
      console.error("Error fetching guild leaderboard:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }

    res.status(200).json(results);
  };

  model.selectGuildLeaderboard(callback);
};

/////////////////////////////////////////////////////////////////////////////////////
// POST /guilds/:guild_id/messages - Send a message in the guild
/////////////////////////////////////////////////////////////////////////////////////

// Middleware to check if user is a member of the guild before sending a message
module.exports.checkMembershipByParams = (req, res, next) => {
  const data = {
    user_id: res.locals.userId, // Extract user_id from token
    guild_id: req.params.guild_id
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkMembershipByParams:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
    if (results.length === 0) {
      return res.status(403).json({ message: "User is not a member of this guild!" });
    }
    console.log("User is a valid guild member.");
    next();
  };

  model.checkUserGuildMembership(data, callback);
};





// Controller to send a message in the guild!!
module.exports.sendGuildMessage = (req, res) => {
  if (!req.params.guild_id || !req.body.message_text) {
    return res.status(400).json({ message: "Missing required data: guild_id or message_text." });
  }

  const data = {
    user_id: res.locals.userId, // Always uses the authenticated user's ID (from jwtMiddleware)
    guild_id: req.params.guild_id,
    message_text: req.body.message_text
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error sendGuildMessage:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }

    res.status(201).json({ message: "Message sent successfully! 🚀" });
  };

  model.sendGuildMessage(data, callback);
};

/////////////////////////////////////////////////////////////////////////////////////
// GET /guilds/:guild_id/messages - Fetch all messages from a guild
/////////////////////////////////////////////////////////////////////////////////////

// GET /guilds/:guild_id/messages - Fetch messages from a guild
module.exports.getGuildMessages = (req, res) => {
  const data = {
    guild_id: req.params.guild_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error fetching guild messages:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No messages found for this guild." });
    }

    res.status(200).json(results);
  };

  model.fetchGuildMessages(data, callback);
};

/////////////////////////////////////////////////////////////////////////////////////
// DELETE /guilds/:guild_id/messages/:message_id - Delete a message from the guild
/////////////////////////////////////////////////////////////////////////////////////

// Middleware to check if the user owns the message before deletion
module.exports.checkMessageOwnership = (req, res, next) => {
  const data = {
    user_id: res.locals.userId, // Extract user_id from token
    guild_id: req.params.guild_id,
    message_id: req.params.message_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkMessageOwnership:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
    if (results.length === 0) {
      return res.status(403).json({ message: "You can only delete your own messages!" });
    }
    next();
  };

  model.checkMessageOwnership(data, callback);
};

// Controller to delete the message
module.exports.deleteGuildMessage = (req, res) => {
  const data = {
    message_id: req.params.message_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error deleteGuildMessage:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }

    res.status(200).json({ message: "Message deleted successfully! 🗑️" });
  };

  model.deleteGuildMessage(data, callback);
};

/////////////////////////////////////////////////////////////////////////////////////
// PUT /guilds/:guild_id/messages/:message_id - Edit a message in the guild
/////////////////////////////////////////////////////////////////////////////////////

// Controller to update the message in the database
module.exports.updateGuildMessage = (req, res) => {
  if (!req.body.message_text) {
    return res.status(400).json({ message: "Missing required data: message_text." });
  }

  const data = {
    message_id: req.params.message_id,
    message_text: req.body.message_text,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error updateGuildMessage:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Message not found or no changes made." });
    }

    res.status(200).json({ message: "Message updated successfully! ✏️" });
  };

  model.updateGuildMessage(data, callback);
};
