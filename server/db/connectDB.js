const mongoose = require('mongoose');

const connectDB = async (url) => {
  return await mongoose.connect(url).then(()=>console.log("DB is connected"));
  
};

module.exports = connectDB;
