const express = require('express');
const router = express.Router();
const customer_gradeController = require('../controllers/customer_gradeController.js');

/*
 * GET
 */
router.get('/', customer_gradeController.list);

/*
 * GET
 */
router.get('/:id', customer_gradeController.show);

/*
 * POST
 */
router.post('/', customer_gradeController.create);

/*
 * PUT
 */
router.put('/:id', customer_gradeController.update);

/*
 * DELETE
 */
router.delete('/:id', customer_gradeController.remove);

module.exports = router;
