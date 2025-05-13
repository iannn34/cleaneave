const joi = require("joi")

/**
 * Schema for validating a password reset input.
 * 
 * The password must meet the following criteria:
 * 1. Be at least 8 characters long and no more than 20 characters.
 * 2. Include at least one uppercase letter.
 * 3. Include at least one lowercase letter.
 * 4. Include at least one digit.
 * 5. Include at least one special character (e.g., symbols or punctuation).
 * 
 * Validation Errors:
 * - "Password required" if the password field is empty.
 * - "Password must:" followed by the specific requirements if the password does not match the pattern.
 * 
 * @type {Object} Joi schema object for password validation.
 */

const passwordSchema = joi.object({
    password:
        joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/)
            .messages({"string.empty" : "Password required","string.pattern.base" : "Password must: \n" +
                    "1. Be at least 8 characters long \n" +
                    "2. Include at least one uppercase letter\n" +
                    "3. Include at least one lowercase letter\n" +
                    "4. Include at least one digit\n" +
                    "5. Include at least one special character."})
})

module.exports = passwordSchema;