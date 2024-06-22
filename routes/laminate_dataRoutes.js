const express = require('express');
const router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const laminate_dataController = require('../controllers/laminate_dataController.js');
const upload = multer({ dest: 'uploads/' }); // for file uploads
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
router.get('/', laminate_dataController.search);

/*
 * PUT
 */
router.put('/:id', laminate_dataController.update);

/*
 * DELETE
 */
router.delete('/:id', laminate_dataController.remove);
router.post('/upload-csv', upload.single('file'), laminate_dataController.uploadCsv);

module.exports = router;
