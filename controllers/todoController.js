const Columns = require('../schemas/columnsSchema');
const Todo = require('../schemas/todoSchema');
const Subtodo = require('../schemas/subtodoSchema');

exports.getAll = async (req, res) => {
    try {
        const todos = await Todo.find();
        
        res.status(200).json({ message: 'Successfully fetched all todos', todos });
    } catch (error) {
        console.error('Error fetching all todos', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json({ message: 'Successfully fetched todo', todo });
    } catch (error) {
        console.error('Error fetching todo', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.addTodo = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        if (!title || !status) {
            return res.status(400).json({ message: 'title status are required' });
        }

        const todo = new Todo({
            title,
            description,
            status
        });

        await todo.save();

        const updateColumn = await Columns.findByIdAndUpdate(status, { $push: { todos: todo._id } }, { new: true });
        if (!updateColumn) {
            return res.status(404).json({ message: 'Could not update Column' });
        }

        res.status(201).json({ message: 'Successfully created todo', todo });
    } catch (error) {
        console.error('Error adding todo', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        if (!title || !status) {
            return res.status(400).json({ message: 'Title and status are required' });
        }

        const oldTodo = await Todo.findById(id);
        if (!oldTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        const updatedTodo = await Todo.findByIdAndUpdate(id, { title, description, status }, { new: true });
        if (!updatedTodo) {
            return res.status(500).json({ message: 'Error updating todo' });
        }

        const updateOldColumn = await Columns.findByIdAndUpdate(oldTodo.status, { $pull: { todos: id } }, { new: true });
        if (!updateOldColumn) {
            return res.status(500).json({ message: 'Error updating old column' });
        }

        const updateNewColumn = await Columns.findByIdAndUpdate(status, { $push: { todos: id } }, { new: true });
        if (!updateNewColumn) {
            return res.status(500).json({ message: 'Error updating new column' });
        }

        res.status(200).json({ message: 'Successfully updated todo', todo: updatedTodo });
    } catch (error) {
        console.error('Error updating todo', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findByIdAndDelete(id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        await Subtodo.deleteMany({ todoId: id });

        const updateColumn = await Columns.findByIdAndUpdate(
            todo.status,
            { $pull: { todos: id } },
            { new: true }
        );
        if (!updateColumn) {
            return res.status(500).json({ message: "Error updating column" });
        }

        res.status(200).json({ message: "Successfully deleted todo", todo });
    } catch (error) {
        console.error("Error deleting todo", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        const todos = await Todo.find();
        if (todos.length === 0) {
            return res.status(404).json({ message: 'No todos found' });
        }

        const todoIds = todos.map(todo => todo._id);

        await Subtodo.deleteMany({ todoId: { $in: todoIds } });

        await Todo.deleteMany({ _id: { $in: todoIds } });

        await Columns.updateMany(
            { todos: { $in: todoIds } },
            { $pull: { todos: { $in: todoIds } } }
        );

        res.status(200).json({ message: 'Successfully deleted all todos and updated columns' });
    } catch (error) {
        console.error('Error deleting all todos', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};