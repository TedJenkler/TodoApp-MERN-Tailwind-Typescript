const express = require('express');
const router = express.Router();
const todoRouter = require('../controllers/todoController');

router.get('/', todoRouter.getAll);
router.get('/:id', todoRouter.getById);
router.post('/', todoRouter.addTodo);
router.put('/:id', todoRouter.updateById);
router.delete('/:id', todoRouter.deleteById);
router.delete('/', todoRouter.deleteAll);

module.exports = router