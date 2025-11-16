const { body, validationResult } = require('express-validator');

// Validation middleware helper
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array() 
    });
  }
  next();
};

// Registration validation
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['buyer', 'seller'])
    .withMessage('Role must be either buyer or seller'),
  validate
];

// Login validation
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

// Auction creation validation
const auctionValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('startingPrice')
    .isFloat({ min: 0.01 })
    .withMessage('Starting price must be greater than 0'),
  body('duration')
    .isInt({ min: 1, max: 365 })
    .withMessage('Duration must be between 1 and 365 days'),
  validate
];

// Bid validation
const bidValidation = [
  body('auctionId')
    .isString()
    .notEmpty()
    .withMessage('Valid auction ID is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Bid amount must be greater than 0'),
  validate
];

// Rating validation
const ratingValidation = [
  body('sellerId')
    .isString()
    .notEmpty()
    .withMessage('Valid seller ID is required'),
  body('auctionId')
    .isString()
    .notEmpty()
    .withMessage('Valid auction ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment must not exceed 500 characters'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  auctionValidation,
  bidValidation,
  ratingValidation
};
