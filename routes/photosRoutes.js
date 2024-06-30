const express = require("express");
const router = express.Router();
const PhotosModel = require("../models/photosModel.js");
const photosController = require("../controllers/photosController.js");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create the multer instance
const upload = multer({ storage: storage });
/*
 * GET
 */
router.get("/", photosController.list);

/*
 * GET
 */
router.get("/:id", photosController.show);

/*
 * POST
 */
router.post("/", upload.array("file",30), photosController.create);

/*
 * PUT
 */
router.put("/:id", photosController.update);

/*
 * DELETE
 */
router.delete("/:id", photosController.remove);
router.get("/i/search", async (req, res) => {
  try {
    const { name } = req.query;
   // Log the received name for debugging

    // Check if the name query parameter exists
    if (!name) {
      return await PhotosModel.find({ });
    }

    // Perform the search
    const regex = new RegExp(name, "i"); // Case-insensitive regex
    const result = await PhotosModel.find({ name: regex });

    // Check if any results were found
    if (result.length === 0) {
      return res.status(404).json({ message: "No matching photos found" });
    }

    res.json(result);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
