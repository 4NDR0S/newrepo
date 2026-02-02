const invModel = require("../models/inventory-model")
const Util = {}


// JWT
const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()

  const loggedin = res?.locals?.loggedin
  const accountType = res?.locals?.accountData?.account_type

  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })

  // 🔐 Inventory Management (solo Employee / Admin)
  if (
    loggedin &&
    (accountType === "Employee" || accountType === "Admin")
  ) {
    list += `
      <li>
        <a href="/inv/" title="Inventory Management">
          Inventory Management
        </a>
      </li>
    `
  }

  list += "</ul>"
  return list
}





/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}



/* **************************************
* Build inventory detail view HTML
* ************************************ */
Util.buildInventoryDetail = function (vehicle) {
  let detail = `
  <div class="vehicle-detail">
    <div class="vehicle-image">
      <img src="${vehicle.inv_image}" 
           alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
    </div>

    <div class="vehicle-info">
      <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>

      <p class="price">
        <strong>Price:</strong> 
        $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}
      </p>

      <p>
        <strong>Mileage:</strong> 
        ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles
      </p>

      <p><strong>Description:</strong> ${vehicle.inv_description}</p>
      <p><strong>Color:</strong> ${vehicle.inv_color}</p>
    </div>
  </div>
  `
  return detail
}



/* ***************************
 * Build classification list
 * ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected"
    }
    classificationList += `>${row.classification_name}</option>`
  })
  classificationList += "</select>"
  return classificationList
}



/* **************************************
 * Error handling middleware
 * ************************************ */
Util.handleErrors = fn => async (req, res, next) => {
  try {
    await fn(req, res, next)
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    next()
  }
}


/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}



// utilities.checkEmployeeOrAdmin = (req, res, next) => {
//   if (
//     res.locals.loggedin &&
//     (res.locals.accountData.account_type === "Employee" ||
//      res.locals.accountData.account_type === "Admin")
//   ) {
//     return next()
//   } else {
//     req.flash("notice", "You are not authorized to access this area.")
//     return res.redirect("/account/login")
//   }
// }

Util.checkEmployeeOrAdmin = (req, res, next) => {
  if (
    res.locals.loggedin &&
    (res.locals.accountData.account_type === "Employee" ||
      res.locals.accountData.account_type === "Admin")
  ) {
    next()
  } else {
    req.flash("notice", "You are not authorized to access this area.")
    res.redirect("/account/login")
  }
}



module.exports = Util