const express = require("express");
const router = express.Router();
const catalogueController = require("../controllers/catalogueController.js");
const csv = require("csv-parser");
const fs = require("fs");
const multer = require("multer");
// const laminate_dataController = require('../controllers/laminate_dataController.js');
const upload = multer({ dest: "uploads/" }); //
/*
 * GET
 */
router.get("/", catalogueController.list);

/*
 * GET
 */
router.get("/:id", catalogueController.show);

/*
 * POST
 */
router.post("/", catalogueController.create);

/*
 * PUT
 */
router.put("/:id", catalogueController.update);

/*
 * DELETE
 */
router.delete("/:id", catalogueController.remove);

router.post(
  "/upload-csv",
  upload.single("file"),
  catalogueController.uploadCsv
);
module.exports = router;
