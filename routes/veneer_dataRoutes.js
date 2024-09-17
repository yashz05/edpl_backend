const express = require("express");
const router = express.Router();
const veneer_dataController = require("../controllers/veneer_dataController.js");
const csv = require("csv-parser");
const fs = require("fs");
const multer = require("multer");
// const laminate_dataController = require('../controllers/laminate_dataController.js');
const upload = multer({ dest: "uploads/" }); //
const Veneer_dataModel = require('../models/veneer_dataModel.js');
/*
 * GET
 */
router.get("/", veneer_dataController.list);

/*
 * GET
 */
router.get("/:id", veneer_dataController.show);

/*
 * POST
 */
router.post("/", veneer_dataController.create);

/*
 * PUT
 */
router.put("/:id", veneer_dataController.update);

/*
 * DELETE
 */
router.delete("/:id", veneer_dataController.remove);
router.post(
  "/upload-csv",
  upload.single("file"),
  veneer_dataController.uploadCsv
);

router.get('/veneer/search/:name', async (req, res) => {
  try {
      const companyName = req.params.name;

      // Perform the search based on partial company name using regex
      const companies = await Veneer_dataModel.find({ 
        ItemName: { $regex: companyName, $options: 'i' } // 'i' makes it case-insensitive
      }).limit(5);
      
      console.log(companyName);

      // Return the search results
      res.status(200).json(companies);
  } catch (error) {
      // Handle errors
      res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
