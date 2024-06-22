const AdminsModel = require("../models/adminsModel.js");
const Sales_teamModel = require("../models/sales_teamModel.js");
const { cryptPassword, comparePassword } = require("./../others/password.js");

/**
 * adminsController.js
 *
 * @description :: Server-side logic for managing admins.
 */
module.exports = {
  login: async function (req, res) {
    const { email, password } = req.body;
    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const admin = await AdminsModel.findOne({ email: email }).exec();
    if (admin != null) {
      const passwordMatch = await comparePassword(password, admin.password);
      if (passwordMatch) {
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
          expiresIn: "1y",
        });

        return res.status(200).json({
          message: "Login successful",
          token: token,
        });
      } else {
        return res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "User does not exist with this email" });
    }
  },

  /**
   * adminsController.list()
   */
  list: async function (req, res) {
    const all = await AdminsModel.find({});
    return res.json(all);
  },

  /**
   * adminsController.show()
   */
  show: async function (req, res) {
    const id = req.params.id;
    const admins = await AdminsModel.findOne({ _id: id }).exec();
    if (admins != null) {
      return res.json(admins);
    } else {
      return res.json({ message: "not found!" });
    }
  },

  /**
   * adminsController.create()
   */
  create: async function (req, res) {
    // Check if password is provided
    if (!req.body.password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Check if the user already exists in the sales team
    const salesCheck = await Sales_teamModel.findOne({
      email: req.body.email,
    });

    if (salesCheck) {
      return res.status(400).json({
        message: "User already exists as a sales person",
      });
    }

    // Check if the user already exists in the admins collection
    const adminCheck = await AdminsModel.findOne({
      email: req.body.email,
    });

    if (adminCheck) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Encrypt the password
    const encryptedPassword = await cryptPassword(req.body.password);

    const admins = new AdminsModel({
      name: req.body.name,
      email: req.body.email,
      password: encryptedPassword,
      admin: req.body.admin,
    });

    try {
      await AdminsModel.create(admins);
      return res.status(201).json(admins);
    } catch (e) {
      return res.status(400).json({ message: "Error: " + e });
    }
  },

  /**
  /**
   * adminsController.update()
   */
  update: async function (req, res) {
    const id = req.params.id;
    const admins = await AdminsModel.findOne({ _id: id }).exec();

    if (admins != null) {
      // Update fields
      admins.name = req.body.name ? req.body.name : admins.name;
      admins.email = req.body.email ? req.body.email : admins.email;
      admins.admin = req.body.admin ? req.body.admin : admins.admin;

      if (req.body.password && req.body.password !== admins.password) {
        admins.password = await cryptPassword(req.body.password);
      } else {
        admins.password = admins.password;
      }

      await AdminsModel.updateOne({ _id: id }, admins).exec();
      return res.json(admins);
    } else {
      return res.status(400).json({ message: "Error: Admin not found" });
    }
  },

  /**
   * adminsController.remove()
   */
  remove: async function (req, res) {
    const id = req.params.id;
    await AdminsModel.findByIdAndDelete(id).exec();
    return res.status(204).json();
  },
};
