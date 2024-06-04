const express = require('express');
const router = express.Router();
const approval_menuController = require('../controllers/approval_menuController.js');

/*
 * GET
 */
router.get('/', approval_menuController.list);

/*
 * GET
 */
router.get('/:id', approval_menuController.show);

/*
 * POST
 */
router.post('/', approval_menuController.create);

/*
 * PUT
 */
router.put('/:id', approval_menuController.update);

/*
 * DELETE
 */
router.delete('/:id', approval_menuController.remove);

module.exports = router;
