const express = require("express")
const router = new express.Router()
const favoritesController = require("../controllers/favoritesController")
const utilities = require("../utilities/")

router.get(
  "/",
  utilities.checkLogin,
  favoritesController.viewFavorites
)

router.post(
  "/add",
  utilities.checkLogin,
  favoritesController.addFavorite
)

router.post(
  "/remove",
  utilities.checkLogin,
  favoritesController.removeFavorite
)

module.exports = router
