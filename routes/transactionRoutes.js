/**
 * Transaction Routes
 * API endpoints untuk operasi transaksi PPOB
 */

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { idempotencyMiddleware } = require('../middleware/idempotency');
const { 
    createTransactionValidation, 
    getTransactionValidation,
    listTransactionsValidation 
} = require('../utils/validator');

/**
 * @route   POST /api/transactions
 * @desc    Create new transaction (purchase PPOB product)
 * @access  Public
 * @header  X-Idempotency-Key (optional) - Untuk mencegah double submit
 */
router.post('/', 
    idempotencyMiddleware, 
    createTransactionValidation, 
    transactionController.createTransaction
);

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions with pagination and filters
 * @access  Public
 */
router.get('/', listTransactionsValidation, transactionController.getTransactions);

/**
 * @route   GET /api/transactions/reference/:reference
 * @desc    Get transaction by reference number
 * @access  Public
 */
router.get('/reference/:reference', transactionController.getTransactionByReference);

/**
 * @route   GET /api/transactions/user/:userId
 * @desc    Get transactions by user
 * @access  Public
 */
router.get('/user/:userId', listTransactionsValidation, transactionController.getTransactionsByUser);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get transaction by ID
 * @access  Public
 */
router.get('/:id', getTransactionValidation, transactionController.getTransactionById);


/**
 * @route   PATCH /api/transactions/:id/cancel
 * @desc    Cancel transaction (only for PENDING)
 * @access  Public
 */
router.patch('/:id/cancel', getTransactionValidation, transactionController.cancelTransaction);

/**
 * @route   PATCH /api/transactions/:id/refund
 * @desc    Refund transaction (only for SUCCESS)
 * @access  Public
 */
router.patch('/:id/refund', getTransactionValidation, transactionController.refundTransaction);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete transaction by ID
 * @access  Public
 */
router.delete('/:id', getTransactionValidation, transactionController.deleteTransaction);

module.exports = router;
