const Laminate_dataModel = require('../models/laminate_dataModel.js');

/**
 * laminate_dataController.js
 *
 * @description :: Server-side logic for managing laminate_datas.
 */
module.exports = {

    /**
     * laminate_dataController.list()
     */
    list: async function (req, res) {
        const all = await Laminate_dataModel.find({})

        return res.json(all);

    },

    /**
     * laminate_dataController.show()
     */
    show: async function (req, res) {
        const id = req.params.id;
        const laminate_data = await Laminate_dataModel.findOne({ _id: id }).exec()
        if (laminate_data != null) {
            return res.json(laminate_data);
        } else {
            return res.json({ "message": "not found !" });
        }

  
    },

    /**
     * laminate_dataController.create()
     */
    create: async function (req, res) {
        const laminate_data = new Laminate_dataModel({
			SrNo : req.body.SrNo,
			ItemType : req.body.ItemType,
			ItemName : req.body.ItemName,
			ItemShortName : req.body.ItemShortName,
			ItemGroupName : req.body.ItemGroupName,
			ItemCatName : req.body.ItemCatName,
			ThicknessName : req.body.ThicknessName,
			BrandName : req.body.BrandName,
			ItemHeadingNo : req.body.ItemHeadingNo});
            try {
                await Laminate_dataModel.create(laminate_data);
        return res.status(201).json(laminate_data)
            } catch (e) {
            return res.status(400).json({ "message": "Error" + e })

        }

},

/**
 * laminate_dataController.update()
 */
update: async function (req, res) {
    const id = req.params.id;
    const laminate_data = await Laminate_dataModel.findOne({ _id: id }).exec()
    if (laminate_data != null) {
        // update
        laminate_data.SrNo = req.body.SrNo ? req.body.SrNo : laminate_data.SrNo;
			laminate_data.ItemType = req.body.ItemType ? req.body.ItemType : laminate_data.ItemType;
			laminate_data.ItemName = req.body.ItemName ? req.body.ItemName : laminate_data.ItemName;
			laminate_data.ItemShortName = req.body.ItemShortName ? req.body.ItemShortName : laminate_data.ItemShortName;
			laminate_data.ItemGroupName = req.body.ItemGroupName ? req.body.ItemGroupName : laminate_data.ItemGroupName;
			laminate_data.ItemCatName = req.body.ItemCatName ? req.body.ItemCatName : laminate_data.ItemCatName;
			laminate_data.ThicknessName = req.body.ThicknessName ? req.body.ThicknessName : laminate_data.ThicknessName;
			laminate_data.BrandName = req.body.BrandName ? req.body.BrandName : laminate_data.BrandName;
			laminate_data.ItemHeadingNo = req.body.ItemHeadingNo ? req.body.ItemHeadingNo : laminate_data.ItemHeadingNo;
			
        await Laminate_dataModel.updateOne({_id: id },laminate_data).exec()
        return res.json(laminate_data);
    } else {
        // create
        return res.status(400).json({ "message": "Error" })
       
    }
},

/**
 * laminate_dataController.remove()
 */
remove: async function (req, res) {
    const id = req.params.id;
   await Laminate_dataModel.findByIdAndDelete(id).exec();
        return res.status(204).json();

}
};