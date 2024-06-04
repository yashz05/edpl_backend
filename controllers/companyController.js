const CompanyModel = require('../models/companyModel.js');

/**
 * companyController.js
 *
 * @description :: Server-side logic for managing companys.
 */
module.exports = {

    /**
     * companyController.list()
     */
    list: async function (req, res) {
        const all = await CompanyModel.find({})

        return res.json(all);

    },

    /**
     * companyController.show()
     */
    show: async function (req, res) {
        const id = req.params.id;
        const company = await CompanyModel.findOne({ _id: id }).exec()
        if (company != null) {
            return res.json(company);
        } else {
            return res.json({ "message": "not found !" });
        }

  
    },

    /**
     * companyController.create()
     */
    create: async function (req, res) {
        const company = new CompanyModel({
			name : req.body.name,
			address : req.body.address,
            sid : req.body.sid,
			area_of_company : req.body.area_of_company,
			person_to_contact : req.body.person_to_contact,
			customer_type : req.body.customer_type,
			customer_grade : req.body.customer_grade,
			customer_history : req.body.customer_history,
			customer_history_with_euro : req.body.customer_history_with_euro,
			mass_mailling : req.body.mass_mailling,
			diwali_gift : req.body.diwali_gift,
			ladoo_gift : req.body.ladoo_gift,
			other_gift : req.body.other_gift,
			send_sample_catalogue : req.body.send_sample_catalogue,
			sample_catalouge_type : req.body.sample_catalouge_type,
			sample_catalouge_data : req.body.sample_catalouge_data,
			first_visited : req.body.first_visited,
			next_visit : req.body.next_visit
        
        });
            try {
                await CompanyModel.create(company);
        return res.status(201).json(company)
            } catch (e) {
            return res.status(400).json({ "message": "Error" + e })

        }

},

/**
 * companyController.update()
 */
update: async function (req, res) {
    const id = req.params.id;
    const company = await CompanyModel.findOne({ _id: id }).exec()
    if (company != null) {
        // update
        company.name = req.body.name ? req.body.name : company.name;
            company.sid = req.body.sid ? req.body.sid : company.sid;
			company.address = req.body.address ? req.body.address : company.address;
			company.area_of_company = req.body.area_of_company ? req.body.area_of_company : company.area_of_company;
			company.person_to_contact = req.body.person_to_contact ? req.body.person_to_contact : company.person_to_contact;
			company.customer_type = req.body.customer_type ? req.body.customer_type : company.customer_type;
			company.customer_grade = req.body.customer_grade ? req.body.customer_grade : company.customer_grade;
			company.customer_history = req.body.customer_history ? req.body.customer_history : company.customer_history;
			company.customer_history_with_euro = req.body.customer_history_with_euro ? req.body.customer_history_with_euro : company.customer_history_with_euro;
			company.mass_mailling = req.body.mass_mailling ? req.body.mass_mailling : company.mass_mailling;
			company.diwali_gift = req.body.diwali_gift ? req.body.diwali_gift : company.diwali_gift;
			company.ladoo_gift = req.body.ladoo_gift ? req.body.ladoo_gift : company.ladoo_gift;
			company.other_gift = req.body.other_gift ? req.body.other_gift : company.other_gift;
			company.send_sample_catalogue = req.body.send_sample_catalogue ? req.body.send_sample_catalogue : company.send_sample_catalogue;
			company.sample_catalouge_type = req.body.sample_catalouge_type ? req.body.sample_catalouge_type : company.sample_catalouge_type;
			company.sample_catalouge_data = req.body.sample_catalouge_data ? req.body.sample_catalouge_data : company.sample_catalouge_data;
			company.first_visited = req.body.first_visited ? req.body.first_visited : company.first_visited;
			company.next_visit = req.body.next_visit ? req.body.next_visit : company.next_visit;
			
        await CompanyModel.updateOne({_id: id },company).exec()
        return res.json(company);
    } else {
        // create
        return res.status(400).json({ "message": "Error" })
       
    }
},

/**
 * companyController.remove()
 */
remove: async function (req, res) {
    const id = req.params.id;
   await CompanyModel.findByIdAndDelete(id).exec();
        return res.status(204).json();

}
};