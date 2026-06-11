const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/messageController');

// Route to get all messages for a specific conversation
router.get('/:conversationId', messageController.getMessages);

// Route to post a new message to a conversation
router.post('/', messageController.sendMessage);

module.exports = router;