const express = require('express');
const router = express.Router();
const laminate_dataController = require('../controllers/laminate_dataController.js');

/*
 * GET
 */
router.get('/', laminate_dataController.list);

/*
 * GET
 */
router.get('/:id', laminate_dataController.show);

/*
 * POST
 */
router.post('/', laminate_dataController.create);

/*
 * PUT
 */
router.put('/:id', laminate_dataController.update);

/*
 * DELETE
 */
router.delete('/:id', laminate_dataController.remove);

module.exports = router;
