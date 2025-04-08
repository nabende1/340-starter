const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    const classifications = await invModel.getClassifications(); // classifications is already an array of rows
    let list = '<ul class="nav-menu">';
    list += '<li><a href="/" title="Home page">Home</a></li>';
    
    classifications.forEach((row) => { // Directly use classifications array (NO .rows)
      list += '<li>';
      list += `<a href="/inv/type/${row.classification_id}" 
                 title="See our inventory of ${row.classification_name} vehicles">
                 ${row.classification_name}
               </a>`;
      list += '</li>';
    });
    
    list += '</ul>';
    return list;
  } catch (error) {
    console.error("Error building navigation:", error);
    // Return basic navigation as fallback
    return '<ul class="nav-menu"><li><a href="/">Home</a></li></ul>';
  }
};

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

/* **************************************
 * Build the classification view HTML
 ************************************** */
Util.buildClassificationGrid = async function(data) {
  let grid = ''; // Initialize grid variable
  
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => { 
      grid += `<li>
                <a href="../../inv/detail/${vehicle.inv_id}" 
                   title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                  <img src="${vehicle.inv_thumbnail}" 
                       alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
                </a>
                <div class="namePrice">
                  <hr />
                  <h2>
                    <a href="../../inv/detail/${vehicle.inv_id}" 
                       title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                      ${vehicle.inv_make} ${vehicle.inv_model}
                    </a>
                  </h2>
                  <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
                </div>
              </li>`;
    });
    grid += '</ul>';
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

module.exports = Util;