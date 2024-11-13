const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController.js');
const CompanyModel = require("../models/companyModel.js");

/*
 * GET
 */
router.get('/', companyController.list);
router.get('/all', companyController.list2);
router.options('/', companyController.list);
router.get('/byid', companyController.getbyid);


/*
 * GET
 */
router.get('/:id', companyController.show);

/*
 * POST
 */
router.post('/', companyController.create);

/*
 * PUT
 */
router.put('/:id', companyController.update);

/*
 * DELETE
 */
router.delete('/:id', companyController.remove);
router.get('/companies/search/:name', async (req, res) => {
    try {
        const companyName = req.params.name;

        // Perform the search based on partial company name using regex
        const companies = await CompanyModel.find({ 
            name: { $regex: companyName, $options: 'i' } // 'i' makes it case-insensitive
        }).limit(5);
        
        

        // Return the search results
        res.status(200).json(companies);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
