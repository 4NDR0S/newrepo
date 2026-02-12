const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}



/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const invId = req.params.invId
    const vehicle = await invModel.getInventoryById(invId)

    if (!vehicle) {
      const error = new Error("Vehicle not found")
      error.status = 404
      throw error
    }

    const detail = utilities.buildInventoryDetail(vehicle)
    let nav = await utilities.getNav()

    res.render("./inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detail,
      vehicle,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Build inventory management view
 * *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    errors: null
  })
}



/* ****************************************
 *  Build add classification view
 * *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}


/* ****************************************
 *  Process add classification
 * *************************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  let nav = await utilities.getNav()

  const addResult = await invModel.addClassification(classification_name)

  if (addResult) {
    req.flash("notice", "Classification added successfully.")
    nav = await utilities.getNav() // 👈 vuelve a construir el nav

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the classification was not added.")
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      classification_name,
      errors: null
    })
  }
}



/* ****************************************
 *  Build add inventory view
 * *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationSelect,
    errors: null
  })
}


/* ****************************************
 *  Process add inventory
 * *************************************** */
invCont.addInventory = async function (req, res) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body

  const addResult = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  )

  if (addResult) {
    req.flash("notice", "Inventory item added successfully.")
    res.redirect("/inv")
  } else {
    let nav = await utilities.getNav()
    let classificationSelect =
      await utilities.buildClassificationList(classification_id)

    req.flash("notice", "Sorry, the inventory item was not added.")
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      errors: null,
      ...req.body
    })
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)

  if (invData[0]?.inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}



/* ***************************
 *  Build Edit Inventory View
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const invData = await invModel.getInventoryById(inv_id)
  let nav = await utilities.getNav(req, res)
  let classificationSelect = await utilities.buildClassificationList(
    invData.classification_id
  )

  res.render("inventory/edit-inventory", {
    title: `Edit ${invData.inv_make} ${invData.inv_model}`,
    nav,
    errors: null,
    classificationSelect,
    ...invData
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    req.flash("notice", "Inventory item updated successfully.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Update failed.")
    res.redirect(`/inv/edit/${inv_id}`)
  }
}


/* ***************************
 *  Build Delete Inventory View
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const invData = await invModel.getInventoryById(inv_id)
  let nav = await utilities.getNav(req, res)

  res.render("inventory/delete-inventory", {
    title: `Delete ${invData.inv_make} ${invData.inv_model}`,
    nav,
    errors: null,
    inv_id: invData.inv_id,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_year: invData.inv_year,
    inv_price: invData.inv_price
  })
}


/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const { inv_id } = req.body

  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    req.flash("notice", "Inventory item deleted successfully.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Delete failed.")
    res.redirect(`/inv/delete/${inv_id}`)
  }
}


module.exports = invCont