const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

router.get('/', boardController.getAll);
router.get('/:id', boardController.getById);
router.post('/add', boardController.addBoard);
router.put('/:id', boardController.updateById);
router.delete('/:id', boardController.deleteById);
router.delete('/', boardController.deleteAll);

module.exports = router;