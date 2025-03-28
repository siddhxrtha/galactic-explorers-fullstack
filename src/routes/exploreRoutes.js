const express = require('express');
const router = express.Router();

const controller = require('../controllers/exploreController')
const jwtMiddleware = require("../middlewares/jwtMiddleware");

// GET /explore (Retrieves a list of all available planets for exploration for user to view!) {getAllPlanets}
router.get("/", controller.getAllPlanets)

// POST /explore/{planet_id} (Allows user to explore a planet based on the planet ID and recieve skillpoints reward!) {checkPlanetExistence --> checkExploredLog --> insertExplorationLog --> rewardSkillpoints} 
router.post("/:planet_id",
  jwtMiddleware.verifyToken,
  controller.checkPlanetExistence,
  controller.checkExploredLog,
  controller.checkInventoryForRequiredItems,
  controller.insertExplorationLog,
  controller.rewardSkillpoints)

// GET /explore/{user_id} (Retreives the explored planets for user_id) {checkUserExists --> getExploredPlanets}
router.get("/:user_id",
  controller.checkUserExists,
  controller.getExploredPlanets)

module.exports = router;