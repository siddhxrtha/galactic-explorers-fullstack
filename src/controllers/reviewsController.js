const model = require("../models/reviewsModel.js");

////////////////////////////
// Create a New Review
////////////////////////////
module.exports.createReview = (req, res, next) => {
    if (!req.body.review_amt) {
        res.status(400).send("Error: review_amt is undefined");
        return;
    } else if (req.body.review_amt > 5 || req.body.review_amt < 1) {
        res.status(400).send("Error: review_amt can only be between 1 to 5");
        return;
    } else if (!req.body.user_id) {
        res.status(400).send("Error: user_id is undefined");
        return;
    } else if (!req.body.challenge_id) {
        res.status(400).send("Error: challenge_id is undefined");
        return;
    }

    const data = {
        user_id: req.body.user_id,
        challenge_id: req.body.challenge_id,
        review_amt: req.body.review_amt,
        review_text: req.body.review_text || null // Optional
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error createReview:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json({
                message: "Review created successfully!",
                review_id: results.insertId
            });
        }
    };

    model.insertSingle(data, callback);
};

////////////////////////////
// Read a Review by ID
////////////////////////////
module.exports.readReviewById = (req, res, next) => {
    const data = {
        id: req.params.id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error readReviewById:", error);
            res.status(500).json(error);
        } else if (results.length === 0) {
            res.status(404).json({ message: "Review not found" });
        } else {
            res.status(200).json(results[0]);
        }
    };

    model.selectById(data, callback);
};

////////////////////////////
// Read All Reviews with Sorting
////////////////////////////
module.exports.readAllReview = (req, res, next) => {
    const sort = req.query.sort === "lowest" ? "ASC" : "DESC"; // Determine sorting order

    const callback = (error, results) => {
        if (error) {
            console.error("Error readAllReview:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    };

    // Pass sorting order to the model
    model.selectAll(sort, callback);
};

////////////////////////////
// Read Reviews by Challenge ID with Sorting
////////////////////////////
module.exports.readReviewsByChallengeId = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id,
        sort: req.query.sort === "lowest" ? "ASC" : "DESC" // Default: Highest rating first
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error readReviewsByChallengeId:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    };

    model.selectByChallengeId(data, callback);
};


////////////////////////////
// Update a Review by ID
////////////////////////////
module.exports.updateReviewById = (req, res, next) => {
    if (!req.params.id) {
        res.status(400).send("Error: id is undefined");
        return;
    } else if (!req.body.review_amt) {
        res.status(400).send("Error: review_amt is undefined");
        return;
    } else if (req.body.review_amt > 5 || req.body.review_amt < 1) {
        res.status(400).send("Error: review_amt can only be between 1 to 5");
        return;
    } else if (!req.body.user_id) {
        res.status(400).send("Error: user_id is undefined");
        return;
    }

    const data = {
        id: req.params.id,
        user_id: req.body.user_id,
        challenge_id: req.body.challenge_id || null, // Optional if unchanged
        review_amt: req.body.review_amt,
        review_text: req.body.review_text || null // Optional
    };

    const callback = (error) => {
        if (error) {
            console.error("Error updateReviewById:", error);
            res.status(500).json(error);
        } else {
            res.status(204).send();
        }
    };

    model.updateById(data, callback);
};

////////////////////////////
// Delete a Review by ID
////////////////////////////
module.exports.deleteReviewById = (req, res, next) => {
    const data = {
        id: req.params.id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error deleteReviewById:", error);
            res.status(500).json(error);
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: "Review not found" });
        } else {
            res.status(204).send();
        }
    };

    model.deleteById(data, callback);
};


////////////////////////////
// MIDDLEWARES
////////////////////////////

///////////////////////////////
// Verify Ownership of a Review
///////////////////////////////
module.exports.verifyOwnership = (req, res, next) => {
  const reviewId = req.params.id; // This might be undefined
  const userId = req.body.user_id; // Ensure this exists in your request body

  if (!reviewId || !userId) {
      return res.status(400).json({ message: "Review ID or User ID is missing." });
  }

  const data = { id: reviewId, user_id: userId };

  model.verifyOwnership(data, (error, results) => {
      if (error) {
          console.error("Error verifyOwnership:", error);
          return res.status(500).json({ message: "Internal Server Error." });
      }

      if (results.length === 0) {
          return res.status(403).json({ message: "You are not the owner of this review." });
      }

      next(); // Proceed if ownership is verified
  });
};
