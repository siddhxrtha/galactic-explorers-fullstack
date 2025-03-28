const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewsController');
const jwtMiddleware = require("../middlewares/jwtMiddleware");

////////////////////////////
// Routes for Reviews
////////////////////////////

// Get all reviews
router.get('/', controller.readAllReview);

// Get reviews by Challenge ID
router.get('/challenge/:challenge_id', controller.readReviewsByChallengeId);

////////////////////////////
// Create a new review
////////////////////////////
router.post('/', jwtMiddleware.verifyToken, controller.createReview);

////////////////////////////
// Get a review by ID
////////////////////////////
router.get('/:id', controller.readReviewById);

////////////////////////////
// Update a review by ID (Ownership Check)
////////////////////////////
router.put(
    '/:id',
    jwtMiddleware.verifyToken,  // Verify token middleware
    controller.verifyOwnership, // Ownership check middleware
    controller.updateReviewById // Update logic
);

////////////////////////////
// Delete a review by ID (Ownership Check)
////////////////////////////
router.delete(
    '/:id',
    jwtMiddleware.verifyToken,  // Verify token middleware
    controller.verifyOwnership, // Ownership check middleware
    controller.deleteReviewById // Delete logic
);

////////////////////////////
// Export the router
////////////////////////////
module.exports = router;
