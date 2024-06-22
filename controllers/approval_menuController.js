const Approval_menuModel = require('../models/approval_menuModel.js');
const salesperson = require("../models/sales_teamModel.js");
/**
 * approval_menu Controller.js
 *
 * @description :: Server-side logic for managing approval_menu s.
 */
module.exports = {

    /**
     * approval_menu Controller.list()
     */
    list: async function (req, res) {
        
        const all = await Approval_menuModel.find({})

        return res.json(all);

    },

    /**
     * approval_menu Controller.show()
     */
    show: async function (req, res) {
        const id = req.params.id;
        const approval_menu  = await Approval_menuModel.findOne({ _id: id }).exec()
        if (approval_menu  != null) {
            return res.json(approval_menu );
        } else {
            return res.json({ "message": "not found !" });
        }

  
    },

    /**
     * approval_menu Controller.create()
     */
    create: async function (req, res) {
        const approval_menu  = new Approval_menuModel({
			client_name : req.body.client_name,
			project_name : req.body.project_name,
			item_design : req.body.item_design,
			tentative_qty : req.body.tentative_qty,
			from : req.body.from,
			to : req.body.to,
			rates : req.body.rates,
			approved_by : req.body.approved_by,
			contractor : req.body.contractor});
            try {
                await Approval_menuModel.create(approval_menu );
        return res.status(201).json(approval_menu )
            } catch (e) {
            return res.status(400).json({ "message": "Error" + e })

        }

},

/**
 * approval_menu Controller.update()
 */
update: async function (req, res) {
    const id = req.params.id;
    const approval_menu  = await Approval_menuModel.findOne({ _id: id }).exec()
    if (approval_menu  != null) {
        // update
        approval_menu .client_name = req.body.client_name ? req.body.client_name : approval_menu .client_name;
			approval_menu .project_name = req.body.project_name ? req.body.project_name : approval_menu .project_name;
			approval_menu .item_design = req.body.item_design ? req.body.item_design : approval_menu .item_design;
			approval_menu .tentative_qty = req.body.tentative_qty ? req.body.tentative_qty : approval_menu .tentative_qty;
			approval_menu .from = req.body.from ? req.body.from : approval_menu .from;
			approval_menu .to = req.body.to ? req.body.to : approval_menu .to;
			approval_menu .rates = req.body.rates ? req.body.rates : approval_menu .rates;
			approval_menu .approved_by = req.body.approved_by ? req.body.approved_by : approval_menu .approved_by;
			approval_menu .contractor = req.body.contractor ? req.body.contractor : approval_menu .contractor;
			
        await Approval_menuModel.updateOne({_id: id },approval_menu ).exec()
        return res.json(approval_menu );
    } else {
        // create
        return res.status(400).json({ "message": "Error" })
       
    }
},

/**
 * approval_menu Controller.remove()
 */
remove: async function (req, res) {
    const id = req.params.id;
   await Approval_menuModel.findByIdAndDelete(id).exec();
        return res.status(204).json();

}
};