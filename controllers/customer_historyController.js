const Customer_historyModel = require('../models/customer_historyModel.js');

/**
 * customer_historyController.js
 *
 * @description :: Server-side logic for managing customer_historys.
 */
module.exports = {

    /**
     * customer_historyController.list()
     */
    list: async function (req, res) {
        const all = await Customer_historyModel.find({})

        return res.json(all);

    },

    /**
     * customer_historyController.show()
     */
    show: async function (req, res) {
        const id = req.params.id;
        const customer_history = await Customer_historyModel.findOne({ _id: id }).exec()
        if (customer_history != null) {
            return res.json(customer_history);
        } else {
            return res.json({ "message": "not found !" });
        }

  
    },

    /**
     * customer_historyController.create()
     */
    create: async function (req, res) {
        const customer_history = new Customer_historyModel({
			title : req.body.title,
			active : req.body.active});
            try {
                await Customer_historyModel.create(customer_history);
        return res.status(201).json(customer_history)
            } catch (e) {
            return res.status(400).json({ "message": "Error" + e })

        }

},

/**
 * customer_historyController.update()
 */
update: async function (req, res) {
    const id = req.params.id;
    const customer_history = await Customer_historyModel.findOne({ _id: id }).exec()
    if (customer_history != null) {
        // update
        customer_history.title = req.body.title ? req.body.title : customer_history.title;
			customer_history.active = req.body.active ? req.body.active : customer_history.active;
			
        await Customer_historyModel.updateOne({_id: id },customer_history).exec()
        return res.json(customer_history);
    } else {
        // create
        return res.status(400).json({ "message": "Error" })
       
    }
},

/**
 * customer_historyController.remove()
 */
remove: async function (req, res) {
    const id = req.params.id;
   await Customer_historyModel.findByIdAndDelete(id).exec();
        return res.status(204).json();

}
};