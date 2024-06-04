const express = require('express');
const router = express.Router();
const photos_directoriesController = require('../controllers/photos_directoriesController.js');

/*
 * GET
 */
router.get('/', photos_directoriesController.list);

/*
 * GET
 */
router.get('/:id', photos_directoriesController.show);

/*
 * POST
 */
router.post('/', photos_directoriesController.create);

/*
 * PUT
 */
router.put('/:id', photos_directoriesController.update);

/*
 * DELETE
 */
router.delete('/:id', photos_directoriesController.remove);

module.exports = router;
