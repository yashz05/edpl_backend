const Dispatch_ordersModel = require("../models/dispatch_ordersModel.js");

/**
 * dispatch_ordersController.js
 *
 * @description :: Server-side logic for managing dispatch_orderss.
 */
module.exports = {
  /**
   * dispatch_ordersController.list()
   */
  list: async function (req, res) {
    const all = await Dispatch_ordersModel.find({
      spid: req.auth.uuid,
    });

    return res.json(all);
  },

  /**
   * dispatch_ordersController.show()
   */
  show: async function (req, res) {
    const id = req.params.id;
    const dispatch_orders = await Dispatch_ordersModel.findOne({
      _id: id,
    }).exec();
    if (dispatch_orders != null) {
      return res.json(dispatch_orders);
    } else {
      return res.json({ message: "not found !" });
    }
  },

  /**
   * dispatch_ordersController.create()
   */
  create: async function (req, res) {
    const dispatch_orders = new Dispatch_ordersModel({
      comp_id: req.body.comp_id,
      customer_name: req.body.customer_name,
      item: req.body.item,
      quantity: req.body.quantity,
      spid: req.body.spid,
    });
    try {
      await Dispatch_ordersModel.create(dispatch_orders);
      return res.status(201).json(dispatch_orders);
    } catch (e) {
      return res.status(400).json({ message: "Error" + e });
    }
  },

  /**
   * dispatch_ordersController.update()
   */
  update: async function (req, res) {
    const id = req.params.id;
    const dispatch_orders = await Dispatch_ordersModel.findOne({
      _id: id,
    }).exec();
    if (dispatch_orders != null) {
      // update
      dispatch_orders.comp_id = req.body.comp_id
        ? req.body.comp_id
        : dispatch_orders.comp_id;
      dispatch_orders.customer_name = req.body.customer_name
        ? req.body.customer_name
        : dispatch_orders.customer_name;
      dispatch_orders.item = req.body.item
        ? req.body.item
        : dispatch_orders.item;
      dispatch_orders.quantity = req.body.quantity
        ? req.body.quantity
        : dispatch_orders.quantity;
      dispatch_orders.spid = req.body.spid
        ? req.body.spid
        : dispatch_orders.spid;

      await Dispatch_ordersModel.updateOne({ _id: id }, dispatch_orders).exec();
      return res.json(dispatch_orders);
    } else {
      // create
      return res.status(400).json({ message: "Error" });
    }
  },

  /**
   * dispatch_ordersController.remove()
   */
  remove: async function (req, res) {
    const id = req.params.id;
    await Dispatch_ordersModel.findByIdAndDelete(id).exec();
    return res.status(204).json();
  },
};
