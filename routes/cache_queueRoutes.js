const express = require('express');
const router = express.Router();
const cache_queueController = require('../controllers/cache_queueController.js');

/*
 * GET
 */
router.get('/', cache_queueController.list);

/*
 * GET
 */
router.get('/:id', cache_queueController.show);

/*
 * POST
 */
router.post('/', cache_queueController.create);

/*
 * PUT
 */
router.put('/:id', cache_queueController.update);

/*
 * DELETE
 */
router.delete('/:id', cache_queueController.remove);

module.exports = router;
