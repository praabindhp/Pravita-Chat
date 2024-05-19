const CryptoJS = require('crypto-js');

const encryptMessage = (message, key) => {
    const ciphertext = CryptoJS.AES.encrypt(message, key).toString();
    const hash = CryptoJS.SHA256(message).toString();
    return { ciphertext, hash };
};

const decryptMessage = (ciphertext, key) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

module.exports = { encryptMessage, decryptMessage };
