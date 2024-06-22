const express = require("express");
const router = express.Router();
const sales_teamController = require("../controllers/sales_teamController.js");

/*
 * GET
 */
router.get('/', sales_teamController.list);

/*
 * GET
 */
router.get('/:id', sales_teamController.show);

/*
 * POST
 */
router.post("/", sales_teamController.create);
/*
 * POST
 */
router.post("/login", sales_teamController.login);

/*
 * PUT
 */
router.put("/:id", sales_teamController.update);

/*
 * DELETE
 */
router.delete("/:id", sales_teamController.remove);

module.exports = router;
