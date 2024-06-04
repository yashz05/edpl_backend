const express = require('express');
const router = express.Router();
const photosController = require('../controllers/photosController.js');
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
router.get('/', photosController.list);

/*
 * GET
 */
router.get('/:id', photosController.show);

/*
 * POST
 */
router.post('/',upload.single('file'), photosController.create);

/*
 * PUT
 */
router.put('/:id', photosController.update);

/*
 * DELETE
 */
router.delete('/:id', photosController.remove);

module.exports = router;
