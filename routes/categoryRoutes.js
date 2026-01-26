/**
 * Category Routes
 * API endpoints untuk operasi kategori
 */

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { body, param, query } = require('express-validator');
const { handleValidationErrors } = require('../utils/validator');

// Validation rules
const createCategoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama category wajib diisi')
        .isLength({ min: 2, max: 100 }).withMessage('Nama category harus 2-100 karakter'),
    body('parent_id')
        .optional({ nullable: true })
        .isInt({ min: 1 }).withMessage('Parent ID tidak valid'),
    body('description')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 }).withMessage('Deskripsi maksimal 500 karakter'),
    body('is_active')
        .optional()
        .isBoolean().withMessage('Status aktif harus boolean'),
    handleValidationErrors
];

const updateCategoryValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID category tidak valid'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Nama category harus 2-100 karakter'),
    body('parent_id')
        .optional({ nullable: true })
        .custom((value) => {
            if (value === null || value === '' || value === 0) return true;
            return Number.isInteger(parseInt(value)) && parseInt(value) > 0;
        }).withMessage('Parent ID tidak valid'),
    body('description')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 }).withMessage('Deskripsi maksimal 500 karakter'),
    body('is_active')
        .optional()
        .isBoolean().withMessage('Status aktif harus boolean'),
    handleValidationErrors
];

const getCategoryValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID category tidak valid'),
    handleValidationErrors
];

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Public
 */
router.post('/', createCategoryValidation, categoryController.createCategory);

/**
 * @route   GET /api/categories
 * @desc    Get all categories (supports hierarchical and flat view)
 * @access  Public
 * @query   parent_id - Filter by parent ID (use 'null' or 0 for root categories)
 * @query   is_active - Filter by active status
 * @query   flat - Set to 'true' for flat list, otherwise returns tree structure
 */
router.get('/', categoryController.getCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', getCategoryValidation, categoryController.getCategoryById);

/**
 * @route   GET /api/categories/:id/products
 * @desc    Get category with its products
 * @access  Public
 */
router.get('/:id/products', getCategoryValidation, categoryController.getCategoryWithProducts);

/**
 * @route   GET /api/categories/:id/subcategories
 * @desc    Get subcategories of a category
 * @access  Public
 */
router.get('/:id/subcategories', getCategoryValidation, categoryController.getSubcategories);

/**
 * @route   GET /api/categories/:id/path
 * @desc    Get category path (breadcrumb)
 * @access  Public
 */
router.get('/:id/path', getCategoryValidation, categoryController.getCategoryPath);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Public
 */
router.put('/:id', updateCategoryValidation, categoryController.updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Public
 */
router.delete('/:id', getCategoryValidation, categoryController.deleteCategory);

/**
 * @route   PATCH /api/categories/:id/toggle-status
 * @desc    Toggle category status (active/inactive)
 * @access  Public
 */
router.patch('/:id/toggle-status', getCategoryValidation, categoryController.toggleCategoryStatus);

module.exports = router;
