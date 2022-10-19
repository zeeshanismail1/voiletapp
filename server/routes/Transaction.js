const express = require('express');
const router = express.Router();
const {
  addTransactionDetails,
  getTransactionDetails,
  getAllTransactionDetails,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/Transaction');
router.get('/', getAllTransactionDetails);
router.post('/',addTransactionDetails)
router.get('/:id', getTransactionDetails);
router.patch('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
module.exports = router;
