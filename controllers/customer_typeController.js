const Customer_typeModel = require('../models/customer_typeModel.js');

/**
 * customer_typeController.js
 *
 * @description :: Server-side logic for managing customer_types.
 */
module.exports = {

    /**
     * customer_typeController.list()
     */
    list: async function (req, res) {
        const all = await Customer_typeModel.find({})

        return res.json(all);

    },

    /**
     * customer_typeController.show()
     */
    show: async function (req, res) {
        const id = req.params.id;
        const customer_type = await Customer_typeModel.findOne({ _id: id }).exec()
        if (customer_type != null) {
            return res.json(customer_type);
        } else {
            return res.json({ "message": "not found !" });
        }

  
    },

    /**
     * customer_typeController.create()
     */
    create: async function (req, res) {
        const customer_type = new Customer_typeModel({
			title : req.body.title,
			active : req.body.active});
            try {
                await Customer_typeModel.create(customer_type);
        return res.status(201).json(customer_type)
            } catch (e) {
            return res.status(400).json({ "message": "Error" + e })

        }

},

/**
 * customer_typeController.update()
 */
update: async function (req, res) {
    const id = req.params.id;
    const customer_type = await Customer_typeModel.findOne({ _id: id }).exec()
    if (customer_type != null) {
        // update
        customer_type.title = req.body.title ? req.body.title : customer_type.title;
			customer_type.active = req.body.active ? req.body.active : customer_type.active;
			
        await Customer_typeModel.updateOne({_id: id },customer_type).exec()
        return res.json(customer_type);
    } else {
        // create
        return res.status(400).json({ "message": "Error" })
       
    }
},

/**
 * customer_typeController.remove()
 */
remove: async function (req, res) {
    const id = req.params.id;
   await Customer_typeModel.findByIdAndDelete(id).exec();
        return res.status(204).json();

}
};