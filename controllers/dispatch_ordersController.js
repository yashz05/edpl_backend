const Sales_ordersModel = require("../models/dispatch_ordersModel.js");
const salesperson = require("../models/sales_teamModel.js");
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
    const spid = req.auth.uuid; // Assuming spid identifies the user
    // Get today's date range
    var users_type = [];
    var u = await salesperson.findOne({
      uuid: spid,
    });
    var all = [];

    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayEnd = new Date().setHours(23, 59, 59, 999);

    try {
      if (u.access.includes("admin")) {
        const sales_orders = await Sales_ordersModel.find({});
        if (sales_orders.length > 0) {
          return res.json(sales_orders);
        } else {
          return res.json({
            message: "No Dispatch orders found for today for admin.",
          });
        }
      } else {
        const sales_orders = await Sales_ordersModel.find({
          spid: req.auth.uuid, // Filter by user's spid
          createdAt: {
            $gte: todayStart, // Greater than or equal to today's start
            $lt: todayEnd, // Less than today's end
          },
        }).exec();

        if (sales_orders.length > 0) {
          return res.json(sales_orders);
        } else {
          return res.json({ message: "No Dispatch orders found for today." });
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
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

  summ: async function (req, res) {
    const spid = req.auth.uuid; // Assuming spid identifies the user
    // Get today's date range
    var users_type = [];
    var u = await salesperson.findOne({
      uuid: spid,
    });
    var all = [];

    try {
      if (u.access.includes("admin")) {
        const sales_orders = await Sales_ordersModel.find({
          company_name: req.params.id,
        }).exec();
        if (sales_orders.length > 0) {
          return res.json(sales_orders);
        } else {
          return res.json({
            message: "No Sales  orders found for today for admin.",
          });
        }
      } else {
        const sales_orders = await Sales_ordersModel.find({
          spid: req.auth.uuid, // Filter by user's spid
          company_name: req.params.id,
        }).exec();

        if (sales_orders.length > 0) {
          return res.json(sales_orders);
        } else {
          return res.json({
            message: "No  Sales   orders found for today.",
          });
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * sales_ordersController.create()
   */
  create: async function (req, res) {
    const sales_orders = new Sales_ordersModel({
      company_name: req.body.company_name,
      item_type: req.body.item_type,
      spid: req.auth.uuid,
      v_width: req.body.v_width,
      v_length: req.body.v_length,
      item_name: req.body.item_name,
      item_qty: req.body.item_qty,
      item_rate: req.body.item_rate,
      //remark added
      remark: req.body.remark,
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
      sales_orders.company_name = req.body.company_name
        ? req.body.company_name
        : sales_orders.company_name;
      sales_orders.item_type = req.body.item_type
        ? req.body.item_type
        : sales_orders.item_type;
      sales_orders.item_name = req.body.item_name
        ? req.body.item_name
        : sales_orders.item_name;
      sales_orders.item_qty = req.body.item_qty
        ? req.body.item_qty
        : sales_orders.item_qty;
      sales_orders.item_rate = req.body.item_rate
        ? req.body.item_rate
        : sales_orders.item_rate;
      sales_order.v_width = req.body.v_width
        ? req.body.v_width
        : sales_order.v_width;
      sales_order.v_length = req.body.v_length
        ? req.body.v_length
        : sales_order.v_length;
      sales_order.remark = req.body.remark
        ? req.body.remark
        : sales_order.remark;
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
