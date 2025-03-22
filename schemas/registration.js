const joi = require("joi");

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