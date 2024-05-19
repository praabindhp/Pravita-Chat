const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.post('/send', async (req, res) => {
    const { sender, recipient, content } = req.body;
    const message = new Message({ sender, recipient, content });
    try {
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/messages/:user1/:user2', async (req, res) => {
    const { user1, user2 } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 }
            ]
        }).sort('timestamp');
        res.json(messages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
