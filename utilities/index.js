const invModel = require("../models/inventory-model")

async function getNav() {
  try {
    const classifications = await invModel.getClassifications()
    let list = '<ul class="nav-menu">'
    list += '<li><a href="/" title="Home page">Home</a></li>'

    classifications.forEach((row) => {
      list += '<li>'
      list += `<a href="/inv/type/${row.classification_id}" 
                 title="See our inventory of ${row.classification_name} vehicles">
                 ${row.classification_name}
               </a>`
      list += '</li>'
    })

    list += '</ul>'
    return list
  } catch (error) {
    console.error("Error building navigation:", error)
    return '<ul class="nav-menu"><li><a href="/">Home</a></li></ul>'
  }
}

function handleErrors(fn) {
  return (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next)
}

async function buildClassificationGrid(data) {
  let grid = ''
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += `<li>
                <a href="/inv/detail/${vehicle.inv_id}" 
                   title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                  <img src="${vehicle.inv_thumbnail}" 
                       alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
                </a>
                <div class="namePrice">
                  <hr />
                  <h2>
                    <a href="/inv/detail/${vehicle.inv_id}" 
                       title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                      ${vehicle.inv_make} ${vehicle.inv_model}
                    </a>
                  </h2>
                  <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
                </div>
              </li>`
    })
    grid += '</ul>'
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

async function buildInventoryDetail(data) {
  let detail = `
    <section class="vehicle-detail">
      <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}" class="vehicle-image" />
      <div class="vehicle-info">
        <h2>${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>
        <p><strong>Price:</strong> $${Number(data.inv_price).toLocaleString()}</p>
        <p><strong>Description:</strong> ${data.inv_description}</p>
        <p><strong>Color:</strong> ${data.inv_color}</p>
        <p><strong>Mileage:</strong> ${Number(data.inv_miles).toLocaleString()} miles</p>
      </div>
    </section>
  `
  return detail
}

module.exports = {
  getNav,
  handleErrors,
  buildClassificationGrid,
  buildInventoryDetail
}