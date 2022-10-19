const { StatusCodes } = require('http-status-codes');
const Transaction = require('../models/Transaction');

// addTransactions
const addTransactionDetails=async(req,res)=>{
  const transaction = await Transaction.create(req.body);
  console.log("Transactions")
 return res.status(StatusCodes.CREATED).json({ transaction });
}
// getTransactions
const getTransactionDetails = async (req, res) => {
  console.log("get end point")
  const { id } = req.params;
  const transaction = await Transaction.find({ _id: id });

  return res.status(StatusCodes.OK).json({ transaction });
};
// getAllTransactions
const getAllTransactionDetails = async (req, res) => {
  const transactions = await Transaction.find({});
 return res.status(StatusCodes.OK).json({ transactions });
};
// updateTransactions
const updateTransaction = async (req, res) => {
  console.log("update Transactions")
  const { id } = req.params;
  console.log(req.body)
  const transaction = await Transaction.findByIdAndUpdate(id, req.body);
 return res.status(StatusCodes.OK).json({ transaction });
};
// deleteTransactions
const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findByIdAndDelete(id);
  if (!transaction) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Transaction not found' });
  } else {
    res.status(StatusCodes.OK).json({ transaction });
  }
};

module.exports = {
  addTransactionDetails,
  getTransactionDetails,
  getAllTransactionDetails,
  updateTransaction,
  deleteTransaction,
};
