const express = require('express');
const router = express.Router();
const columnsController = require('../controllers/columnsController');

router.get('/', columnsController.getAll);
router.get('/:id', columnsController.getById);
router.post('/', columnsController.add);
router.put('/:id', columnsController.updateById);
router.delete('/:id', columnsController.deleteById);
router.delete('/', columnsController.deleteAll);

module.exports = router