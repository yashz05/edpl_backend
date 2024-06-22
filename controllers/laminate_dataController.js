const Laminate_dataModel = require("../models/laminate_dataModel.js");
const csv = require("csv-parser");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // for file uploads
/**
 * laminate_dataController.js
 *
 * @description :: Server-side logic for managing laminate_datas.
 */
module.exports = {
  /**
   * laminate_dataController.list()
   */
  list: async function (req, res) {
    var all  = []
    if(req.query.hasOwnProperty('title_like')){
      console.log(req.query.title_like)
      all= await  Laminate_dataModel.find({ItemName: { $regex: '.*' + req.query.title_like + '.*' } }).limit(200);
    }else{
      all = await Laminate_dataModel.find({});
    }
    

    return res.json(all);
  },

  /**
   * laminate_dataController.show()
   */
  show: async function (req, res) {
    const id = req.params.id;
    const laminate_data = await Laminate_dataModel.findOne({ _id: id }).exec();
    if (laminate_data != null) {
      return res.json(laminate_data);
    } else {
      return res.json({ message: "not found !" });
    }
  },
   /**
   * laminate_dataController.search()
   */
  search: async function (req, res) {
    const id = req.params.id;
    const laminate_data = await  Laminate_dataModel.find({name: { $regex: '.*' + req.query.title_like + '.*' } }).limit(200);
    // Laminate_dataModel.find({name: { $regex: '.*' + req.query.title_like + '.*' } }).limit(5);
    if (laminate_data != null) {
      return res.json(laminate_data);
    } else {
      return res.json({ message: "not found !" });
    }
  },

  /**
   * laminate_dataController.create()
   */
  create: async function (req, res) {
    const laminate_data = new Laminate_dataModel({
      SrNo: req.body.SrNo,
      ItemName: req.body.ItemName,
      Category: req.body.Category,
    });
    try {
      await Laminate_dataModel.create(laminate_data);
      return res.status(201).json(laminate_data);
    } catch (e) {
      return res.status(400).json({ message: "Error" + e });
    }
  },

  /**
   * laminate_dataController.update()
   */
  update: async function (req, res) {
    const id = req.params.id;
    const laminate_data = await Laminate_dataModel.findOne({ _id: id }).exec();
    if (laminate_data != null) {
      // update
      laminate_data.SrNo = req.body.SrNo ? req.body.SrNo : laminate_data.SrNo;
      laminate_data.ItemName = req.body.ItemName
        ? req.body.ItemName
        : laminate_data.ItemName;
      laminate_data.Category = req.body.Category
        ? req.body.Category
        : laminate_data.Category;

      await Laminate_dataModel.updateOne({ _id: id }, laminate_data).exec();
      return res.json(laminate_data);
    } else {
      // create
      return res.status(400).json({ message: "Error" });
    }
  },
  uploadCsv: async function (req, res) {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          // Filter out records with existing ItemNames
          const existingItems = await Laminate_dataModel.find({
            ItemName: { $in: results.map((item) => item.ItemName) },
          }).select("ItemName");

          const existingItemNames = new Set(
            existingItems.map((item) => item.ItemName)
          );
          const newItems = results.filter(
            (item) => !existingItemNames.has(item.ItemName)
          );

          // Bulk insert new items
          if (newItems.length > 0) {
            await Laminate_dataModel.insertMany(newItems);
          }

          res
            .status(201)
            .json({
              message: "Data processed successfully",
              newItemsCount: newItems.length,
            });
        } catch (error) {
          res
            .status(500)
            .json({ message: "Error processing data: " + error.message });
        } finally {
          // Delete the uploaded file
          fs.unlink(req.file.path, (err) => {
            if (err) console.error("Failed to delete uploaded file:", err);
          });
        }
      });
  },
  /**
   * laminate_dataController.remove()
   */
  remove: async function (req, res) {
    const id = req.params.id;
    await Laminate_dataModel.findByIdAndDelete(id).exec();
    return res.status(204).json();
  },
};
