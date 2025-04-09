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
  const className = data[0]?.classification_name || "Vehicles"
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
  const inv_id = req.params.inv_id

  try {
    const data = await invModel.getInventoryById(inv_id)

    if (!data) {
      const nav = await utilities.getNav()
      return res.status(404).render("errors/404", {
        title: "Vehicle Not Found",
        nav,
        message: "Sorry, we couldn't find that vehicle.",
      })
    }

    const detail = await utilities.buildInventoryDetail(data)
    const nav = await utilities.getNav()
    const title = `${data.inv_make} ${data.inv_model}`

    res.render("./inventory/detail", {
      title,
      nav,
      detail,
    })
  } catch (error) {
    console.error("Error loading vehicle details:", error)
    next(error)
  }
}

module.exports = invCont
