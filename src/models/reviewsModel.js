const pool = require('../services/db');

////////////////////////////
// Select All Reviews with User and Challenge Names and Sorting
////////////////////////////
module.exports.selectAll = (sort, callback) => {
  const SQLSTATEMENT = `
    SELECT 
      Reviews.id AS review_id, 
      Reviews.review_amt, 
      Reviews.review_text,
      Reviews.challenge_id, 
      Reviews.created_at, 
      User.username AS reviewer_username, 
      User.user_id AS reviewer_id, 
      FitnessChallenge.challenge AS challenge_name
    FROM Reviews
    INNER JOIN User 
      ON Reviews.user_id = User.user_id
    INNER JOIN FitnessChallenge 
      ON Reviews.challenge_id = FitnessChallenge.challenge_id
    ORDER BY Reviews.review_amt ${sort}, Reviews.created_at DESC;
  `;

  pool.query(SQLSTATEMENT, callback);
};


////////////////////////////
// Select Review by ID
////////////////////////////
module.exports.selectById = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT id, review_amt, user_id, challenge_id, review_text, created_at, last_modified
    FROM Reviews
    WHERE id = ?;
    `;
    const VALUES = [data.id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

////////////////////////////
// Select Reviews by Challenge ID with Sorting
////////////////////////////
module.exports.selectByChallengeId = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT 
      Reviews.id AS review_id, 
      Reviews.review_amt, 
      Reviews.review_text,
      Reviews.challenge_id, 
      Reviews.created_at, 
      User.username AS reviewer_username, 
      User.user_id AS reviewer_id, 
      FitnessChallenge.challenge AS challenge_name
  FROM Reviews
  INNER JOIN User 
      ON Reviews.user_id = User.user_id
  INNER JOIN FitnessChallenge 
      ON Reviews.challenge_id = FitnessChallenge.challenge_id
  WHERE Reviews.challenge_id = ?
  ORDER BY Reviews.review_amt ${data.sort}, Reviews.created_at DESC;
  `;
  
  const VALUES = [data.challenge_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

////////////////////////////
// Insert a New Review
////////////////////////////
module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
    INSERT INTO Reviews (review_amt, user_id, challenge_id, review_text)
    VALUES (?, ?, ?, ?);
    `;
    const VALUES = [data.review_amt, data.user_id, data.challenge_id, data.review_text];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

////////////////////////////
// Update a Review by ID
////////////////////////////
module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
    UPDATE Reviews 
    SET review_amt = ?, user_id = ?, challenge_id = ?, review_text = ?
    WHERE id = ?;
    `;
    const VALUES = [data.review_amt, data.user_id, data.challenge_id, data.review_text, data.id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

////////////////////////////
// Delete a Review by ID
////////////////////////////
module.exports.deleteById = (data, callback) => {
    const SQLSTATEMENT = `
    DELETE FROM Reviews 
    WHERE id = ?;
    `;
    const VALUES = [data.id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

////////////////////////////
// Delete All Reviews for a Challenge
////////////////////////////
module.exports.deleteByChallengeId = (data, callback) => {
    const SQLSTATEMENT = `
    DELETE FROM Reviews 
    WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


////////////////////////////
// Verify Ownership of Review
////////////////////////////
module.exports.verifyOwnership = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT id 
  FROM Reviews 
  WHERE id = ? AND user_id = ?;
  `;
  const VALUES = [data.id, data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};