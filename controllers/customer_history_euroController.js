const Customer_history_euroModel = require('../models/customer_history_euroModel.js');

/**
 * customer_history_euroController.js
 *
 * @description :: Server-side logic for managing customer_history_euros.
 */
module.exports = {

    /**
     * customer_history_euroController.list()
     */
    list: async function (req, res) {
        const all = await Customer_history_euroModel.find({})

        return res.json(all);

    },

    /**
     * customer_history_euroController.show()
     */
    show: async function (req, res) {
        const id = req.params.id;
        const customer_history_euro = await Customer_history_euroModel.findOne({ _id: id }).exec()
        if (customer_history_euro != null) {
            return res.json(customer_history_euro);
        } else {
            return res.json({ "message": "not found !" });
        }

  
    },

    /**
     * customer_history_euroController.create()
     */
    create: async function (req, res) {
        const customer_history_euro = new Customer_history_euroModel({
			title : req.body.title,
			active : req.body.active});
            try {
                await Customer_history_euroModel.create(customer_history_euro);
        return res.status(201).json(customer_history_euro)
            } catch (e) {
            return res.status(400).json({ "message": "Error" + e })

        }

},

/**
 * customer_history_euroController.update()
 */
update: async function (req, res) {
    const id = req.params.id;
    const customer_history_euro = await Customer_history_euroModel.findOne({ _id: id }).exec()
    if (customer_history_euro != null) {
        // update
        customer_history_euro.title = req.body.title ? req.body.title : customer_history_euro.title;
			customer_history_euro.active = req.body.active ? req.body.active : customer_history_euro.active;
			
        await Customer_history_euroModel.updateOne({_id: id },customer_history_euro).exec()
        return res.json(customer_history_euro);
    } else {
        // create
        return res.status(400).json({ "message": "Error" })
       
    }
},

/**
 * customer_history_euroController.remove()
 */
remove: async function (req, res) {
    const id = req.params.id;
   await Customer_history_euroModel.findByIdAndDelete(id).exec();
        return res.status(204).json();

}
};