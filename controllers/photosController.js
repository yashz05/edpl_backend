const PhotosModel = require("../models/photosModel.js");


/**
 * photosController.js
 *
 * @description :: Server-side logic for managing photoss.
 */
module.exports = {
  /**
   * photosController.list()
   */
  list: async function (req, res) {
    const all = await PhotosModel.find({});

    return res.json(all);
  },

  /**
   * photosController.show()
   */
  show: async function (req, res) {
    const id = req.params.id;
    const photos = await PhotosModel.find({ parent_dir: id }).exec();
    if (photos != null) {
      return res.json(photos);
    } else {
      return res.json({ message: "not found !" });
    }
  },

  /**
   * photosController.create()
   */
  create: async function (req, res) {
    try {
        const filesPromises = req.files.map(async (file) => {
            const photo = new PhotosModel({
                parent_dir: req.body.parent_dir,
                sub_dir: req.body.sub_dir,
                file_name: file.filename,
                name: req.body.name
            });
            await photo.save();
            return photo;
        });

        const photos = await Promise.all(filesPromises);
        res.status(201).json(photos);
    } catch (e) {
        res.status(400).json({ message: "Error: " + e });
    }
},




  // Name of the Client
// Project Name & Location
// Item Design (Veneer/Mica)
// Tentative Quantity (Pcs.)
// Tentative Period (From & To)
// Rates Approved
// Approved By Designer?
// Contractor/Door Mfr.?

  /**
   * photosController.update()
   */
  update: async function (req, res) {
    const id = req.params.id;
    const photos = await PhotosModel.findOne({ _id: id }).exec();
    if (photos != null) {
      // update
      photos.parent_dir = req.body.parent_dir
        ? req.body.parent_dir
        : photos.parent_dir;
      photos.sub_dir = req.body.sub_dir ? req.body.sub_dir : photos.sub_dir;
      photos.file_name = req.body.file_name
        ? req.body.file_name
        : photos.file_name;

      await PhotosModel.updateOne({ _id: id }, photos).exec();
      return res.json(photos);
    } else {
      // create
      return res.status(400).json({ message: "Error" });
    }
  },

  /**
   * photosController.remove()
   */
  remove: async function (req, res) {
    const id = req.params.id;
    await PhotosModel.findByIdAndDelete(id).exec();
    return res.status(204).json();
  },
};
