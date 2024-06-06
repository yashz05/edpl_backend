const Daily_visitModel = require("../models/daily_visitModel.js");

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
    try {
      // Get the start and end of the current day
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
  
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
  
      // Fetch records where the spid matches and the createdAt is within today
      const all = await Daily_visitModel.find({
        spid: req.auth.uuid,
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });
  
      return res.json(all);
    } catch (error) {
      return res.status(500).json({ error: 'An error occurred while fetching records.' });
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
    console.log(req.auth.uuid);
    const daily_visit = new Daily_visitModel({
      company_name: req.body.company_name,
      customer_name: req.body.customer_name,
      data: req.body.data,
      spid: req.auth.uuid,
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
