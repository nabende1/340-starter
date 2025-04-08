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
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")
const inventoryRoute = require("./routes/inventoryRoute"); 

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
// Serve static files from the "public" folder
app.use(express.static('public'))

// Main route, use either this or the other one, but not both
app.get("/", utilities.handleErrors(baseController.buildHome)) // index route

// Another index route (delete this if you're using the above one)
app.get("/", function(req, res){
  res.render("index", {title: "Home"})
})

// Error test route
app.get('/test-error', (req, res, next) => {
  next(new Error('This is a test error!'))
})

// Inventory routes
app.use("/inv", inventoryRoute)

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

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  const message = err.status == 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?'
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

// Catch-all 404 handler for undefined routes
app.use(async (req, res, next) => {  // Make this async to use `await`
  let nav = await utilities.getNav();  // Using await here
  res.status(404).render("errors/error", {
    title: '404 Not Found',
    message: 'Oops! The page you are looking for does not exist.',
    nav: nav  // Passing the nav object here
  })
})
