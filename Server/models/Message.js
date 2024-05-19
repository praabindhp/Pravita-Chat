const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    content: { type: String, required: true },  // Encrypted Message
    timestamp: { type: Date, default: Date.now },
    hash: { type: String, required: true }  // Message Hash
});

module.exports = mongoose.model('Message', messageSchema);
