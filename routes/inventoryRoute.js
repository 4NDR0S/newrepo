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
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement)
)

// Add classification view
router.get(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
)

// Add classification (POST)
router.post(
  "/add-classification",
  classificationValidate.classificationRules(),
  classificationValidate.checkClassificationData,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory view
router.get(
  "/add-inventory",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
)

// Add inventory (POST) 
router.post(
  "/add-inventory",
  invValidate.addInventoryRules(),
  invValidate.checkAddInventoryData,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.addInventory)
)


router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)


// Edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildEditInventory)
)

// Update inventory (POST)
router.post(
  "/edit",
  invValidate.addInventoryRules(),
  invValidate.checkAddInventoryData,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.updateInventory)
)


// Delete inventory view
router.get(
  "/delete/:inv_id",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteInventory)
)

// Delete inventory (POST)
router.post(
  "/delete",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventory)
)


module.exports = router
