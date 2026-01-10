/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")


/* ***********************
 * Configure Express to use EJS
 *************************/
app.set("view engine", "ejs")      // Dice a Express que use EJS
app.use(expressLayouts)            // Activa layouts de EJS
app.set("layout", "./layouts/layout")  // Define el layout principal (archivo layout.ejs)

/* ***********************
 * Routes
 *************************/
app.use(static)
app.get("/", (req, res) => {
  res.render("index", { title: "Home" })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
