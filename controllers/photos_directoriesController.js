const Photos_directoriesModel = require('../models/photos_directoriesModel.js');

/**
 * photos_directoriesController.js
 *
 * @description :: Server-side logic for managing photos_directoriess.
 */
module.exports = {

    /**
     * photos_directoriesController.list()
     */
    list: async function (req, res) {
        const all = await Photos_directoriesModel.find({})

        return res.json(all);

    },

    /**
     * photos_directoriesController.show()
     */
    show: async function (req, res) {
        const id = req.params.id;
        const photos_directories = await Photos_directoriesModel.findOne({ _id: id }).exec()
        if (photos_directories != null) {
            return res.json(photos_directories);
        } else {
            return res.json({ "message": "not found !" });
        }

  
    },

    /**
     * photos_directoriesController.create()
     */
    create: async function (req, res) {
        const photos_directories = new Photos_directoriesModel({
			name : req.body.name,
			parent_directory : req.body.parent_directory});
            try {
                await Photos_directoriesModel.create(photos_directories);
        return res.status(201).json(photos_directories)
            } catch (e) {
            return res.status(400).json({ "message": "Error" + e })

        }

},

/**
 * photos_directoriesController.update()
 */
update: async function (req, res) {
    const id = req.params.id;
    const photos_directories = await Photos_directoriesModel.findOne({ _id: id }).exec()
    if (photos_directories != null) {
        // update
        photos_directories.name = req.body.name ? req.body.name : photos_directories.name;
			photos_directories.parent_directory = req.body.parent_directory ? req.body.parent_directory : photos_directories.parent_directory;
			
        await Photos_directoriesModel.updateOne({_id: id },photos_directories).exec()
        return res.json(photos_directories);
    } else {
        // create
        return res.status(400).json({ "message": "Error" })
       
    }
},

/**
 * photos_directoriesController.remove()
 */
remove: async function (req, res) {
    const id = req.params.id;
   await Photos_directoriesModel.findByIdAndDelete(id).exec();
        return res.status(204).json();

}
};