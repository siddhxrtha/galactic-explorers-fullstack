//////////////////////////////////////////////////////
// CREATE ROUTER
//////////////////////////////////////////////////////
const express = require('express');
const router = express.Router();

//////////////////////////////////////////////////////
// IMPORT SPECIFIC ROUTES
//////////////////////////////////////////////////////
const usersRoutes = require('./usersRoutes');
const challengesRoutes = require('./challengesRoutes');
const marketplaceRoutes = require('./marketplaceRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const exploreRoutes = require('./exploreRoutes');
const guildsRoutes = require('./guildsRoutes');
const reviewsRoutes = require('./reviewsRoutes');

//////////////////////////////////////////////////////
// IMPORT CONTROLLERS AND MIDDLEWARES
//////////////////////////////////////////////////////
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');
const usersController = require('../controllers/usersController');
const tokenController = require('../controllers/tokenController')

//////////////////////////////////////////////////////
// ROUTES FOR SPECIFIC MODULES
//////////////////////////////////////////////////////

// Routing for `/users` to handle all users-related routes
router.use('/users', usersRoutes);

// Routing for `/challenges` to handle all challenges-related routes
router.use('/challenges', challengesRoutes);

// Routing for `/marketplace` to handle all marketplace-related routes
router.use('/marketplace', marketplaceRoutes);

// Routing for `/inventory` to handle all inventory-related routes
router.use('/inventory', inventoryRoutes);

// Routing for `/explore` to handle all explore-related routes
router.use('/explore', exploreRoutes);

// Routing for `/guilds` to handle all guilds-related routes
router.use('/guilds', guildsRoutes);

// Routing for `/reviews` to handle all reviews-related routes
router.use('/reviews', reviewsRoutes);

//////////////////////////////////////////////////////
// AUTHENTICATION ROUTES
//////////////////////////////////////////////////////

// POST /api/register: Handles user registration
router.post(
  '/register',
  usersController.checkIfEmailIsUsed,       // Check if email is already in use
  usersController.checkUsernameExistence,   // Check if username is already in use (Reused Middlewares from CA1)
  bcryptMiddleware.hashPassword,            // Hash the provided password
  usersController.registerUser,             // Create the new user
  jwtMiddleware.generateToken,              // Generate an access token
  jwtMiddleware.generateRefreshToken,       // Generate a refresh token
  jwtMiddleware.sendToken                   // Send tokens to the client
);

// POST /api/login - Login route with chained middlewares
router.post(
  "/login",
  usersController.loginUser,               // 1: User login logic
  bcryptMiddleware.comparePassword,        // 2: Compare password
  jwtMiddleware.generateToken,             // 3: Generate JWT
  jwtMiddleware.generateRefreshToken,      // 4: Generate Refresh Token
  jwtMiddleware.sendToken                  // 5: Send token as response
);

// POST /api/refresh: Refresh access and refresh tokens
router.post(
  '/refresh',
  jwtMiddleware.refreshToken,               // Validate the refresh token
  jwtMiddleware.generateToken,              // Generate a new access token
  jwtMiddleware.generateRefreshToken,       // Generate a new refresh token
  jwtMiddleware.sendToken                   // Send tokens to the client
);

//////////////////////////////
// TESTING ENDPOINTS 
//////////////////////////////
router.post(
	"/jwt/generate",
	tokenController.preTokenGenerate,
	jwtMiddleware.generateToken,
	tokenController.beforeSendToken,
	jwtMiddleware.sendToken
);
router.get(
	"/jwt/verify",
	jwtMiddleware.verifyToken,
	tokenController.showTokenVerified
);
router.post(
	"/bcrypt/compare",
	tokenController.preCompare,
	bcryptMiddleware.comparePassword,
	tokenController.showCompareSuccess
);
router.post(
	"/bcrypt/hash",
	bcryptMiddleware.hashPassword,
	tokenController.showHashing
);

//////////////////////////////////////////////////////
// EXPORT ROUTER
//////////////////////////////////////////////////////
module.exports = router;
