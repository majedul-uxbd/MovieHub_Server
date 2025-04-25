/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Ultra-X Asia Pacific
 * 
 * @description 
 * 
 */

const path = require('path');
const fs = require('fs');
/**
 * @param {number} code 
 * @param {string} msgKey 
 * @param {number} [result] 
 * @description This function is used to send messages (success or error) with status code. Optionally includes result.
 */
const setServerResponse = (code, msgKey, result = null) => {
    // Path to the JSON file containing translations
    const filePath = path.join(__dirname, './server-response-key.json');


    let messages;
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        messages = JSON.parse(fileContent);
    } catch (error) {
        throw new Error('Unable to load translations file.');
    }

    const message = messages[msgKey] || "Unknown message";

    // Determine success or error status
    const statusType = code >= 200 && code < 300 ? 'success' : 'failed';

    const response = {
        statusCode: code,
        status: statusType,
        message: message
    };

    if (result !== null) {
        response.data = result;
    }

    return response;
};


module.exports = {
    setServerResponse
};