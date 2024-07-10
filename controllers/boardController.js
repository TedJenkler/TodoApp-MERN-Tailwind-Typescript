const Board = require('../schemas/boardSchema');

exports.addBoard = async (req, res) => {
    try {
        const { name } = req.body;

        const existingBoard = await Board.findOne({ name: name });
        if(existingBoard) {
            return res.status(400).json({ message: 'Board already exists' });
        }

        const board = new Board({
            name,
        });

        const savedBoard = board.save();

        res.status(201).json({ message: 'Successfully added board', board: savedBoard });
    }catch (error) {
        console.error('Error adding board', error);
        res.status(500).json({ message: 'Internal Server Error'});
    }
};