const Veneer_dataModel = require('../models/veneer_dataModel.js');
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // for file uploads

/**
 * veneer_dataController.js
 *
 * @description :: Server-side logic for managing veneer_datas.
 */
module.exports = {

    /**
     * veneer_dataController.list()
     */
    list: async function (req, res) {
        const all = await Veneer_dataModel.find({})
        return res.json(all);
    },

    /**
     * veneer_dataController.show()
     */
    show: async function (req, res) {
        const id = req.params.id;
        const veneer_data = await Veneer_dataModel.findOne({ _id: id }).exec()
        if (veneer_data != null) {
            return res.json(veneer_data);
        } else {
            return res.json({ "message": "not found !" });
        }
    },

    /**
     * veneer_dataController.create()
     */
    create: async function (req, res) {
        const veneer_data = new Veneer_dataModel({
            SrNo: req.body.SrNo,
            ItemName: req.body.ItemName,
            Category: req.body.Category
        });
        try {
            await Veneer_dataModel.create(veneer_data);
            return res.status(201).json(veneer_data)
        } catch (e) {
            return res.status(400).json({ "message": "Error" + e })
        }
    },

    /**
     * veneer_dataController.update()
     */
    update: async function (req, res) {
        const id = req.params.id;
        const veneer_data = await Veneer_dataModel.findOne({ _id: id }).exec()
        if (veneer_data != null) {
            // update
            veneer_data.SrNo = req.body.SrNo ? req.body.SrNo : veneer_data.SrNo;
            veneer_data.ItemName = req.body.ItemName ? req.body.ItemName : veneer_data.ItemName;
            veneer_data.Category = req.body.Category ? req.body.Category : veneer_data.Category;

            await Veneer_dataModel.updateOne({ _id: id }, veneer_data).exec()
            return res.json(veneer_data);
        } else {
            // create
            return res.status(400).json({ "message": "Error" })
        }
    },

    /**
     * veneer_dataController.remove()
     */
    remove: async function (req, res) {
        const id = req.params.id;
        await Veneer_dataModel.findByIdAndDelete(id).exec();
        return res.status(204).json();
    },

    /**
     * veneer_dataController.uploadCsv()
     */
    uploadCsv: async function (req, res) {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => {
                // console.log('Parsed Data:', data); // Add this line to debug parsed data
                results.push(data);
            })
            .on('end', async () => {
                try {
                    // Check if results contain ItemName and other fields
                    if (results.length > 0 && results[0].hasOwnProperty('ItemName')) {
                        // Filter out records with existing ItemNames
                        const existingItems = await Veneer_dataModel.find({
                            ItemName: { $in: results.map(item => item.ItemName) }
                        }).select('ItemName');

                        const existingItemNames = new Set(existingItems.map(item => item.ItemName));
                        const newItems = results.filter(item => !existingItemNames.has(item.ItemName));

                        // Bulk insert new items
                        if (newItems.length > 0) {
                            await Veneer_dataModel.insertMany(newItems);
                        }

                        res.status(201).json({ message: 'Data processed successfully', newItemsCount: newItems.length });
                    } else {
                        res.status(400).json({ message: 'CSV does not contain required fields' });
                    }
                } catch (error) {
                    res.status(500).json({ message: 'Error processing data: ' + error.message });
                } finally {
                    // Delete the uploaded file
                    fs.unlink(req.file.path, (err) => {
                        if (err) console.error('Failed to delete uploaded file:', err);
                    });
                }
            });
    }
};

// Route to handle CSV upload

