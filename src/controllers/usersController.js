//////////////////////////////////////////////////////
// IMPORT REQUIRED MODELS
//////////////////////////////////////////////////////
const model = require("../models/usersModel");

//////////////////////////////////////////////////////
// MIDDLEWARE: CHECK IF USERNAME EXISTS (POST /users)
//////////////////////////////////////////////////////
module.exports.checkUsernameExistence = (req, res, next) => {
  const data = { username: req.body.username };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkUsernameExistence:", error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: "Username already exists." });
    }

    next(); // Proceed if username doesn't exist
  };

  model.checkUsernameExists(data, callback);
};

//////////////////////////////////////////////////////
// CONTROLLER: CREATE NEW USER (POST /users)
//////////////////////////////////////////////////////
module.exports.createNewUser = (req, res, next) => {
  if (req.body.username === undefined) {
    return res.status(400).json({ message: "Missing username." });
  }

  const data = { username: req.body.username };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error createNewUser:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    res.status(201).json({
      user_id: results.insertId,
      username: req.body.username,
      skillpoints: 0,
    });
  };

  model.createUser(data, callback);
};

//////////////////////////////////////////////////////
// CONTROLLER: FETCH ALL USERS (GET /users)
//////////////////////////////////////////////////////
module.exports.getAllUsers = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error getAllUsers:", error);
      return res.status(500).json(error);
    }

    res.status(200).json(results);
  };

  model.selectAllUsers(callback);
};

//////////////////////////////////////////////////////
// CONTROLLER: UPDATE USER BY ID (PUT /users/{user_id})
//////////////////////////////////////////////////////
module.exports.updateUserById = (req, res, next) => {
  // Validate input to ensure username and email are provided
  if (req.body.username === undefined || req.body.email === undefined) {
    return res.status(400).json({ message: "Missing username or email." });
  }

  const data = {
    id: parseInt(req.params.id), // Extract user_id from request parameters
    username: req.body.username, // Extract new username from request body
    email: req.body.email,       // Extract new email from request body
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error updateUserById:", error);
      return res.status(500).json({ error: "Internal Server Error." });
    }

    if (results.affectedRows === 0) {
      // No rows affected, meaning user_id was not found
      return res.status(404).json({ message: "User not found!" });
    }

    // Success response with updated details
    res.status(200).json({
      message: "User details updated successfully!",
      updatedUser: data,
    });
  };

  // Calls model function to update user details
  model.updateUser(data, callback);
};

//////////////////////////////////////////////////////
// CONTROLLER: FETCH LEADERBOARD (GET /users/leaderboard)
//////////////////////////////////////////////////////
module.exports.getLeaderboard = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error getLeaderboard:", error);
      return res.status(500).json({ error: "Internal Server Error." });
    }

    res.status(200).json(results);
  };

  model.selectLeaderboard(callback);
};

//////////////////////////////////////////////////////
// CONTROLLER: FETCH USER DETAILS (GET /users/{user_id})
//////////////////////////////////////////////////////
module.exports.getUserDetails = (req, res, next) => {
  const data = { user_id: req.params.user_id };

  const callback = (error, results) => {
    if (error) {
      console.error("Error getUserDetails:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({
      "User ID": results[0].user_id,
      "Username": results[0].username,
      "Email": results[0].email,
      "Skillpoints": results[0].skillpoints,
      "User's Guild": results[0].guild_name,
      "User's Guild ID": results[0].guild_id || null,  // ✅ Append guild_id properly
    });
  };

  model.getUserDetailsWithGuild(data, callback);
};

//////////////////////////////////////////////////////
// MIDDLEWARE: CHECK IF EMAIL IS USED (POST /api/register)
//////////////////////////////////////////////////////
module.exports.checkIfEmailIsUsed = (req, res, next) => {
  if (!req.body.email) {
    return next();
  }

  const data = { email: req.body.email };

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkIfEmailIsUsed:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: "Email already exists." });
    }

    next(); // Proceed if email is not used
  };

  model.selectByEmail(data, callback);
};

//////////////////////////////////////////////////////
// CONTROLLER: REGISTER A NEW USER (POST /api/register)
//////////////////////////////////////////////////////
module.exports.registerUser = (req, res, next) => {
  if (
    req.body.username === undefined ||
    req.body.email === undefined ||
    req.body.password === undefined
  ) {
    return res.status(400).json({
      error: "Please ensure the request body contains a username, email, and password.",
    });
  }

  const data = {
    email: req.body.email,
    username: req.body.username,
    password: res.locals.hash, // Password hash from bcrypt middleware
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error registerUser:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.locals.userId = results.insertId; // Store user ID for token generation
    res.locals.message = `User ${req.body.username} created successfully.`;
    next(); // Proceed to generate tokens
  };

  model.createUser(data, callback);
};

//////////////////////////////////////////////////////
// CONTROLLER: HANDLES LOGIN LOGIC (POST /api/login)
//////////////////////////////////////////////////////
module.exports.loginUser = (req, res, next) => {
  // Checks if username or password are missing
  if (!req.body.username || !req.body.password) {
      return res.status(400).json({
          Error: "Username or password is missing"
      });
  }

  const data = {
      username: req.body.username
  };

  const callback = (error, results) => {
      if (error) {
          console.error("Error login:", error);
          return res.status(500).json({
              Error: "Internal Server Error"
          });
      }

      // If no user is found, sends a '404' error
      if (results.length === 0) {
          return res.status(404).json({
              message: "User Not Found. Please Register!"
          });
      }

      // Store relevant user data (userId, password hash) in res.locals for the next middleware to use!
      res.locals.userId = results[0]["user_id"];
      res.locals.hash = results[0]["password"];

      next();
  };

  model.selectByUsername(data, callback);
};

//////////////////////////////////////////////////////
// MIDDLEWARE: CHECK IF USERNAME EXISTS FOR UPDATE
//////////////////////////////////////////////////////
module.exports.checkUsernameExistenceForUpdate = (req, res, next) => {
  // Skip if no username provided (i.e., user not updating username)
  if (!req.body.username) {
    return next();
  }

  const data = {
    username: req.body.username,
    user_id: parseInt(req.params.id), // Exclude the current user
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkUsernameExistenceForUpdate:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // If another user has this username, it's a conflict
    if (results.length > 0) {
      return res.status(409).json({ message: "Username already exists." });
    }

    next(); // Proceed if username is valid for the current user
  };

  model.checkUsernameExistsForUpdate(data, callback);
};

//////////////////////////////////////////////////////
// MIDDLEWARE: CHECK IF EMAIL IS USED FOR UPDATE
//////////////////////////////////////////////////////
module.exports.checkIfEmailIsUsedForUpdate = (req, res, next) => {
  // Skip if no email is being updated
  if (!req.body.email) {
    return next();
  }

  const data = {
    email: req.body.email,
    user_id: parseInt(req.params.id), // Current user
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkIfEmailIsUsedForUpdate:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (results.length > 0) {
      return res.status(409).json({ message: "Email already in use." });
    }
    next();
  };

  model.checkEmailExistsForUpdate(data, callback);
};

//////////////////////////////////////////////////////
// CONTROLLER: DELETE USER BY ID (DELETE /users/{user_id})
//////////////////////////////////////////////////////
module.exports.deleteUserById = (req, res, next) => {
  // ID from route params (frontend request)
  const requestedUserId = parseInt(req.params.id);
  // ID from decoded token (set by verifyToken middleware)
  const tokenUserId = res.locals.userId;

  // Ensure that the user can only delete their own account
  if (requestedUserId !== tokenUserId) {
    return res.status(403).json({ message: "Forbidden: Cannot delete another user's account." });
  }

  const data = { user_id: requestedUserId };

  // Model callback function
  const callback = (error, results) => {
    if (error) {
      console.error("Error deleteUserById:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json({ message: "User account deleted successfully." });
  };

  // Calling model function to delete user and associated data
  model.deleteUser(data, callback);
};

