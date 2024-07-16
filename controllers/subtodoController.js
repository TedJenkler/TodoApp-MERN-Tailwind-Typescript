const Subtodo = require('../schemas/subtodoSchema');
const Todo = require('../schemas/todoSchema');

exports.getAllSubtodos = async (req, res) => {
    try {
        const subtodos = await Subtodo.find();
        if (!subtodos || subtodos.length === 0) {
            return res.status(404).json({ message: 'No subtodos found' });
        }

        res.status(200).json({ message: 'Successfully fetched subtodos', subtodos });
    }
    catch (error) {
        console.error('Error fetching subtodos', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getByTodoId = async (req, res) => {
    try {
        const { id } = req.params;

        const subtodos = await Subtodo.find({ todoId: id });
        if (!subtodos || subtodos.length === 0) {
            return res.status(404).json({ message: `No subtodos found for todo ${id}` });
        }

        res.status(200).json({ message: `Successfully fetched subtodos for todo ${id}`, subtodos });
    } catch (error) {
        console.error('Error fetching Todos subtodos', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.addSubtodos = async (req, res) => {
    try {
        const { subTodos, todoId } = req.body;

        if (!Array.isArray(subTodos) || subTodos.length === 0) {
            return res.status(400).json({ message: 'subTodos should be a non-empty array' });
        }

        const subTodosWithTodoId = subTodos.map(subTodo => ({
            ...subTodo,
            todoId: todoId
        }));

        const insertedSubtodos = await Subtodo.insertMany(subTodosWithTodoId);

        const updateTodo = await Todo.findByIdAndUpdate(todoId, { $push: { subtodos: insertedSubtodos.map(sub => sub._id) } }, { new: true });
        if (!updateTodo) {
            return res.status(404).json({ message: 'Cannot update Todo' });
        }

        res.status(201).json({ message: 'Successfully added subtodos', subtodos: insertedSubtodos });
    } catch (error) {
        console.error('Error adding subtodos', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateByTodoId = async (req, res) => {
    try {
        const { id } = req.params;
        const { subTodos } = req.body;
        if (!Array.isArray(subTodos)) {
            return res.status(400).json({ message: 'subTodos should be an array' });
        }

        const subTodoIds = subTodos.map(subTodo => subTodo._id);

        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { subtodos: subTodoIds },
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: `Todo with ID ${id} not found` });
        }

        await Subtodo.deleteMany({ todoId: id });
        if (subTodos.length > 0) {
            const insertedSubtodos = await Subtodo.insertMany(subTodos.map(subTodo => ({
                ...subTodo,
                todoId: id
            })));

            updatedTodo.subtodos = insertedSubtodos.map(sub => sub._id);
            await updatedTodo.save();

            res.status(200).json({ message: 'Successfully updated todo and subtodos', updatedTodo, subtodos: insertedSubtodos });
        } else {
            res.status(200).json({ message: 'Successfully updated todo (no subtodos provided)', updatedTodo });
        }
    } catch (error) {
        console.error('Error updating Todo and subtodos', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.toggleSubtodo = async (req, res) => {
    try {
        const { id } = req.params;

        const subtodo = await Subtodo.findById(id);
        if (!subtodo) {
            return res.status(404).json({ message: `Subtodo with ID ${id} not found` });
        }

        const updatedSubtodo = await Subtodo.findByIdAndUpdate(id, { isCompleted: !subtodo.isCompleted }, { new: true });

        res.status(200).json({ message: 'Successfully toggled subtodo', subtodo: updatedSubtodo });
    } catch (error) {
        console.error('Error toggling subtodo', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};