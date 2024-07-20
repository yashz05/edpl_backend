const Sample_request_companyModel = require("../models/sample_request_companyModel.js");

/**
 * sample_request_companyController.js
 *
 * @description :: Server-side logic for managing sample_request_companys.
 */
module.exports = {
  /**
   * sample_request_companyController.list()
   */
  list: async function (req, res) {
    const all = await Sample_request_companyModel.find({}).sort({ createdAt: -1 }).exec();
    return res.json(all);
  },

  /**
   * sample_request_companyController.show()
   */
  show: async function (req, res) {
    const id = req.params.id;
    console.log(id);
    const sample_request_company = await Sample_request_companyModel.find({
      company_name: id,
    }).exec();
    console.log(sample_request_company);
    if (sample_request_company != null) {
      return res.json(sample_request_company);
    } else {
      return res.json({ message: "not found !" });
    }
  },

  /**
   * sample_request_companyController.show()
   */
  single: async function (req, res) {
    const id = req.params.id;
    console.log(id);
    const sample_request_company = await Sample_request_companyModel.findOne({
      _id: id,
    }).exec();
    console.log(sample_request_company);
    if (sample_request_company != null) {
      return res.json(sample_request_company);
    } else {
      return res.json({ message: "not found !" });
    }
  },

  /**
   * sample_request_companyController.create()
   */
  create: async function (req, res) {
    const sample_request_company = new Sample_request_companyModel({
      company_name: req.body.company_name,
      type: req.body.type,
      data: req.body.data,
      spid: req.auth.uuid,
      sentsample: req.body.sentsample,
    });
    try {
      await Sample_request_companyModel.create(sample_request_company);
      return res.status(201).json(sample_request_company);
    } catch (e) {
      return res.status(400).json({ message: "Error" + e });
    }
  },

  /**
   * sample_request_companyController.update()
   */
  update: async function (req, res) {
    const id = req.params.id;
    const sample_request_company = await Sample_request_companyModel.findOne({
      _id: id,
    }).exec();
    if (sample_request_company != null) {
      // update
      sample_request_company.company_name = req.body.company_name
        ? req.body.company_name
        : sample_request_company.company_name;
      sample_request_company.sentsample =
        req.body.sentsample !== undefined
          ? req.body.sentsample
          : sample_request_company.sentsample;
          console.log(req.body.sentsample);

      sample_request_company.type = req.body.type
        ? req.body.type
        : sample_request_company.type;
      sample_request_company.data = req.body.data
        ? req.body.data
        : sample_request_company.data;
      // sample_request_company.spid = req.auth.uuid
      //   ? req.auth.uuid
      //   : sample_request_company.spid;

      await Sample_request_companyModel.updateOne(
        { _id: id },
        sample_request_company
      ).exec();
      return res.json(sample_request_company);
    } else {
      // create
      return res.status(400).json({ message: "Error" });
    }
  },
  /**
   * sample_request_companyController.update()
   */
  sentSample: async function (req, res) {
    const id = req.params.id;
    const sample_request_company = await Sample_request_companyModel.findOne({
      _id: id,
    }).exec();
    if (sample_request_company != null) {
      // update
      sample_request_company.sentsample = req.body.sentsample
        ? req.body.sentsample
        : sample_request_company.sentsample;

      await Sample_request_companyModel.updateOne(
        { _id: id },
        sample_request_company
      ).exec();
      return res.json(sample_request_company);
    } else {
      // create
      return res.status(400).json({ message: "Error" });
    }
  },

  /**
   * sample_request_companyController.remove()
   */
  remove: async function (req, res) {
    const id = req.params.id;
    await Sample_request_companyModel.findByIdAndDelete(id).exec();
    return res.status(204).json();
  },
};
