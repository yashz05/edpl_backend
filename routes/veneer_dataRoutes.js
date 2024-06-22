const express = require("express");
const router = express.Router();
const veneer_dataController = require("../controllers/veneer_dataController.js");
const csv = require("csv-parser");
const fs = require("fs");
const multer = require("multer");
// const laminate_dataController = require('../controllers/laminate_dataController.js');
const upload = multer({ dest: "uploads/" }); //
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

module.exports = router;
