const { body, validationResult } = require('express-validator');

exports.validateCustomer = [
  body('first_name').notEmpty().withMessage('First Name is required'),
  body('email').notEmpty().withMessage('Email is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];