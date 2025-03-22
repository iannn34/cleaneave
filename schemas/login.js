const joi = require("joi");

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