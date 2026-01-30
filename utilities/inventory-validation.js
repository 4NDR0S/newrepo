const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

/* ********************************
 * Add Inventory Validation Rules
 * ******************************* */
validate.addInventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Classification is required."),

    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a valid number."),

    body("inv_year")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Year must be a valid year."),

    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a valid number."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required.")
  ]
}

/* ********************************
 * Check validation results
 * ******************************* */
validate.checkAddInventoryData = async (req, res, next) => {
  const { classification_id } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList(classification_id)

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors,
      classificationSelect,
      ...req.body
    })
    return
  }
  next()
}

module.exports = validate
