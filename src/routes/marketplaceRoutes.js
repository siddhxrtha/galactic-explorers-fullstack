const express = require('express');
const router = express.Router();

const controller = require('../controllers/marketplaceController')
const jwtMiddleware = require("../middlewares/jwtMiddleware");

// POST /marketplace (To allow admins to add new items to marketplace!) {checkItemExistence (Middleware) --> createNewItem} [ADMINS ONLY]
router.post("/",
  controller.checkItemExistence,
  controller.createNewItem)

// GET /marketplace (To allow users to check out the items for sale at The Galactic Marketplace!) {readMarketplace}
router.get("/", controller.readMarketplace)

// GET /marketplace/{item_type} (To allow users to filter out the items for sale at The Galactic Marketplace!) {readMarketplaceByType}
router.get("/:item_type", controller.readMarketplaceByType)

// POST /marketplace/buy (To allow users to buy items from The Galactic Marketplace) {checkUserItemExistence (Middleware) --> checkInventoryExists (Middleware) ---> buyItem (Middleware) --> updateInventory}
router.post("/buy",
  jwtMiddleware.verifyToken,
  controller.checkUserItemExistence,
  controller.checkInventoryExists,
  controller.buyItem,
  controller.updateInventory)

// POST /marketplace/sell (To allow users to sell items back to The Galactic Marketplace & get back their spent skillpoints) {checkUserItemValidity (Middleware) --> checkItemOwnership (Middleware) --> sellItem (Middleware) --> updateInventoryAfterSale}
router.post("/sell",
  jwtMiddleware.verifyToken,
  controller.checkUserItemValidity,
  controller.checkItemOwnership,
  controller.sellItem,
  controller.updateInventoryAfterSale)

module.exports = router;