const Sales_ordersModel = require("../models/sales_ordersModel.js");

/**
 * sales_ordersController.js
 *
 * @description :: Server-side logic for managing sales_orderss.
 */
module.exports = {
  /**
   * sales_ordersController.list()
   */
  list: async function (req, res) {
    const all = await Sales_ordersModel.find({
        spid : req.auth.uuid
    });

    return res.json(all);
  },

  /**
   * sales_ordersController.show()
   */
  show: async function (req, res) {
    const id = req.params.id;
    const sales_orders = await Sales_ordersModel.findOne({ _id: id }).exec();
    if (sales_orders != null) {
      return res.json(sales_orders);
    } else {
      return res.json({ message: "not found !" });
    }
  },

  /**
   * sales_ordersController.create()
   */
  create: async function (req, res) {
    const sales_orders = new Sales_ordersModel({
      comp_id: req.body.comp_id,
      customer_name: req.body.customer_name,
      item: req.body.item,
      quantity: req.body.quantity,
      spid: req.auth.uuid,
    });
    try {
      await Sales_ordersModel.create(sales_orders);
      return res.status(201).json(sales_orders);
    } catch (e) {
      return res.status(400).json({ message: "Error" + e });
    }
  },

  /**
   * sales_ordersController.update()
   */
  update: async function (req, res) {
    const id = req.params.id;
    const sales_orders = await Sales_ordersModel.findOne({ _id: id }).exec();
    if (sales_orders != null) {
      // update
      sales_orders.comp_id = req.body.comp_id
        ? req.body.comp_id
        : sales_orders.comp_id;
      sales_orders.customer_name = req.body.customer_name
        ? req.body.customer_name
        : sales_orders.customer_name;
      sales_orders.item = req.body.item ? req.body.item : sales_orders.item;
      sales_orders.quantity = req.body.quantity
        ? req.body.quantity
        : sales_orders.quantity;
      sales_orders.spid = req.auth.uuid ? req.auth.uuid : sales_orders.spid;

      await Sales_ordersModel.updateOne({ _id: id }, sales_orders).exec();
      return res.json(sales_orders);
    } else {
      // create
      return res.status(400).json({ message: "Error" });
    }
  },

  /**
   * sales_ordersController.remove()
   */
  remove: async function (req, res) {
    const id = req.params.id;
    await Sales_ordersModel.findByIdAndDelete(id).exec();
    return res.status(204).json();
  },
};
