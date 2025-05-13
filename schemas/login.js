const joi = require("joi");

/**
 * Schema definition for validating login data using Joi.
 * 
 * This schema validates the following fields:
 * - `email`: A required string that must be a valid email address.
 *   - Error messages:
 *     - "Email required" if the email field is empty.
 *     - "Enter valid email address" if the email is not in a valid format.
 * - `password`: A required string.
 *   - Error message:
 *     - "Password required" if the password field is empty.
 * 
 */

loginSchema = joi.object({
    email:
    joi.string().required().email().messages({
        "string.empty" : "Email required",
        "string.email" : "Enter valid email address",
    }),
    password:
    joi.string().required().messages({"string.empty" : "Password required"})
})

module.exports = loginSchema;