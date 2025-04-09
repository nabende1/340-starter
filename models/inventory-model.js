const pool = require("../database/");

/* ***************************
 *  Get all classification data
 *************************** */
async function getClassifications() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );
    return data.rows; // Return rows instead of full query result
  } catch (error) {
    console.error("Error in getClassifications:", error);
    throw error; // Propagate error to middleware
  }
}

/* ***************************
 *  Get inventory items by classification_id
 *************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error);
    throw error;
  }
}


async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0]; // single record
  } catch (error) {
    console.error("getInventoryById error " + error);
  }
}


module.exports = { getClassifications, getInventoryByClassificationId };
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
};
