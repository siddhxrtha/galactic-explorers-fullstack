const model = require("../models/challengesModel")

// POST /challenges (TASK 4)

// Creates a new challenge
module.exports.createNewChallenge = (req, res, next) => {
  if (req.body.challenge == undefined || req.body.user_id == undefined || req.body.skillpoints == undefined) {
    res.status(400).json({
      message: "Missing required data: Challenge, user_id or skillpoints"
    })
    return;
  }

  const data = {
    challenge: req.body.challenge,
    user_id: req.body.user_id,
    skillpoints: req.body.skillpoints
  }

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error createNewChallenge:", error);
      res.status(500).json({
        message: "Internal Server error."
      });
    }
    else {
      res.status(201).json({
        challenge_id: results.insertId,
        challenge: req.body.challenge,
        creator_id: req.body.user_id,
        skillpoints: req.body.skillpoints
      })
    }

  }
  model.createChallenge(data, callback);
}


// GET /challenges (TASK 5)

// Fetches all challenges to display
module.exports.getAllChallenges = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error getAllChallenges:", error);
      res.status(500).json(error);
    } else {
      res.status(200).json(results)
    }
  }

  model.selectAllChallenges(callback)
}


// PUT /challenges/{challenge_id} (TASK 6)

// Middleware function to check if challenge exists
module.exports.checkChallengeExistence = (req, res, next) => {
  const data = {
    id: req.params.id,
  }
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkChallengeExistence:", error);
      res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    else {
      if (results.length == 0) {
        res.status(404).json({
          message: "Challenge not found!"
        })
      }
      else {
        next();
      }
    }
  }
  model.checkChallenge(data, callback)
}

// Middleware to check if creator_id matches user_id
module.exports.checkCreator = (req, res, next) => {
  const data = {
    id: req.params.id,
    user_id: req.body.user_id
  }
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkCreator:", error);
      res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    else {
      if (results.length == 0) {
        res.status(403).json({
          message: "Forbidden: User is not the creator of the challenge"
        })
      }
      else {
        next();
      }
    }
  }
  model.checkCreatorId(data, callback)
}

// Updates challenge with given request
module.exports.updateChallengeById = (req, res, next) => {
  if (req.body.challenge == undefined || req.body.skillpoints == undefined || req.body.user_id == undefined) {
    res.status(400).json({
      message: "Missing required data: Challenge, skillpoints or user_id"
    })
    return;
  }

  const data = {
    id: parseInt(req.params.id),
    user_id: req.body.user_id,
    challenge: req.body.challenge,
    skillpoints: req.body.skillpoints
  }

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error updateChallengeById", error);
      res.status(500).json({ error });
    }
    else {
      res.status(200).json({
        challenge_id: data.id,
        challenge: req.body.challenge,
        creator_id: req.body.user_id,
        skillpoints: req.body.skillpoints
      })
    }
  }
  model.updateChallengeById(data, callback);
}


// DELETE /challenges/{challenge_id} (TASK 7)

//Deletes challenge by ID provided in web context
module.exports.deleteChallengeById = (req, res, next) => {
  const data = {
    id: req.params.id
  }

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error deleteChallengeById:", error);
      res.status(500).json({
        message: "Internal server error"
      });
    }
    else {
      if (results.affectedRows == 0) {
        res.status(404).json({
          message: "Challenge not found! "
        })
      }
      else {
        res.status(204).send()
      }
    }
  }
  model.deleteById(data, callback)
}


// POST /challenges/{challenge_id} (TASK 8)

// Middleware to check if user_id or challenge_id requested exists
module.exports.checkUserAndChallengeExistence = (req, res, next) => {
  const data = {
    id: req.params.id,
    user_id : req.body.user_id
  }
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error checkUserAndChallengeExistence:", error);
      res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    else {
      if (results.length == 0) {
        res.status(404).json({
          message: "Challenge or user not found!"
        })
      }
      else {
        next();
      }
    }
  }
  model.checkUserChallenge(data, callback)
}

// Middleware to add skillpoints (Additional Requirement)
module.exports.addSkillpoints = (req, res, next) => {
  const data = {
    id: req.params.id,
    user_id : req.body.user_id,
    completed : req.body.completed
  }
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error addSkillpoints:", error);
      res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    else {
      next();
      }
    }
  model.setSkillpoints(data, callback)
}

// Creates new completion record
module.exports.createNewCompletion = (req, res, next) => {
  if (req.body.creation_date == undefined) {
    res.status(400).json({
      message: "Missing creation_date."
    })
    return;
  }

  const data = {
    id: parseInt(req.params.id),
    user_id: req.body.user_id,
    completed: req.body.completed,
    creation_date: req.body.creation_date,
    notes: req.body.notes
  }

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error createNewCompletion:", error);
      res.status(500).json({
        message: "Internal Server error."
      });
    }

    else {
      res.status(201).json({
        complete_id: results.insertId,
        challenge_id: data.id,
        user_id: req.body.user_id,
        completed: req.body.completed,
        creation_date: req.body.creation_date,
        notes: req.body.notes
      })
    }
  }
  model.createCompletion(data, callback);
}

//GET /challenges/{challenge_id} (TASK 9) 

// Reads all the completion records in provided challenge_id
module.exports.readUsersByChallenge = (req,res,next) => {
  const data = {
    id : req.params.id
  }
  const callback = (error,results,fields) => {
    if (error) {
      console.error("Error readUsersByChallenge:", error);
      res.status(500).json(error);
    } else {
      if (results.length == 0 ) {
        res.status(404).json({
          message : "No Attempts Found!"
        })
      }
      else {
        res.status(200).json(results) 
      }
    }
  }
  model.readUsersByChallengeId(data,callback)
}

// DELETE /challenges/{challenge_id}

// Middleware to check if the logged-in user is the creator of the challenge
module.exports.checkChallengeOwner = (req, res, next) => {

  const userId = req.body.user_id; 
  const challengeId = req.params.id; 

  if (!userId || !challengeId) {
    return res.status(400).json({ message: "Missing required data: user_id or challenge_id" });
  }

  const data = {
    id: challengeId,
    user_id: userId, // The user's ID to validate ownership
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error in checkChallengeOwner:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(403).json({
        message: "Forbidden: You are not the creator of this challenge",
      });
    }

    // If ownership is validated, proceed to the next middleware/controller
    next();
  };

  model.checkChallengeOwner(data, callback);
};

// GET /challenges/user/:user_id - Fetch number of completed challenges for a user
module.exports.getCompletedChallengesByUser = (req, res, next) => {
  const userId = req.params.user_id;

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error fetching completed challenges:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ completedChallenges: results[0].completed_count });
    }
  };

  model.getCompletedChallenges(userId, callback);
};
