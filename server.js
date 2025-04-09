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
app.use(express.urlencoded({ extended: true }));

/* ***********************
 * Routes
 *************************/
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Intentional 500 error route
app.get("/test-error", (req, res, next) => {
  throw new Error("This is a test 500 error for demonstration.");
});

// Inventory routes
app.use("/inv", inventoryRoute);

/* ***********************
 * Error Handlers
 *************************/
// General error handler
app.use(async (err, req, res, next) => {
  console.error(`Error at "${req.originalUrl}": ${err.stack}`);
  let nav = await utilities.getNav();
  const status = err.status || 500;
  const message =
    status === 404
      ? "Page not found"
      : "Oh no! There was a crash. Maybe try a different route?";

  res.status(status).render("errors/error", {
    title: status,
    message,
    nav,
  });
});

// 404 handler (must be after all other routes)
app.use(async (req, res) => {
  let nav = await utilities.getNav();
  res.status(404).render("errors/error", {
    title: "404 Not Found",
    message: "Oops! The page you are looking for does not exist.",
    nav,
  });
});

/* ***********************
 * Server Setup
 *************************/
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
