const express = require('express');
const router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const laminate_dataController = require('../controllers/laminate_dataController.js');
const upload = multer({ dest: 'uploads/' }); // for file uploads
const laminate_dataModel = require('../models/laminate_dataModel.js');
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

router.get('/laminate/search/:name', async (req, res) => {
    try {
        const companyName = req.params.name;
  
        // Perform the search based on partial company name using regex
        const companies = await laminate_dataModel.find({ 
          ItemName: { $regex: companyName, $options: 'i' } // 'i' makes it case-insensitive
        }).limit(5);
        
        
  
        // Return the search results
        res.status(200).json(companies);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Internal server error' });
    }
  });
module.exports = router;
