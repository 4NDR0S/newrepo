const pool = require("../database/")

/* ***************************
 * Add Favorite
 * ************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO favorites (account_id, inv_id)
      VALUES ($1, $2)
      RETURNING *;
    `
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("addFavorite error " + error)
    throw error
  }
}

/* ***************************
 * Remove Favorite
 * ************************** */
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = `
      DELETE FROM favorites
      WHERE account_id = $1 AND inv_id = $2
      RETURNING *;
    `
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("removeFavorite error " + error)
    throw error
  }
}

/* ***************************
 * Get Favorites By Account
 * ************************** */
async function getFavoritesByAccount(account_id) {
  try {
    const sql = `
      SELECT i.*
      FROM favorites f
      JOIN inventory i ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY f.created_at DESC;
    `
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getFavoritesByAccount error " + error)
    throw error
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesByAccount
}
