// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")

const regValidate = require("../utilities/account-validation")


// Route to build login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// Route to build registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)


// Route to process registration
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login 
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)


router.get(
  "/update",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)


router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccountInfo)
)

router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)


router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)


module.exports = router