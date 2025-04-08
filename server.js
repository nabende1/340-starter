/* ******************************************
 * Primary server.js file to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv").config();
const app = express();

const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const utilities = require("./utilities/");
const inventoryRoute = require("./routes/inventoryRoute");

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Middleware and Static Files
 *************************/
app.use(express.static("public"));

/* ***********************
 * Routes
 *************************/
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Test error route
app.get("/test-error", (req, res, next) => {
  next(new Error("This is a test error!"));
});

// Inventory routes
app.use("/inv", inventoryRoute);

/* ***********************
 * Server Setup
 *************************/
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

/* ***********************
 * Error Handlers
 *************************/
// General error handler
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message =
    err.status == 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

// 404 Not Found handler
app.use(async (req, res, next) => {
  let nav = await utilities.getNav();
  res.status(404).render("errors/error", {
    title: "404 Not Found",
    message: "Oops! The page you are looking for does not exist.",
    nav,
  });
});
