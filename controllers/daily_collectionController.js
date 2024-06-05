const Daily_collectionModel = require('../models/daily_collectionModel.js');

/**
 * daily_collectionController.js
 *
 * @description :: Server-side logic for managing daily_collections.
 */
module.exports = {

    /**
     * daily_collectionController.list()
     */
    list: async function (req, res) {
        const all = await Daily_collectionModel.find({})

        return res.json(all);

    },

    /**
     * daily_collectionController.show()
     */
    show: async function (req, res) {
        const id = req.params.id;
        const daily_collection = await Daily_collectionModel.findOne({ _id: id }).exec()
        if (daily_collection != null) {
            return res.json(daily_collection);
        } else {
            return res.json({ "message": "not found !" });
        }

  
    },

    /**
     * daily_collectionController.create()
     */
    create: async function (req, res) {
        const daily_collection = new Daily_collectionModel({
			customer_name : req.body.customer_name,
			amount : req.body.amount,
			spid : req.body.spid});
            try {
                await Daily_collectionModel.create(daily_collection);
        return res.status(201).json(daily_collection)
            } catch (e) {
            return res.status(400).json({ "message": "Error" + e })

        }

},

/**
 * daily_collectionController.update()
 */
update: async function (req, res) {
    const id = req.params.id;
    const daily_collection = await Daily_collectionModel.findOne({ _id: id }).exec()
    if (daily_collection != null) {
        // update
        daily_collection.customer_name = req.body.customer_name ? req.body.customer_name : daily_collection.customer_name;
			daily_collection.amount = req.body.amount ? req.body.amount : daily_collection.amount;
			daily_collection.spid = req.body.spid ? req.body.spid : daily_collection.spid;
			
        await Daily_collectionModel.updateOne({_id: id },daily_collection).exec()
        return res.json(daily_collection);
    } else {
        // create
        return res.status(400).json({ "message": "Error" })
       
    }
},

/**
 * daily_collectionController.remove()
 */
remove: async function (req, res) {
    const id = req.params.id;
   await Daily_collectionModel.findByIdAndDelete(id).exec();
        return res.status(204).json();

}
};