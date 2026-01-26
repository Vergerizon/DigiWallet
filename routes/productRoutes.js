/**
 * Product Routes
 * API endpoints untuk operasi produk PPOB
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { 
    createProductValidation, 
    updateProductValidation, 
    getProductValidation,
    listProductsValidation 
} = require('../utils/validator');

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Public
 */
router.post('/', createProductValidation, productController.createProduct);

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination and filters
 * @access  Public
 */
router.get('/', listProductsValidation, productController.getProducts);

/**
 * @route   GET /api/products/type/:type
 * @desc    Get products by type
 * @access  Public
 */
router.get('/type/:type', productController.getProductsByType);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', getProductValidation, productController.getProductById);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Public
 */
router.put('/:id', updateProductValidation, productController.updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Public
 */
router.delete('/:id', getProductValidation, productController.deleteProduct);

/**
 * @route   PATCH /api/products/:id/toggle-status
 * @desc    Toggle product status (active/inactive)
 * @access  Public
 */
router.patch('/:id/toggle-status', getProductValidation, productController.toggleProductStatus);

module.exports = router;
