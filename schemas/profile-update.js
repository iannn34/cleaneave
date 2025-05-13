const joi = require("joi");

/**
 * Schema for validating profile update data using Joi.
 * 
 * Fields:
 * - `name`: A required string with a minimum length of 1. 
 *   - Error Messages:
 *     - "Name required" if the field is empty.
 * 
 * - `email`: A required string in a valid email format.
 *   - Error Messages:
 *     - "Enter a valid email address" if the email format is invalid.
 * 
 * - `contact`: A required string matching a specific pattern for phone numbers.
 *   - Pattern: Allows optional "+" followed by digits, spaces, hyphens, or parentheses, with a length between 7 and 20 characters.
 *   - Error Messages:
 *     - "Contact required" if the field is empty.
 *     - "Enter valid contact" if the value does not match the pattern.
 */

const profileUpdateSchema = joi.object({
    name:
        joi.string().required().min(1)
            .messages({"string.empty" : "Name required"}),

    email:
        joi.string().email().required()
            .messages({"string.email" : "Enter a valid email address" }),

    contact:
        joi.string().required().pattern(/^\+?[0-9\s\-()]{7,20}$/)
            .messages({"string.empty" : "Contact required","string.pattern.base" : "Enter valid contact"}),
})


module.exports = profileUpdateSchema;