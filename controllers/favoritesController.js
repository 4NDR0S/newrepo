const favoritesModel = require("../models/favorites-model")
const utilities = require("../utilities")

/* ***************************
 * Add Favorite
 * ************************** */
async function addFavorite(req, res) {
  try {
    const account_id = res.locals.accountData.account_id
    const { inv_id } = req.body

    // SERVER-SIDE VALIDATION
    if (!inv_id || isNaN(inv_id)) {
      req.flash("notice", "Invalid inventory item.")
      return res.redirect("/")
    }

    await favoritesModel.addFavorite(account_id, inv_id)

    req.flash("notice", "Item added to favorites!")
    res.redirect("/favorites")

  } catch (error) {
    console.error("Add favorite error:", error)
    req.flash("notice", "This item may already be in your favorites.")
    res.redirect("back")
  }
}

/* ***************************
 * View Favorites
 * ************************** */
async function viewFavorites(req, res) {
  try {
    const account_id = res.locals.accountData.account_id

    const favorites = await favoritesModel.getFavoritesByAccount(account_id)

    let nav = await utilities.getNav()

    res.render("account/favorites", {
      title: "My Favorites",
      nav,
      favorites
    })

  } catch (error) {
    console.error("View favorites error:", error)
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "Unable to retrieve favorites."
    })
  }
}

/* ***************************
 * Remove Favorite
 * ************************** */
async function removeFavorite(req, res) {
  try {
    const account_id = res.locals.accountData.account_id
    const { inv_id } = req.body

    if (!inv_id || isNaN(inv_id)) {
      req.flash("notice", "Invalid inventory item.")
      return res.redirect("/favorites")
    }

    await favoritesModel.removeFavorite(account_id, inv_id)

    req.flash("notice", "Item removed from favorites.")
    res.redirect("/favorites")

  } catch (error) {
    console.error("Remove favorite error:", error)
    req.flash("notice", "Error removing favorite.")
    res.redirect("/favorites")
  }
}

module.exports = {
  addFavorite,
  viewFavorites,
  removeFavorite
}
