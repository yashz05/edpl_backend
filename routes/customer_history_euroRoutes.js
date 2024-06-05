const express = require('express');
const router = express.Router();
const customer_history_euroController = require('../controllers/customer_history_euroController.js');

/*
 * GET
 */
router.get('/', customer_history_euroController.list);

/*
 * GET
 */
router.get('/:id', customer_history_euroController.show);

/*
 * POST
 */
router.post('/', customer_history_euroController.create);

/*
 * PUT
 */
router.put('/:id', customer_history_euroController.update);

/*
 * DELETE
 */
router.delete('/:id', customer_history_euroController.remove);

module.exports = router;
