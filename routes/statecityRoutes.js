const express = require('express');
const router = express.Router();
const statecityController = require('../controllers/statecityController.js');

/*
 * GET
 */
router.get('/', statecityController.list);

/*
 * GET
 */
router.get('/:id', statecityController.show);

/*
 * POST
 */
router.post('/', statecityController.create);

/*
 * PUT
 */
router.put('/:id', statecityController.update);

/*
 * DELETE
 */
router.delete('/:id', statecityController.remove);

module.exports = router;
