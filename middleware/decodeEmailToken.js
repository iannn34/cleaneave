const crypto_js = require('crypto-js');
require('dotenv').config();

/**
 * Decrypts the token to retrieve user_id and OTP
 * @param {string} token - The encrypted token
 * @returns {Promise<{user_id: number, token: string}>} - Decrypted user_id and OTP
 */

function decryptToken (token) {
    try{
        const bytes = crypto_js.AES.decrypt(token, process.env.SECRET_KEY);

        return JSON.parse(bytes.toString(crypto_js.enc.Utf8));
    }catch (error){
        console.log(error);
    }
}

module.exports = decryptToken;
//
// // Example usage
// (async () => {
//     const decryptedData =  await decryptToken(token);
//     console.log("Decrypted Data:", decryptedData.user_id, decryptedData.token);
// })();