const express = require('express');
const router = express.Router();
const dispatch_ordersController = require('../controllers/dispatch_ordersController.js');

/*
 * GET
 */
router.get('/', dispatch_ordersController.list);

/*
 * GET
 */
router.get('/:id', dispatch_ordersController.show);

/*
 * POST
 */
router.post('/', dispatch_ordersController.create);

/*
 * PUT
 */
router.put('/:id', dispatch_ordersController.update);

/*
 * DELETE
 */
router.delete('/:id', dispatch_ordersController.remove);

module.exports = router;
