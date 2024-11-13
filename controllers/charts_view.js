const salesOrders = require("../models/sales_ordersModel");
const salesperson = require("../models/sales_teamModel");
const daily_collectionSchema = require("../models/daily_collectionModel");
const Daily_visitModel = require("../models/daily_visitModel");
const moment = require("moment");
const daily_collectionModel = require("../models/daily_collectionModel");
const Company = require("../models/companyModel");
const OpenAI = require("openai");
const {
  getOrAdd,
  redisClient,
  deleteKeysByPattern,
} = require("./../others/redis_cache.js");
const companyModel = require("../models/companyModel");
/**
 * catalogueController.js
 *
 * @description :: Server-side logic for managing catalogues.
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set your API key in an environment variable
  dangerouslyAllowBrowser: true,
});

async function overviewOfCompany(data) {
  const cacheKey = `companySummary:${data["name"]}`; // Unique cache key based on data

  try {
    // Check if response is in cache
    const cachedSummary = await redisClient.get(cacheKey);
    if (cachedSummary) {
      
      return JSON.parse(cachedSummary);
    }

    // If not in cache, fetch from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content:
            `Please provide a detailed summary of the following company data in 7 lines and ignore 
            diwali_gift,ladoo_gift,other_gift,sample_catalouge_type,sample_catalouge_data, first_visited,next_visit,createdAt,updatedAt ` +
            JSON.stringify(data),
        },
      ],
    });

    const summary = completion.choices[0].message.content;

    // Cache the response in Redis for one year (in seconds)
    await redisClient.setEx(
      cacheKey,
      60 * 60 * 24 * 365,
      JSON.stringify(summary)
    );

    return summary;
  } catch (error) {
    console.error("Error fetching completion:", error);
    throw new Error("Failed to fetch summary from OpenAI");
  }
}

const months = [
  { index: 0, name: "January" },
  { index: 1, name: "February" },
  { index: 2, name: "March" },
  { index: 3, name: "April" },
  { index: 4, name: "May" },
  { index: 5, name: "June" },
  { index: 6, name: "July" },
  { index: 7, name: "August" },
  { index: 8, name: "September" },
  { index: 9, name: "October" },
  { index: 10, name: "November" },
  { index: 11, name: "December" },
];
module.exports = {
  sales: async function (req, res) {
    const spid = req.auth.uuid;
    var users_type = [];
    var u = await salesperson.findOne({
      uuid: spid,
    });
    var all = [];

    try {
      if (u.access.includes("admin")) {
        // res.json("ok")

        var data = await salesOrders.aggregate([
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              total: {
                $sum: 1,
              },
              totalvalue: {
                $sum: {
                  $cond: [
                    { $eq: ["$item_type", "Laminate"] },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                      ],
                    },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                        { $toInt: { $trim: { input: "$v_width" } } },
                        { $toInt: { $trim: { input: "$v_length" } } },
                      ],
                    },
                  ],
                },
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
        ]);
      } else {
        var data = await salesOrders.aggregate([
          {
            $match: {
              spid: req.auth.uuid,
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              total: {
                $sum: 1,
              },
              totalvalue: {
                $sum: {
                  $cond: [
                    { $eq: ["$item_type", "Laminate"] },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                      ],
                    },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                        { $toInt: { $trim: { input: "$v_width" } } },
                        { $toInt: { $trim: { input: "$v_length" } } },
                      ],
                    },
                  ],
                },
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
        ]);
      }

      const results = data.map((item) => ({
        year: item._id.year,
        month: months[item._id.month - 1].name, // Adjust for 0-based index
        total: item.total,
        totalvalue: item.totalvalue,
      }));

      res.json(results);
    } catch (e) {
      
    }
  },

  graphadmin: async function (req, res) {
    const spid = req.auth.uuid;
    var users_type = [];
    var u = await salesperson.findOne({
      uuid: spid,
    });
    var all = [];

    try {
      if (u.access.includes("admin")) {
        // res.json("ok")

        var salesData = await salesOrders.aggregate([
          {
            $group: {
              _id: {
                month: { $month: "$createdAt" },
              },
              total: {
                $sum: 1,
              },
              totalvalue: {
                $sum: {
                  $cond: [
                    { $eq: ["$item_type", "Laminate"] },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                      ],
                    },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                        { $toInt: { $trim: { input: "$v_width" } } },
                        { $toInt: { $trim: { input: "$v_length" } } },
                      ],
                    },
                  ],
                },
              },
            },
          },
          {
            $sort: {
              "_id.month": 1,
            },
          },
        ]);

        var dailyCollection = await daily_collectionModel.aggregate([
          // {
          //   $match: {
          //     spid: req.auth.uuid,
          //   },
          // },
          {
            $group: {
              _id: {
                month: { $month: "$createdAt" },
              },
              total: {
                $sum: 1,
              },
              totalValue: {
                $sum: { $toDouble: "$amount" },
                // Convert string to number in aggregation
              },
            },
          },
          {
            $sort: {
              "_id.month": 1,
            },
          },
        ]);
      } else {
        var salesData = await salesOrders.aggregate([
          {
            $match: {
              spid: req.auth.uuid,
            },
          },
          {
            $group: {
              _id: {
                month: { $month: "$createdAt" },
              },
              total: {
                $sum: 1,
              },
              totalvalue: {
                $sum: {
                  $cond: [
                    { $eq: ["$item_type", "Laminate"] },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                      ],
                    },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                        { $toInt: { $trim: { input: "$v_width" } } },
                        { $toInt: { $trim: { input: "$v_length" } } },
                      ],
                    },
                  ],
                },
              },
            },
          },
          {
            $sort: {
              "_id.month": 1,
            },
          },
        ]);
        var dailyCollection = await daily_collectionModel.aggregate([
          {
            $match: {
              spid: req.auth.uuid,
            },
          },
          {
            $group: {
              _id: {
                month: { $month: "$createdAt" },
              },
              total: {
                $sum: 1,
              },
              totalValue: {
                $sum: { $toDouble: "$amount" },
                // Convert string to number in aggregation
              },
            },
          },
          {
            $sort: {
              "_id.month": 1,
            },
          },
        ]);
      }

      const results = dailyCollection.map((item) => ({
        month: months[item._id.month - 1].name, // Adjust for 0-based index
        total: item.total,
        totalValue: item.totalValue,
      }));

      var data = [];
      salesData.forEach((e) => {
        // Find matching month in dailyCollection results
        const daily = results.find(
          (d) => d.month === months[e._id.month - 1].name
        );

        data.push({
          month: months[e._id.month - 1].name,
          totalsales: e.totalvalue,
          dailyTotalValue: daily ? daily.totalValue : 0,
        });
      });

      res.json(data);
    } catch (e) {
      
    }
  },
  graphadminCurrentMonth: async function (req, res) {
    const spid = req.auth.uuid;
    var u = await salesperson.findOne({
      uuid: spid,
    });

    try {
      let salesData, dailyCollection;

      const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
      const currentYear = new Date().getFullYear(); // Get current year

      if (u.access.includes("admin")) {
        salesData = await salesOrders.aggregate([
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: [{ $month: "$createdAt" }, currentMonth] },
                  { $eq: [{ $year: "$createdAt" }, currentYear] },
                ],
              },
            },
          },
          {
            $group: {
              _id: null, // Grouping all data for a single total for the month
              total: {
                $sum: 1,
              },
              totalValue: {
                $sum: {
                  $cond: [
                    { $eq: ["$item_type", "Laminate"] },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                      ],
                    },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                        { $toInt: { $trim: { input: "$v_width" } } },
                        { $toInt: { $trim: { input: "$v_length" } } },
                      ],
                    },
                  ],
                },
              },
            },
          },
        ]);

        dailyCollection = await daily_collectionModel.aggregate([
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: [{ $month: "$createdAt" }, currentMonth] },
                  { $eq: [{ $year: "$createdAt" }, currentYear] },
                ],
              },
            },
          },
          {
            $group: {
              _id: null, // Grouping all data for a single total for the month
              total: {
                $sum: 1,
              },
              totalValue: {
                $sum: { $toDouble: "$amount" },
              },
            },
          },
        ]);
      } else {
        salesData = await salesOrders.aggregate([
          {
            $match: {
              spid: req.auth.uuid,
              $expr: {
                $and: [
                  { $eq: [{ $month: "$createdAt" }, currentMonth] },
                  { $eq: [{ $year: "$createdAt" }, currentYear] },
                ],
              },
            },
          },
          {
            $group: {
              _id: null, // Grouping all data for a single total for the month
              total: {
                $sum: 1,
              },
              totalValue: {
                $sum: {
                  $cond: [
                    { $eq: ["$item_type", "Laminate"] },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                      ],
                    },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                        { $toInt: { $trim: { input: "$v_width" } } },
                        { $toInt: { $trim: { input: "$v_length" } } },
                      ],
                    },
                  ],
                },
              },
            },
          },
        ]);

        dailyCollection = await daily_collectionModel.aggregate([
          {
            $match: {
              spid: req.auth.uuid,
              $expr: {
                $and: [
                  { $eq: [{ $month: "$createdAt" }, currentMonth] },
                  { $eq: [{ $year: "$createdAt" }, currentYear] },
                ],
              },
            },
          },
          {
            $group: {
              _id: null, // Grouping all data for a single total for the month
              total: {
                $sum: 1,
              },
              totalValue: {
                $sum: { $toDouble: "$amount" },
              },
            },
          },
        ]);
      }

      const totalSales = salesData.length > 0 ? salesData[0].totalValue : 0;
      const totalDailyValue =
        dailyCollection.length > 0 ? dailyCollection[0].totalValue : 0;

      const result = {
        month: new Date().toLocaleString("default", { month: "long" }), // Get current month name
        totalSales: totalSales,
        totalDailyValue: totalDailyValue,
      };

      res.json(result);
    } catch (e) {
      
      res
        .status(500)
        .json({ error: "An error occurred while fetching the data." });
    }
  },

  graphadminLast30Days: async function (req, res) {
    const spid = req.auth.uuid;
    var u = await salesperson.findOne({
      uuid: spid,
    });

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Set start date to 30 days ago

      let salesData, dailyCollection;

      if (u.access.includes("admin")) {
        salesData = await salesOrders.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate }, // Filter for the last 30 days
            },
          },
          {
            $group: {
              _id: {
                day: { $dayOfMonth: "$createdAt" },
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              total: {
                $sum: 1,
              },
              totalValue: {
                $sum: {
                  $cond: [
                    { $eq: ["$item_type", "Laminate"] },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                      ],
                    },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                        { $toInt: { $trim: { input: "$v_width" } } },
                        { $toInt: { $trim: { input: "$v_length" } } },
                      ],
                    },
                  ],
                },
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
              "_id.day": 1,
            },
          },
        ]);

        dailyCollection = await daily_collectionModel.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate }, // Filter for the last 30 days
            },
          },
          {
            $group: {
              _id: {
                day: { $dayOfMonth: "$createdAt" },
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              total: {
                $sum: 1,
              },
              totalValue: {
                $sum: { $toDouble: "$amount" },
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
              "_id.day": 1,
            },
          },
        ]);
      } else {
        salesData = await salesOrders.aggregate([
          {
            $match: {
              spid: req.auth.uuid,
              createdAt: { $gte: startDate }, // Filter for the last 30 days
            },
          },
          {
            $group: {
              _id: {
                day: { $dayOfMonth: "$createdAt" },
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              total: {
                $sum: 1,
              },
              totalValue: {
                $sum: {
                  $cond: [
                    { $eq: ["$item_type", "Laminate"] },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                      ],
                    },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                        { $toInt: { $trim: { input: "$v_width" } } },
                        { $toInt: { $trim: { input: "$v_length" } } },
                      ],
                    },
                  ],
                },
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
              "_id.day": 1,
            },
          },
        ]);

        dailyCollection = await daily_collectionModel.aggregate([
          {
            $match: {
              spid: req.auth.uuid,
              createdAt: { $gte: startDate }, // Filter for the last 30 days
            },
          },
          {
            $group: {
              _id: {
                day: { $dayOfMonth: "$createdAt" },
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              total: {
                $sum: 1,
              },
              totalValue: {
                $sum: { $toDouble: "$amount" },
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
              "_id.day": 1,
            },
          },
        ]);
      }

      // Prepare the results
      const results = salesData.map((item) => ({
        date: `${item._id.year}-${item._id.month}-${item._id.day}`,
        totalSales: item.totalValue,
      }));

      const dailyResults = dailyCollection.map((item) => ({
        date: `${item._id.year}-${item._id.month}-${item._id.day}`,
        dailyTotal: item.totalValue,
      }));

      // Merge dailyResults with salesResults by date
      const mergedResults = results.map((sale) => {
        const daily = dailyResults.find((d) => d.date === sale.date) || {
          dailyTotal: 0,
        };
        return {
          date: sale.date,
          totalSales: sale.totalSales,
          dailyTotal: daily.dailyTotal,
        };
      });

      res.json(mergedResults);
    } catch (e) {
      
      res
        .status(500)
        .json({ error: "An error occurred while fetching the data." });
    }
  },

  allcount: async function (req, res) {
    const spid = req.auth.uuid;
    var users_type = [];
    var u = await salesperson.findOne({
      uuid: spid,
    });
    var all = [];
    try {
      if (u.access.includes("admin")) {
        var sp = await salesperson.find({}).count();
        const startOfToday = moment().startOf("day").toDate(); // Start of today
        const endOfToday = moment().endOf("day").toDate(); // End of today

        var todaysales = await salesOrders.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfToday,
                $lt: endOfToday,
              },
            },
          },
          {
            $group: {
              _id: { $month: "$createdAt" },
              total: {
                $sum: 1,
              },
              totalvalue: {
                $sum: {
                  $cond: [
                    { $eq: ["$item_type", "Laminate"] },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                      ],
                    },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                        { $toInt: { $trim: { input: "$v_width" } } },
                        { $toInt: { $trim: { input: "$v_length" } } },
                      ],
                    },
                  ],
                },
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
        ]);
        var todaycollection = await daily_collectionSchema.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfToday,
                $lt: endOfToday,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: 1,
              },
              totalvalue: {
                $sum: { $toDouble: "$amount" },
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
        ]);

        var todayvisits = await Daily_visitModel.find({
          createdAt: {
            $gte: startOfToday, // Greater than or equal to today's start
            $lt: endOfToday, // Less than today's end
          },
        }).count();
        res.json({
          tsp: sp,
          ts: todaysales,
          tc: todaycollection,
          tv: todayvisits,
        });
      } else {
        var sp = await salesperson.find({}).count();
        const startOfToday = moment().startOf("day").toDate(); // Start of today
        const endOfToday = moment().endOf("day").toDate(); // End of today

        var todaysales = await salesOrders.aggregate([
          {
            $match: {
              spid: req.auth.uuid,
              createdAt: {
                $gte: startOfToday,
                $lt: endOfToday,
              },
            },
          },
          {
            $group: {
              _id: { $month: "$createdAt" },
              total: {
                $sum: 1,
              },
              totalvalue: {
                $sum: {
                  $cond: [
                    { $eq: ["$item_type", "Laminate"] },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                      ],
                    },
                    {
                      $multiply: [
                        { $toInt: { $trim: { input: "$item_qty" } } },
                        { $toInt: { $trim: { input: "$item_rate" } } },
                        { $toInt: { $trim: { input: "$v_width" } } },
                        { $toInt: { $trim: { input: "$v_length" } } },
                      ],
                    },
                  ],
                },
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
        ]);
        var todaycollection = await daily_collectionSchema.aggregate([
          {
            $match: {
              spid: req.auth.uuid,
              createdAt: {
                $gte: startOfToday,
                $lt: endOfToday,
              },
            },
          },
          {
            $group: {
              _id: { $month: "$createdAt" },
              total: {
                $sum: 1,
              },
              totalvalue: {
                $sum: { $toDouble: "$amount" },
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
        ]);

        var todayvisits = await Daily_visitModel.find({
          spid: req.auth.uuid,
          createdAt: {
            $gte: startOfToday, // Greater than or equal to today's start
            $lt: endOfToday, // Less than today's end
          },
        }).count();
        res.json({
          tsp: sp,
          ts: todaysales,
          tc: todaycollection,
          tv: todayvisits,
        });
      }
    } catch (e) {
      
    }
  },

  getCompanyCountsByGrade: async function (req, res) {
    try {
      const counts = await Company.aggregate([
        {
          $group: {
            _id: {
              $cond: {
                if: { $in: ["$customer_grade", ["Unknown", "UNKNOWN"]] },
                then: "Unknown",
                else: "$customer_grade",
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $addFields: {
            fill: { $concat: ["var(--color-", "$_id", ")"] },
          },
        },
      ]);

      res.json(counts);
    } catch (error) {
      console.error("Error fetching company counts by grade:", error);
    }
  },
  getCompanyCountsByHistory: async function (req, res) {
    try {
      const counts = await Company.aggregate([
        {
          $group: {
            _id: {
              $cond: {
                if: { $in: [{ $toLower: "$customer_history" }, ["unknown"]] },
                then: "unknown",
                else: { $toLower: "$customer_history" },
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $addFields: {
            fill: {
              $concat: [
                "var(--color-",
                {
                  $replaceAll: {
                    input: { $toUpper: "$_id" },
                    find: " ",
                    replacement: "_",
                  },
                },
                ")",
              ],
            },
          },
        },
      ]);

      

      res.json(counts);
    } catch (error) {
      console.error("Error fetching company counts by grade:", error);
    }
  },
  companyCountByMonth: async function (req, res) {
    const counts = await Company.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          monthName: {
            $arrayElemAt: [
              [
                "",
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
              "$_id.month",
            ],
          },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$monthName",
          count: 1,
        },
      },
    ]);
    res.json(counts);
  },

  companyYearanal: async function (req, res) {
    const { companyName } = req.params;

    try {
      const currentDate = new Date();
      const lastYearDate = new Date();
      lastYearDate.setFullYear(currentDate.getFullYear() - 1);

      // Find the specific company by ID
      const company = await Company.findOne({ _id: companyName });
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Aggregation pipeline to get monthly sales counts and values
      const salesData = await salesOrders.aggregate([
        {
          $match: {
            company_name: company.name,
            createdAt: { $gte: lastYearDate, $lte: currentDate },
          },
        },
        {
          $group: {
            _id: { month: { $month: "$createdAt" } },
            count: { $sum: 1 },
            totalSalesValue: {
              $sum: {
                $cond: [
                  { $eq: ["$item_type", "Laminate"] },
                  {
                    $multiply: [
                      { $toInt: { $trim: { input: "$item_qty" } } },
                      { $toInt: { $trim: { input: "$item_rate" } } },
                    ],
                  },
                  {
                    $multiply: [
                      { $toInt: { $trim: { input: "$item_qty" } } },
                      { $toInt: { $trim: { input: "$item_rate" } } },
                      { $toInt: { $trim: { input: "$v_width" } } },
                      { $toInt: { $trim: { input: "$v_length" } } },
                    ],
                  },
                ],
              },
            },
          },
        },
        { $sort: { "_id.month": 1 } },
      ]);

      // Aggregation pipeline to get monthly collection counts and values
      const collectionData = await daily_collectionSchema.aggregate([
        {
          $match: {
            customer_name: company.name,
            createdAt: { $gte: lastYearDate, $lte: currentDate },
          },
        },
        {
          $group: {
            _id: { month: { $month: "$createdAt" } },
            count: { $sum: 1 },
            totalCollectionValue: { $sum: { $toDouble: "$amount" } },
          },
        },
        { $sort: { "_id.month": 1 } },
      ]);

      // Initialize monthly summary with zero counts and values
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthlySummary = months.map((month, index) => ({
        month,
        salesCount: 0,
        totalSalesValue: 0,
        collectionCount: 0,
        totalCollectionValue: 0,
      }));

      // Populate monthly summary with sales data
      salesData.forEach((item) => {
        monthlySummary[item._id.month - 1].salesCount = item.count;
        monthlySummary[item._id.month - 1].totalSalesValue =
          item.totalSalesValue;
      });

      // Populate monthly summary with collection data
      collectionData.forEach((item) => {
        monthlySummary[item._id.month - 1].collectionCount = item.count;
        monthlySummary[item._id.month - 1].totalCollectionValue =
          item.totalCollectionValue;
      });

      // Calculate yearly totals for sales and collections
      const totalSalesCount = salesData.reduce(
        (acc, item) => acc + item.count,
        0
      );
      const totalSalesValue = salesData.reduce(
        (acc, item) => acc + item.totalSalesValue,
        0
      );
      const totalCollectionCount = collectionData.reduce(
        (acc, item) => acc + item.count,
        0
      );
      const totalCollectionValue = collectionData.reduce(
        (acc, item) => acc + item.totalCollectionValue,
        0
      );

      // Append totals to the response
      // res.json({
      //   monthlySummary,
      //   totals: {
      //     totalSalesCount,
      //     totalSalesValue,
      //     totalCollectionCount,
      //     totalCollectionValue
      //   }
      // });
      res.json(monthlySummary);
    } catch (error) {
      console.error("Error fetching monthly summary:", error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  companySalesRecord: async function (req, res) {
    const spid = req.auth.uuid;
    const name = req.body.name;

    try {
      const user = await salesperson.findOne({ uuid: spid });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let salesData;

      const commonPipeline = [
        {
          $match: user.access.includes("admin")
            ? { company_name: name }
            : { spid: spid, company_name: name },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            total: { $sum: 1 },
            totalValue: {
              $sum: {
                $cond: [
                  { $eq: ["$item_type", "Laminate"] },
                  {
                    $multiply: [
                      { $toInt: { $trim: { input: "$item_qty" } } },
                      { $toInt: { $trim: { input: "$item_rate" } } },
                    ],
                  },
                  {
                    $multiply: [
                      { $toInt: { $trim: { input: "$item_qty" } } },
                      { $toInt: { $trim: { input: "$item_rate" } } },
                      { $toInt: { $trim: { input: "$v_width" } } },
                      { $toInt: { $trim: { input: "$v_length" } } },
                    ],
                  },
                ],
              },
            },
          },
        },
        {
          $addFields: {
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
          },
        },

        {
          $project: {
            _id: 0, // Exclude the original _id field
            date: { $dateToString: { format: "%d/%m/%Y", date: "$date" } },
            total: 1,
            totalValue: 1,
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
      ];

      salesData = await salesOrders.aggregate(commonPipeline);

      return res.json(salesData);
    } catch (error) {
      console.error("Error fetching sales record:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  companySalesTypes: async function (req, res) {
    const spid = req.auth.uuid;
    const name = req.body.name;

    try {
      const user = await salesperson.findOne({ uuid: spid });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const commonPipeline = [
        {
          $match: user.access.includes("admin")
            ? { company_name: name }
            : { spid: spid, company_name: name },
        },
        {
          $group: {
            _id: "$item_type",
            total: { $sum: 1 }, // Count of records for each item type
          },
        },
        {
          $sort: {
            total: -1, // Sort by total count in descending order
          },
        },
        {
          $addFields: {
            fill: { $concat: ["var(--color-", "$_id", ")"] },
          },
        },
      ];

      const salesData = await salesOrders.aggregate(commonPipeline);

      return res.json(salesData);
    } catch (error) {
      console.error("Error fetching sales record:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  SalesPersonSalesRecord: async function (req, res) {
    const spid = req.auth.uuid;
    const sales_person = req.body.name;

    try {
      const user = await salesperson.findOne({ uuid: spid });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let salesData;

      const commonPipeline = [
        {
          $match: user.access.includes("admin")
            ? { spid: sales_person }
            : { spid: spid },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            total: { $sum: 1 },
            totalValue: {
              $sum: {
                $cond: [
                  { $eq: ["$item_type", "Laminate"] },
                  {
                    $multiply: [
                      { $toInt: { $trim: { input: "$item_qty" } } },
                      { $toInt: { $trim: { input: "$item_rate" } } },
                    ],
                  },
                  {
                    $multiply: [
                      { $toInt: { $trim: { input: "$item_qty" } } },
                      { $toInt: { $trim: { input: "$item_rate" } } },
                      { $toInt: { $trim: { input: "$v_width" } } },
                      { $toInt: { $trim: { input: "$v_length" } } },
                    ],
                  },
                ],
              },
            },
          },
        },
        {
          $addFields: {
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
              },
            },
          },
        },
        {
          $project: {
            _id: 0, // Exclude the original _id field
            date: { $dateToString: { format: "%m/%Y", date: "$date" } },
            total: 1,
            totalValue: 1,
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
      ];

      salesData = await salesOrders.aggregate(commonPipeline);

      return res.json(salesData);
    } catch (error) {
      console.error("Error fetching sales record:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // COLLECTION

  companyCollectionRecord: async function (req, res) {
    const spid = req.auth.uuid;
    const name = req.body.name;

    try {
      
      const user = await salesperson.findOne({ uuid: spid });

      if (!user) {
        
        return res.status(404).json({ error: "User not found" });
      }

      

      if (name) {
        
        const commonPipeline = [
          {
            $match: user.access.includes("admin")
              ? { customer_name: name }
              : { spid: spid, customer_name: name },
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              total: { $sum: 1 },
              totalValue: {
                $sum: { $toDouble: "$amount" },
              },
            },
          },
          {
            $addFields: {
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: { $dateToString: { format: "%d/%m/%Y", date: "$date" } },
              total: 1,
              totalValue: 1,
            },
          },
          {
            $sort: {
              date: 1,
            },
          },
        ];

        const dc = await daily_collectionModel.aggregate(commonPipeline);
        

        if (dc.length === 0) {
          
        }

        return res.json(dc);
      } else {
        
        return res.status(400).json({ message: "Company not found" });
      }
    } catch (error) {
      console.error("Error fetching sales record:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  SalesPersonCollectionRecord: async function (req, res) {
    const spid = req.auth.uuid;
    const name = req.body.name;

    try {
      
      const user = await salesperson.findOne({ uuid: spid });

      if (!user) {
        
        return res.status(404).json({ error: "User not found" });
      }

      

      if (name) {
        
        const commonPipeline = [
          {
            $match: user.access.includes("admin")
              ? { spid: name }
              : { spid: spid },
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              total: { $sum: 1 },
              totalValue: {
                $sum: { $toDouble: "$amount" },
              },
            },
          },
          {
            $addFields: {
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: { $dateToString: { format: "%m/%Y", date: "$date" } },
              total: 1,
              totalValue: 1,
            },
          },
          {
            $sort: {
              date: 1,
            },
          },
        ];

        const dc = await daily_collectionModel.aggregate(commonPipeline);
        

        if (dc.length === 0) {
          
        }

        return res.json(dc);
      } else {
        
        return res.status(400).json({ message: "Company not found" });
      }
    } catch (error) {
      console.error("Error fetching sales record:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  overviewCompany: async function (req, res) {
    const data = req.body.data;

    try {
      const summary = await overviewOfCompany(data);
      res.json({ summary });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
