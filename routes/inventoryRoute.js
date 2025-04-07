const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");

// Inventory routes
router.get("/detail/:inventory_id", invController.buildVehicleDetail);

module.exports = router;