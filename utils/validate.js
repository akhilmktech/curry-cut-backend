const { z } = require('zod');

function validateMiddleware(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (result.success) {
      req.body = result.data;
      return next();
    }

    // Standard Zod error formatting
    const formatted = result.error.format();
    const formattedErrors = {};

    // Flatten errors for easier frontend consumption
    Object.keys(formatted).forEach(key => {
      if (key !== '_errors') {
        formattedErrors[key] = formatted[key]._errors;
      }
    });

    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: formattedErrors,
    });
  };
}

module.exports = validateMiddleware;

