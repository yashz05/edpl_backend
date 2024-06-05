const express = require('express');
const router = express.Router();
const sample_request_companyController = require('../controllers/sample_request_companyController.js');

/*
 * GET
 */
router.get('/', sample_request_companyController.list);

/*
 * GET
 */
router.get('/:id', sample_request_companyController.show);

/*
 * POST
 */
router.post('/', sample_request_companyController.create);

/*
 * PUT
 */
router.put('/:id', sample_request_companyController.update);

/*
 * DELETE
 */
router.delete('/:id', sample_request_companyController.remove);

module.exports = router;
