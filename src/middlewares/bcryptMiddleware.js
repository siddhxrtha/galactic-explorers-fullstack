//////////////////////////////////////////////////////
// REQUIRE BCRYPT MODULE
//////////////////////////////////////////////////////
const bcrypt = require("bcrypt");

//////////////////////////////////////////////////////
// SET SALT ROUNDS
//////////////////////////////////////////////////////
const saltRounds = 10;

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR COMPARING PASSWORD
//////////////////////////////////////////////////////
module.exports.comparePassword = (req, res, next) => {
	// Check password
	const callback = (err, isMatch) => {
		if (err) {
			console.error("Error bcrypt:", err);
			res.status(500).json({ error: "Internal server error during password comparison." });
		} else {
			if (isMatch) {
				next();
			} else {
				res.status(401).json({
          error: "The password entered is incorrect. Please double-check and try again."
        });
			}
		}
	};
	bcrypt.compare(req.body.password, res.locals.hash, callback);
};

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR HASHING PASSWORD
//////////////////////////////////////////////////////
module.exports.hashPassword = (req, res, next) => {
	const callback = (err, hash) => {
			if (err) {
					console.error("Error bcrypt:", err);
					res.status(500).json(err);
			} else {
					res.locals.hash = hash;  // Save the hashed password in res.locals
					next();  // Proceed to the next middleware (User Registration)
			}
	};

	bcrypt.hash(req.body.password, saltRounds, callback);  // Hash the password
};

