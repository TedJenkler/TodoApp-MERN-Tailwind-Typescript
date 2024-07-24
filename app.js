const express = require('express');
const app = express();
const PORT = process.env.PORT || 2000;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors')
const boardRoutes = require('./routes/boardroutes');
const columnsRoutes = require('./routes/columnsroutes');
const todoRoutes = require('./routes/todoroutes');
const subtodoRoutes = require('./routes/subtodoroutes');
const morgan = require('morgan');
const path = require('path');

dotenv.config();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
};

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.static(path.join(__dirname, '/client/dist')));

app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnsRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/subtodos', subtodoRoutes);

mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB...', err));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});