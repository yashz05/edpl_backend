const Sales_teamModel = require("../models/sales_teamModel.js");
const { cryptPassword, comparePassword } = require("./../others/password.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {
  getOrAdd,
  redisClient,
  deleteKeysByPattern,
} = require("./../others/redis_cache.js");
dotenv.config();

/**
 * sales_teamController.js
 *
 * @description :: Server-side logic for managing sales_teams.
 */
module.exports = {
  /**
   * sales_teamController.list()
   */
  list: async function (req, res) {
    const all = await Sales_teamModel.find({});

    return res.json(all);
  },

  /**
   * sales_teamController.show()
   */
  show: async function (req, res) {
    const id = req.params.id;
    const sales_team = await Sales_teamModel.findOne({ _id: id }).exec();
    if (sales_team != null) {
      return res.json(sales_team);
    } else {
      return res.json({ message: "not found !" });
    }
  },

  login: async function (req, res) {
    const check = await Sales_teamModel.findOne({
      email: req.body.email,
    });

    if (check != null || check != undefined) {
      const myBoolean = await comparePassword(
        req.body.password,
        check.password
      );
      if (myBoolean == true) {
        var data = {
          uuid: check.uuid,
          id: check._id,
          access: check.access,
        };
        var token = jwt.sign(data, process.env.JWT_SECRET, {
          expiresIn: "1y",
        });

        return res.status(200).json({
          message: token,
          access: check.access,
          uuid: check.uuid,
        });
      } else {
        return res.status(401).json({
          message: "Email /  Password is wrong",
        });
      }
    } else {
      return res.status(401).json({
        message: " User does not exists with this email",
      });
    }
  },

  /**
   * sales_teamController.create()
   */
  create: async function (req, res) {
    const myEncryptPassword = await cryptPassword(req.body.password);
    //   const myBoolean = await Encrypt.comparePassword(password, passwordHash);
    // check if user exist in db
    const check = await Sales_teamModel.find({
      email: req.body.email,
    });
    const sales_team = new Sales_teamModel({
      name: req.body.name,
      email: req.body.email,
      active: true,
      uuid: Math.floor(Math.random() * 99999),
      password: myEncryptPassword,
      access: req.body.access,
    });
    try {
      if (check.length > 0) {
        return res.status(400).json({
          message: " User already exists with this email",
        });
      } else {
        await Sales_teamModel.create(sales_team);
        return res.status(201).json(sales_team);
      }
    } catch (e) {
      return res.status(400).json({ message: "Error" + e });
    }
  },

  /**
   * sales_teamController.update()
   */
  update: async function (req, res) {
    const id = req.params.id;
    const sales_team = await Sales_teamModel.findOne({ _id: id }).exec();
    if (sales_team != null) {
      await deleteKeysByPattern(`*:${sales_team.uuid}`);
      // Update fields
      // 
      sales_team.name = req.body.name ? req.body.name : sales_team.name;
      sales_team.email = req.body.email ? req.body.email : sales_team.email;
      sales_team.active = typeof req.body.active === 'boolean' ? req.body.active : sales_team.active;

      sales_team.uuid = req.body.uuid ? req.body.uuid : sales_team.uuid;
      sales_team.access = req.body.access ? req.body.access : sales_team.access;
      if (req.body.hasOwnProperty("password")) {
        if (req.body.password != sales_team.password) {
          if (req.body.password != "" || req.body.password != null) {
            sales_team.password = await cryptPassword(req.body.password);
          } else {
            sales_team.password = sales_team.password;
          }
        }
      }

      // if (req.body.password != "" || req.body.password != null) {
      //   sales_team.password = await cryptPassword(req.body.password);
      // } else {
      //   sales_team.password = sales_team.password;
      // }

      await Sales_teamModel.updateOne({ _id: id }, sales_team).exec();
      return res.json(sales_team);
    } else {
      // Create error response
      return res
        .status(400)
        .json({ message: "Error: Sales team member not found" });
    }
  },

  /**
   * sales_teamController.remove()
   */
  remove: async function (req, res) {
    const id = req.params.id;
    await Sales_teamModel.findByIdAndDelete(id).exec();
    return res.status(204).json();
  },
};
