const express = require('express');
const router = express.Router();

const controller = require('../controllers/guildsController')
const jwtMiddleware = require("../middlewares/jwtMiddleware");

// POST /guilds (Allows users to create guilds in GalacticExplorers!) {checkUserIdExists --> createGuild}
router.post(
  "/",
  jwtMiddleware.verifyToken, // Ensure the user is authenticated
  controller.checkUserIdExists, // Check if the user exists
  controller.checkUserGuildLimit, // Check if the user has already created a guild
  controller.createGuild // Create the guild
);

// GET /guilds (Allows users to view the guilds available in GalacticExplorers!) {getAllGuilds}
router.get("/", controller.getAllGuilds)

// GET /guilds/leaderboard (Fetches the leaderboard ranking of guilds based on total planets explored)
router.get("/leaderboard", controller.getGuildLeaderboard);

// POST /guilds/join (Allows a user to join an existing guild by providing their user_id and guild_id) {checkUserExists --> checkGuildExists --> checkUserAlreadyInGuild --> joinGuild}
router.post("/join",
  jwtMiddleware.verifyToken,
  controller.checkUserExists,
  controller.checkGuildExists,
  controller.checkUserAlreadyInGuild,
  controller.joinGuild)

// POST /guilds/leave (Allows a user to leave a guild that they have joined by providing their user_id and the corresponding guild_id!) {checkUserExists --> checkGuildExists --> checkMembership --> leaveGuild}
router.post("/leave",
  jwtMiddleware.verifyToken,
  controller.checkUserExists,
  controller.checkGuildExists,
  controller.checkMembership,
  controller.leaveGuild)

// GET /guilds/{guild_id} (Fetches members in provided guild_id) {checkGuildParamsExist --> getGuildMembers}
router.get("/:guild_id",
  controller.checkGuildParamsExist,
  controller.getGuildMembers)

// DELETE /guilds (Allows user whom created guilds to delete a guild they own) {checkUserExists --> checkGuildExists --> checkGuildCreator --> deleteGuild}
router.delete("/",
  jwtMiddleware.verifyToken,
  controller.checkUserExists,
  controller.checkGuildExists,
  controller.checkGuildCreator,
  controller.deleteGuild)

////////////////////////// GUILD CHAT SYSTEM ENDPOINTS //////////////////////////

// POST /guilds/:guild_id/messages - Send a message in the guild
router.post(
  "/:guild_id/messages",
  jwtMiddleware.verifyToken,  // Ensure user is logged in
  controller.checkMembershipByParams,  // Checks if user is a member of the guild
  controller.sendGuildMessage  // Saves message to MySQL database!
);

// GET /guilds/:guild_id/messages - Fetch all messages from a guild
router.get(
  "/:guild_id/messages",
  jwtMiddleware.verifyToken,  // Ensure user is logged in
  controller.checkMembershipByParams,  // Ensure user is a member of the guild
  controller.getGuildMessages  // Fetch messages from DB
);

// DELETE /guilds/:guild_id/messages/:message_id - Delete a message from a guild
router.delete(
  "/:guild_id/messages/:message_id",
  jwtMiddleware.verifyToken,  // Ensure user is authenticated
  controller.checkMembershipByParams,  // Ensure user is a member of the guild
  controller.checkMessageOwnership,  // Ensure user owns the message
  controller.deleteGuildMessage  // Delete message from DB
);

// PUT /guilds/:guild_id/messages/:message_id - Edit a message in the guild
router.put(
  "/:guild_id/messages/:message_id",
  jwtMiddleware.verifyToken,  // Ensure user is authenticated
  controller.checkMembershipByParams,  // Ensure user is a member of the guild
  controller.checkMessageOwnership,  // Ensure user owns the message
  controller.updateGuildMessage  // Update message in DB
);

module.exports = router;