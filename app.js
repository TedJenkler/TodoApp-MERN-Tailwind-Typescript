const express = require("express");
const app = express();
const PORT = process.env.PORT || 2000;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const boardRoutes = require('./routes/boardroutes');
const columnsRoutes = require('./routes/columnsroutes');
const todoRoutes = require('./routes/todoroutes');

dotenv.config();

app.use(express.json());

app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnsRoutes);
app.use('/api/todos', todoRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});