const express = require('express');
const router = express.Router();
const adminsController = require('../controllers/adminsController.js');

/*
 * GET
 */
router.get('/', adminsController.list);

/*
 * GET
 */
router.get('/:id', adminsController.show);

/*
 * POST
 */
router.post('/', adminsController.create);

/*
 * PUT
 */
router.put('/:id', adminsController.update);

/*
 * DELETE
 */
router.delete('/:id', adminsController.remove);

module.exports = router;
