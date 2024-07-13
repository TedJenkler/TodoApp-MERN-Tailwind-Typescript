const express = require('express');
const router = express.Router();
const SubtodoController = require('../controllers/subtodoController');

router.get('/:id', SubtodoController.getByTodoId);
router.get('/', SubtodoController.getAllSubtodos);
router.post('/', SubtodoController.addSubtodos);
router.put('/:id', SubtodoController.updateByTodoId);

module.exports = router;