const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Please enter description'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter price'],
  },
  category: [
  {
    type: String,
    required: [true, 'Please enter category'],
    enum: [ "income","expence", "return"]
  },
],

});
module.exports = mongoose.model('Transaction', transactionSchema);
