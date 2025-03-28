const express = require('express');
const router = express.Router();

const controller = require('../controllers/usersController')
const jwtMiddleware = require("../middlewares/jwtMiddleware");


// Replaced with registration route (mainRoutes.js)
// POST /users (TASK 1) {checkUsernameExistence (Middleware) --> createNewUser}
router.post("/",
   controller.checkUsernameExistence,
   controller.createNewUser)

// GET /users (TASK 2) {getAllUsers}
router.get("/", controller.getAllUsers)

// PUT /users/{user_id} (TASK 3) {checkUsernameExistence (Middleware) --> updateUserById}
router.put('/:id',
  jwtMiddleware.verifyToken,
  controller.checkUsernameExistenceForUpdate,
  controller.checkIfEmailIsUsedForUpdate,
  controller.updateUserById)

// GET /users/leaderboard (Fetches users by planets explored ranking) [SECTION B] {getLeaderboard}
router.get('/leaderboard', controller.getLeaderboard)

// GET /users/{user_id} (Fetch user details with guild information) [SECTION B]{getUserDetails}
router.get("/:user_id", controller.getUserDetails);

// DELETE /users/{user_id} - Allows a user to delete their account
router.delete(
  "/:id",
  jwtMiddleware.verifyToken,
  controller.deleteUserById
);

module.exports = router;