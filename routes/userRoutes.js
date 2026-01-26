/**
 * User Routes
 * API endpoints untuk operasi user
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { 
    createUserValidation, 
    updateUserValidation, 
    getUserValidation,
    listUsersValidation 
} = require('../utils/validator');

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Public
 */
router.post('/', createUserValidation, userController.createUser);

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination
 * @access  Public
 */
router.get('/', listUsersValidation, userController.getUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/:id', getUserValidation, userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Public
 */
router.put('/:id', updateUserValidation, userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Public
 */
router.delete('/:id', getUserValidation, userController.deleteUser);

/**
 * @route   POST /api/users/:id/topup
 * @desc    Add balance to user (Top Up)
 * @access  Public
 */
router.post('/:id/topup', getUserValidation, userController.topUpBalance);

module.exports = router;
