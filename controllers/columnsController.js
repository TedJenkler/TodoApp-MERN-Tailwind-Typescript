const Board = require('../schemas/boardSchema');
const Columns = require('../schemas/columnsSchema');

exports.getAll = async (req, res) => {
    try {
        const columns = await Columns.find();

        if (columns.length === 0) {
            return res.status(404).json({ message: 'No columns found' });
        }

        res.status(200).json({ message: 'Successfully fetched all columns', columns });
    } catch (error) {
        console.error('Error fetching columns', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        const column = await Columns.findById(id);

        if (!column) {
            return res.status(404).json({ message: 'No column found' });
        }

        res.status(200).json({ message: 'Successfully fetched column', column });
    } catch (error) {
        console.error('Error fetching column', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.add = async (req, res) => {
    try {
        const { name, boardId } = req.body;

        const checkName = await Columns.findOne({ name });
        if (checkName) {
            return res.status(400).json({ message: 'Column name already exists' });
        }

        const column = new Columns({ name, boardId });
        await column.save();

        const updateBoard = await Board.findByIdAndUpdate(
            boardId,
            { $push: { columns: column._id } },
            { new: true }
        );
        if (!updateBoard) {
            return res.status(404).json({ message: `Error saving to board with ID ${boardId}` });
        }

        res.status(201).json({ message: 'Successfully added column', column });
    } catch (error) {
        console.error('Error adding column', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const checkName = await Columns.findOne({ name });
        if (checkName) {
            return res.status(400).json({ message: 'Column name already exists' });
        }

        const updateColumn = await Columns.findByIdAndUpdate(id, { name }, { new: true });
        if (!updateColumn) {
            return res.status(404).json({ message: 'Column not found' });
        }

        res.status(200).json({ message: 'Successfully updated column', column: updateColumn });
    } catch (error) {
        console.error('Error updating column', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;

        const column = await Columns.findByIdAndDelete(id);
        
        if (!column) {
            return res.status(404).json({ message: 'Column not found' });
        }

        const updateBoard = await Board.findByIdAndUpdate(
            column.boardId,
            { $pull: { columns: id } },
            { new: true }
        );
        if (!updateBoard) {
            return res.status(404).json({ message: `Could not find column ${column._id} in board` });
        };

        res.status(200).json({ message: 'Successfully deleted column', column });
    } catch (error) {
        console.error('Error deleting column', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        const columns = await Columns.find();
        if (!columns || columns.length === 0) {
            return res.status(404).json({ message: 'No columns found' });
        }

        const boardIds = [...new Set(columns.map(column => column.boardId.toString()))];

        const updateBoardsPromises = boardIds.map(async (boardId) => {
            const updateBoard = await Board.findByIdAndUpdate(
                boardId,
                { $pull: { columns: { $in: columns.map(col => col._id) } } },
                { new: true }
            );
            return updateBoard;
        });

        const updatedBoards = await Promise.all(updateBoardsPromises);
        if (updatedBoards.some(board => !board)) {
            return res.status(404).json({ message: 'Failed to update some boards' });
        }

        await Columns.deleteMany();

        res.status(200).json({ message: 'Successfully deleted all columns' });
    } catch (error) {
        console.error('Error deleting all columns', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};