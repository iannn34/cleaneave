/**
 * Logs out the user by clearing the authentication token cookie and redirecting to the login page.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the logout process is complete.
 */


const logout = async (req,res) => {
    try {
        res.clearCookie("token");
        res.redirect("/login");
    } catch (error) {
        res.sendStatus(500).json({message : "Internal server error"})
    }
}

module.exports = logout;