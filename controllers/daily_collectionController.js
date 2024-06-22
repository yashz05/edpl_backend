const Daily_collectionModel = require("../models/daily_collectionModel.js");
const salesperson = require("../models/sales_teamModel.js");
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
        const sales_orders = await Daily_collectionModel.find({
        
          createdAt: {
            $gte: todayStart, // Greater than or equal to today's start
            $lt: todayEnd, // Less than today's end
          },
        }).exec();
        if (sales_orders.length > 0) {
          return res.json(sales_orders);
        } else {
          return res.json({
            message: "No Daily Collection orders found for today for admin.",
          });
        }
      } else {
        const sales_orders = await Daily_collectionModel.find({
          spid: req.auth.uuid, // Filter by user's spid
          createdAt: {
            $gte: todayStart, // Greater than or equal to today's start
            $lt: todayEnd, // Less than today's end
          },
        }).exec();

        if (sales_orders.length > 0) {
          return res.json(sales_orders);
        } else {
          return res.json({
            message: "No  Daily Collection  orders found for today.",
          });
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * daily_collectionController.show()
   */
  show: async function (req, res) {
    const id = req.params.id;
    const daily_collection = await Daily_collectionModel.findOne({
      _id: id,
    }).exec();
    if (daily_collection != null) {
      return res.json(daily_collection);
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
        const sales_orders = await Daily_collectionModel.find({
          customer_name: req.params.id,
        }).exec();
        if (sales_orders.length > 0) {
          return res.json(sales_orders);
        } else {
          return res.json({
            message: "No Daily Collection orders found for today for admin.",
          });
        }
      } else {
        const sales_orders = await Daily_collectionModel.find({
          spid: req.auth.uuid, // Filter by user's spid
          customer_name: req.params.id, 
        }).exec();

        if (sales_orders.length > 0) {
          return res.json(sales_orders);
        } else {
          return res.json({
            message: "No  Daily Collection  orders found for today.",
          });
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * daily_collectionController.create()
   */
  create: async function (req, res) {
    const daily_collection = new Daily_collectionModel({
      customer_name: req.body.customer_name,
      amount: req.body.amount,
      spid: req.auth.uuid,
    });
    try {
      await Daily_collectionModel.create(daily_collection);
      return res.status(201).json(daily_collection);
    } catch (e) {
      return res.status(400).json({ message: "Error" + e });
    }
  },

  /**
   * daily_collectionController.update()
   */
  update: async function (req, res) {
    const id = req.params.id;
    const daily_collection = await Daily_collectionModel.findOne({
      _id: id,
    }).exec();
    if (daily_collection != null) {
      // update
      daily_collection.customer_name = req.body.customer_name
        ? req.body.customer_name
        : daily_collection.customer_name;
      daily_collection.amount = req.body.amount
        ? req.body.amount
        : daily_collection.amount;
      daily_collection.spid = req.body.spid
        ? req.body.spid
        : daily_collection.spid;

      await Daily_collectionModel.updateOne(
        { _id: id },
        daily_collection
      ).exec();
      return res.json(daily_collection);
    } else {
      // create
      return res.status(400).json({ message: "Error" });
    }
  },

  /**
   * daily_collectionController.remove()
   */
  remove: async function (req, res) {
    const id = req.params.id;
    await Daily_collectionModel.findByIdAndDelete(id).exec();
    return res.status(204).json();
  },
};
