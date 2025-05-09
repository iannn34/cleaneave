const path = require("path");

/**
 * Serves a static file from the specified directory.
 *
 * @param {string} file - The name of the file to be served.
 * @returns {Function} - An Express middleware function that handles the request and response.
 *
 * @throws {Error} - If an error occurs while serving the file, a 500 status code is sent with an error message.
 */

const serveFile = (file) => (req, res) => {
    try {
        res.status(200).sendFile(path.join(__dirname, "..","public","html", file));
    } catch (error) {
        res.sendStatus(500).json({ message : "Internal server error"})
    }
}

module.exports = serveFile;