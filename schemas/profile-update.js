const joi = require("joi");

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