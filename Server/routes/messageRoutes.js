const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { encryptMessage, decryptMessage } = require('../utils/crypto');

const generateKey = (user1, user2) => {
    return user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
};

router.post('/send', async (req, res) => {
    const { sender, recipient, content } = req.body;
    const key = generateKey(sender, recipient);
    const { ciphertext, hash } = encryptMessage(content, key);
    const message = new Message({ sender, recipient, content: ciphertext, hash });
    try {
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:user1/:user2', async (req, res) => {
    const { user1, user2 } = req.params;
    const key = generateKey(user1, user2);
    try {
        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 }
            ]
        }).sort('timestamp');

        const decryptedMessages = messages.map(msg => ({
            sender: msg.sender,
            recipient: msg.recipient,
            content: decryptMessage(msg.content, key),
            timestamp: msg.timestamp,
            hash: msg.hash
        }));

        res.json(decryptedMessages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:user1/:user2', async (req, res) => {
    const { user1, user2 } = req.params;
    try {
        await Message.deleteMany({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 }
            ]
        });
        res.status(200).json({ message: 'Messages deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
