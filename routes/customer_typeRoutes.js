const express = require('express');
const router = express.Router();
const customer_typeController = require('../controllers/customer_typeController.js');

/*
 * GET
 */
router.get('/', customer_typeController.list);

/*
 * GET
 */
router.get('/:id', customer_typeController.show);

/*
 * POST
 */
router.post('/', customer_typeController.create);

/*
 * PUT
 */
router.put('/:id', customer_typeController.update);

/*
 * DELETE
 */
router.delete('/:id', customer_typeController.remove);

module.exports = router;
