const express = require('express');
require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const morgan = require('morgan');
PORT = process.env.PORT || 5000;
const connectDB = require('./db/connectDB');

// connectDB()
const app = express(); 
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use('/api/v1/transactions', require('./routes/Transaction'));
const startServer = () => {
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (err) {
    throw new Error(err);
  }
};

startServer();
