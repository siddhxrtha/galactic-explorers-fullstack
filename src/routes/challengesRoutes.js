const express = require('express');
const router = express.Router();

const controller = require('../controllers/challengesController')
const jwtMiddleware = require("../middlewares/jwtMiddleware");

// POST /challenges (TASK 4) {createNewChallenge}
router.post("/",
   jwtMiddleware.verifyToken,
   controller.createNewChallenge)

// GET /challenges (TASK 5) {getAllChallenges}
router.get("/", controller.getAllChallenges)

// PUT /challenges/{challenge_id} (TASK 6) {checkChallengeExistence (Middleware) --> checkCreator (Middleware) --> updateChallengeById}
router.put('/:id',
  jwtMiddleware.verifyToken,
   controller.checkChallengeExistence,
   controller.checkCreator,
   controller.updateChallengeById)

// DELETE /challenges/{challenge_id} (TASK 7) {deleteChallengeById}
router.delete("/:id", 
  jwtMiddleware.verifyToken,
  controller.checkChallengeOwner,
  controller.deleteChallengeById)

// POST /challenges/{challenge_id} (TASK 8) {checkUserAndChallengeExistence (Middleware) --> addSkillpoints (Middleware) --> createNewCompletion}
router.post("/:id",
  jwtMiddleware.verifyToken,
  controller.checkUserAndChallengeExistence,
  controller.addSkillpoints,
  controller.createNewCompletion)

//GET /challenges/{challenge_id} (TASK 9) {readUsersByChallenge}
router.get("/:id",controller.readUsersByChallenge)

// GET /challenges/user/:user_id - Fetch total completed challenges for user (Made this endpoint for the Profile Page Chart!)
router.get("/user/:user_id", controller.getCompletedChallengesByUser);

module.exports = router;