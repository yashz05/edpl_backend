const Customer_gradeModel = require('../models/customer_gradeModel.js');

/**
 * customer_gradeController.js
 *
 * @description :: Server-side logic for managing customer_grades.
 */
module.exports = {

    /**
     * customer_gradeController.list()
     */
    list: async function (req, res) {
        const all = await Customer_gradeModel.find({})

        return res.json(all);

    },

    /**
     * customer_gradeController.show()
     */
    show: async function (req, res) {
        const id = req.params.id;
        const customer_grade = await Customer_gradeModel.findOne({ _id: id }).exec()
        if (customer_grade != null) {
            return res.json(customer_grade);
        } else {
            return res.json({ "message": "not found !" });
        }

  
    },

    /**
     * customer_gradeController.create()
     */
    create: async function (req, res) {
        const customer_grade = new Customer_gradeModel({
			title : req.body.title,
			active : req.body.active});
            try {
                await Customer_gradeModel.create(customer_grade);
        return res.status(201).json(customer_grade)
            } catch (e) {
            return res.status(400).json({ "message": "Error" + e })

        }

},

/**
 * customer_gradeController.update()
 */
update: async function (req, res) {
    const id = req.params.id;
    const customer_grade = await Customer_gradeModel.findOne({ _id: id }).exec()
    if (customer_grade != null) {
        // update
        customer_grade.title = req.body.title ? req.body.title : customer_grade.title;
			customer_grade.active = req.body.active ? req.body.active : customer_grade.active;
			
        await Customer_gradeModel.updateOne({_id: id },customer_grade).exec()
        return res.json(customer_grade);
    } else {
        // create
        return res.status(400).json({ "message": "Error" })
       
    }
},

/**
 * customer_gradeController.remove()
 */
remove: async function (req, res) {
    const id = req.params.id;
   await Customer_gradeModel.findByIdAndDelete(id).exec();
        return res.status(204).json();

}
};