const express = require('express');
const router = express.Router();
const daily_collectionController = require('../controllers/daily_collectionController.js');

/*
 * GET
 */
router.get('/', daily_collectionController.list);

/*
 * GET
 */
router.get('/:id', daily_collectionController.show);

/*
 * POST
 */
router.post('/', daily_collectionController.create);

/*
 * PUT
 */
router.put('/:id', daily_collectionController.update);

/*
 * DELETE
 */
router.delete('/:id', daily_collectionController.remove);

module.exports = router;
