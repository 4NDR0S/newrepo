// Needed Resources
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidate = require("../utilities/classification-validation")
const invValidate = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build detail vehicle
router.get("/detail/:invId", invController.buildByInventoryId)

// Inventory management view
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

// Add classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Add classification (POST)
router.post(
  "/add-classification",
  classificationValidate.classificationRules(),
  classificationValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory view
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Add inventory (POST) 
router.post(
  "/add-inventory",
  invValidate.addInventoryRules(),
  invValidate.checkAddInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router
