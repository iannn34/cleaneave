const joi = require("joi")

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