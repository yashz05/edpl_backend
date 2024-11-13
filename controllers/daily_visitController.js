const Daily_visitModel = require("../models/daily_visitModel.js");
const salesperson = require("../models/sales_teamModel.js");
/**
 * daily_visitController.js
 *
 * @description :: Server-side logic for managing daily_visits.
 */
module.exports = {
  /**
   * daily_visitController.list()
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
        const sales_orders = await Daily_visitModel.find({
          // createdAt: {
          //   $gte: todayStart, // Greater than or equal to today's start
          //   $lt: todayEnd, // Less than today's end
          // },
        })
          .sort({ createdAt: -1 })
          .exec();
        if (sales_orders.length > 0) {
          return res.json(sales_orders);
        } else {
          return res.json({
            message: "No Daily Collection orders found for today for admin.",
          });
        }
      } else {
        const sales_orders = await Daily_visitModel.find({
          spid: req.auth.uuid, // Filter by user's spid
          // createdAt: {
          //   $gte: todayStart, // Greater than or equal to today's start
          //   $lt: todayEnd, // Less than today's end
          // },
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
   * daily_visitController.list()
   */
  all: async function (req, res) {
    var spid = req.auth.uuid; // Assuming spid identifies the user
    // Get today's date range
    var users_type = [];
    var u = await salesperson.findOne({
      uuid: spid,
    });
    var all = [];

    var todayStart = new Date().setHours(0, 0, 0, 0);
    var todayEnd = new Date().setHours(23, 59, 59, 999);

    try {
      if (u.access.includes("admin")) {
        var sales_orders = await Daily_visitModel.find({
          // createdAt: {
          //   $gte: todayStart, // Greater than or equal to today's start
          //   $lt: todayEnd, // Less than today's end
          // },
        })
          .sort({ createdAt: -1 })
          .exec();
          var salesTeamData = await salesperson.find({
            uuid: { $in: sales_orders.map((company) => company.spid) },
          });
          var salesTeamMap = {};
          salesTeamData.forEach((member) => {
            salesTeamMap[member.uuid] = member;
          });
          sales_orders = sales_orders.map((company) => ({
            ...company.toObject(),
            sname: salesTeamMap[company.spid]?.name || null, // Add sales team info if exists
          }));
        if (sales_orders.length > 0) {
          return res.json(sales_orders);
        } else {
          return res.json({
            message: "No Daily Collection orders found for today for admin.",
          });
        }
      } else {
        var sales_orders = await Daily_visitModel.find({
          spid: req.auth.uuid, // Filter by user's spid
          // createdAt: {
          //   $gte: todayStart, // Greater than or equal to today's start
          //   $lt: todayEnd, // Less than today's end
          // },
        }).exec();
        sales_orders = sales_orders.map((company) => ({
          ...company.toObject(),
          sname: u?.name || null, // Add sales team info if exists
        }));
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
        const sales_orders = await Daily_visitModel.find({
          company_name: req.params.id,
        }).exec();
        if (sales_orders.length > 0) {
          return res.json(sales_orders);
        } else {
          return res.json({
            message: "No Daily Collection orders found for today for admin.",
          });
        }
      } else {
        const sales_orders = await Daily_visitModel.find({
          spid: req.auth.uuid, // Filter by user's spid
          company_name: req.params.id,
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
   * daily_visitController.show()
   */
  show: async function (req, res) {
    const id = req.params.id;
    const daily_visit = await Daily_visitModel.findOne({ _id: id }).exec();
    if (daily_visit != null) {
      return res.json(daily_visit);
    } else {
      return res.json({ message: "not found !" });
    }
  },

  /**
   * daily_visitController.create()
   */
  create: async function (req, res) {
    
    const daily_visit = new Daily_visitModel({
      company_name: req.body.company_name,
      customer_name: req.body.customer_name,
      data: req.body.data,
      spid: req.auth.uuid,
      // remark: req.body.remark, //remark added
      createdAt: req.body.createdAt || new Date(), // Use provided createdAt or default to current date
    });
    try {
      await Daily_visitModel.create(daily_visit);
      return res.status(201).json(daily_visit);
    } catch (e) {
      return res.status(400).json({ message: "Error" + e });
    }
  },

  /**
   * daily_visitController.update()
   */
  update: async function (req, res) {
    const id = req.params.id;
    const daily_visit = await Daily_visitModel.findOne({ _id: id }).exec();
    if (daily_visit != null) {
      // update
      daily_visit.company_name = req.body.company_name
        ? req.body.company_name
        : daily_visit.company_name;
      daily_visit.customer_name = req.body.customer_name
        ? req.body.customer_name
        : daily_visit.customer_name;
      daily_visit.data = req.body.data ? req.body.data : daily_visit.data;
      daily_visit.spid = req.auth.uuid ? req.auth.uuid : daily_visit.spid;
      //  remark added
      // daily_visit.remark = req.body.remark ? req.body.remark : daily_visit.remark;
      await Daily_visitModel.updateOne({ _id: id }, daily_visit).exec();
      return res.json(daily_visit);
    } else {
      // create
      return res.status(400).json({ message: "Error" });
    }
  },

  /**
   * daily_visitController.remove()
   */
  remove: async function (req, res) {
    const id = req.params.id;
    await Daily_visitModel.findByIdAndDelete(id).exec();
    return res.status(204).json();
  },
};
