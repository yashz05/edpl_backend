const express = require("express");
const router = express.Router();
const sales_ordersController = require("../controllers/sales_ordersController.js");

/*
 * GET
 */
router.get("/", sales_ordersController.list);

/*
 * GET
 */
router.get("/:id", sales_ordersController.show);
/*
* GET 
*/
router.get("/overview/:id", sales_ordersController.summ);

/*
 * POST
 */
router.post("/", sales_ordersController.create);

/*
 * PUT
 */
router.put("/:id", sales_ordersController.update);

/*
 * DELETE
 */
router.delete("/:id", sales_ordersController.remove);

module.exports = router;
