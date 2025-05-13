const joi = require("joi");

/**
 * Schema for user registration validation using Joi.
 * 
 * Fields:
 * - `name` (string, required): 
 *   - Must be a non-empty string.
 *   - Error message: "Name required" if empty.
 * 
 * - `email` (string, required): 
 *   - Must be a valid email address.
 *   - Error messages: 
 *     - "Email required" if empty.
 *     - "Enter a valid email address" if not a valid email.
 * 
 * - `contact` (string, required): 
 *   - Must match the pattern for a valid contact number (7-20 characters, may include `+`, spaces, `-`, or parentheses).
 *   - Error messages: 
 *     - "Contact required" if empty.
 *     - "Enter valid contact" if it doesn't match the pattern.
 * 
 * - `password` (string, required): 
 *   - Must be 8-20 characters long and include:
 *     - At least one uppercase letter.
 *     - At least one lowercase letter.
 *     - At least one digit.
 *     - At least one special character.
 *   - Error messages: 
 *     - "Password required" if empty.
 *     - "Password must:
 *       1. Be at least 8 characters long
 *       2. Include at least one uppercase letter
 *       3. Include at least one lowercase letter
 *       4. Include at least one digit
 *       5. Include at least one special character." if it doesn't match the pattern.
 */

const registerSchema = joi.object({
    name:
    joi.string().required().min(1)
        .messages({"string.empty" : "Name required",}),

    email:
    joi.string().email().required()
        .messages({"string.empty" : "Email required","string.email" : "Enter a valid email address" }),

    contact:
    joi.string().required().pattern(/^\+?[0-9\s\-()]{7,20}$/)
        .messages({"string.empty" : "Contact required","string.pattern.base" : "Enter valid contact"}),

    password:
    joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/)
        .messages({"string.empty" : "Password required","string.pattern.base" : "Password must: \n" +
                "1. Be at least 8 characters long \n" +
                "2. Include at least one uppercase letter\n" +
                "3. Include at least one lowercase letter\n" +
                "4. Include at least one digit\n" +
                "5. Include at least one special character."}),
})

module.exports = registerSchema;