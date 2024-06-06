const express = require('express');
const router = express.Router();
const daily_visitController = require('../controllers/daily_visitController.js');

/*
 * GET
 */
router.get('/', daily_visitController.list);

/*
 * GET
 */
router.get('/:id', daily_visitController.show);

/*
 * POST
 */
router.post('/', daily_visitController.create);

/*
 * PUT
 */
router.put('/:id', daily_visitController.update);

/*
 * DELETE
 */
router.delete('/:id', daily_visitController.remove);

module.exports = router;
