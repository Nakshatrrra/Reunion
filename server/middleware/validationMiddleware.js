const { check, validationResult } = require('express-validator');

// Validation rules
exports.validateTask = [
    check('title').notEmpty().withMessage('Title is required'),
    check('startTime').isISO8601().toDate().withMessage('Start time must be a valid date'),
    check('endTime').isISO8601().toDate().withMessage('End time must be a valid date'),
    check('priority').isIn(['high', 'medium', 'low']).withMessage('Invalid priority value'),
    check('status').isIn(['pending', 'finished']).withMessage('Invalid status value'),
];

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
