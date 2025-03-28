const express = require('express');
const router = express.Router();

const controller = require('../controllers/inventoryController')

// GET /inventory/{user_id} (Allows user to see their inventory after purchasing from marketplace by user_id) {checkUserIdExists (Middleware) --> checkInventory (Middleware) --> createNewInventoryRecord (Middleware) --> createNewInventoryRecord}
router.get("/:id",
  controller.checkUserIdExists,
  controller.checkInventory,
  controller.createNewInventoryRecord,
  controller.readInventoryByUser)

// GET /inventory/{user_id}/{item_type} (Allows easy view for users to filter their inventory by item_type) {checkUserIdExists (Middleware) --> checkInventory (Middleware) --> createNewInventoryRecord (Middleware) --> readInventoryByType}
router.get("/:id/:item_type",
  controller.checkUserIdExists,
  controller.checkInventory,
  controller.createNewInventoryRecord,
  controller.readInventoryByType) 

module.exports = router;