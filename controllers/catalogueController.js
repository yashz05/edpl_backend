const CatalogueModel = require('../models/catalogueModel.js');
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // for file uploads

/**
 * catalogueController.js
 *
 * @description :: Server-side logic for managing catalogues.
 */
module.exports = {

    /**
     * catalogueController.list()
     */
    list: async function (req, res) {
        const all = await CatalogueModel.find({});
        return res.json(all);
    },

    /**
     * catalogueController.show()
     */
    show: async function (req, res) {
        const id = req.params.id;
        const catalogue = await CatalogueModel.findOne({ _id: id }).exec();
        if (catalogue != null) {
            return res.json(catalogue);
        } else {
            return res.json({ "message": "not found !" });
        }
    },

    /**
     * catalogueController.create()
     */
    create: async function (req, res) {
        const catalogue = new CatalogueModel({
            ItemName: req.body.ItemName
        });
        try {
            await CatalogueModel.create(catalogue);
            return res.status(201).json(catalogue);
        } catch (e) {
            return res.status(400).json({ "message": "Error" + e });
        }
    },

    /**
     * catalogueController.update()
     */
    update: async function (req, res) {
        const id = req.params.id;
        const catalogue = await CatalogueModel.findOne({ _id: id }).exec();
        if (catalogue != null) {
            // update
            catalogue.ItemName = req.body.ItemName ? req.body.ItemName : catalogue.ItemName;

            await CatalogueModel.updateOne({ _id: id }, catalogue).exec();
            return res.json(catalogue);
        } else {
            // create
            return res.status(400).json({ "message": "Error" });
        }
    },

    /**
     * catalogueController.remove()
     */
    remove: async function (req, res) {
        const id = req.params.id;
        await CatalogueModel.findByIdAndDelete(id).exec();
        return res.status(204).json();
    },

    /**
     * catalogueController.uploadCsv()
     */
    uploadCsv: async function (req, res) {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => {
                // console.log('Parsed Data:', data); // Debug parsed data
                results.push(data);
            })
            .on('end', async () => {
                try {
                    if (results.length > 0 && results[0].hasOwnProperty('ItemName')) {
                        const existingItems = await CatalogueModel.find({
                            ItemName: { $in: results.map(item => item.ItemName) }
                        }).select('ItemName');

                        const existingItemNames = new Set(existingItems.map(item => item.ItemName));
                        const newItems = results.filter(item => !existingItemNames.has(item.ItemName));

                        if (newItems.length > 0) {
                            await CatalogueModel.insertMany(newItems);
                        }

                        res.status(201).json({ message: 'Data processed successfully', newItemsCount: newItems.length });
                    } else {
                        res.status(400).json({ message: 'CSV does not contain required fields' });
                    }
                } catch (error) {
                    res.status(500).json({ message: 'Error processing data: ' + error.message });
                } finally {
                    fs.unlink(req.file.path, (err) => {
                        if (err) console.error('Failed to delete uploaded file:', err);
                    });
                }
            });
    }
};

