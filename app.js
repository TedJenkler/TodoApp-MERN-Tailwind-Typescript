const express = require('express');
const app = express();
const PORT = process.env.PORT || 2000;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors package
const boardRoutes = require('./routes/boardroutes');
const columnsRoutes = require('./routes/columnsroutes');
const todoRoutes = require('./routes/todoroutes');
const subtodoRoutes = require('./routes/subtodoroutes');

dotenv.config();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnsRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/subtodos', subtodoRoutes);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB...', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});