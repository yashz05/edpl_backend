const Cache_queueModel = require('../models/cache_queueModel.js');

/**
 * cache_queueController.js
 *
 * @description :: Server-side logic for managing cache_queues.
 */
module.exports = {

    /**
     * cache_queueController.list()
     */
    list: async function (req, res) {
        const all = await Cache_queueModel.find({})

        return res.json(all);

    },

    /**
     * cache_queueController.show()
     */
    show: async function (req, res) {
        const id = req.params.id;
        const cache_queue = await Cache_queueModel.findOne({ _id: id }).exec()
        if (cache_queue != null) {
            return res.json(cache_queue);
        } else {
            return res.json({ "message": "not found !" });
        }

  
    },

    /**
     * cache_queueController.create()
     */
    create: async function (req, res) {
        const cache_queue = new Cache_queueModel({
			key : req.body.key,
			value : req.body.value});
            try {
                await Cache_queueModel.create(cache_queue);
        return res.status(201).json(cache_queue)
            } catch (e) {
            return res.status(400).json({ "message": "Error" + e })

        }

},

/**
 * cache_queueController.update()
 */
update: async function (req, res) {
    const id = req.params.id;
    const cache_queue = await Cache_queueModel.findOne({ _id: id }).exec()
    if (cache_queue != null) {
        // update
        cache_queue.key = req.body.key ? req.body.key : cache_queue.key;
			cache_queue.value = req.body.value ? req.body.value : cache_queue.value;
			
        await Cache_queueModel.updateOne({_id: id },cache_queue).exec()
        return res.json(cache_queue);
    } else {
        // create
        return res.status(400).json({ "message": "Error" })
       
    }
},

/**
 * cache_queueController.remove()
 */
remove: async function (req, res) {
    const id = req.params.id;
   await Cache_queueModel.findByIdAndDelete(id).exec();
        return res.status(204).json();

}
};