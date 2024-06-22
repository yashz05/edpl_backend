const express = require('express');
const router = express.Router();
const customer_historyController = require('../controllers/customer_historyController.js');

/*
 * GET
 */
router.get('/', customer_historyController.list);

/*
 * GET
 */
router.get('/:id', customer_historyController.show);

/*
 * POST
 */
router.post('/', customer_historyController.create);

/*
 * PUT
 */
router.put('/:id', customer_historyController.update);

/*
 * DELETE
 */
router.delete('/:id', customer_historyController.remove);

module.exports = router;
