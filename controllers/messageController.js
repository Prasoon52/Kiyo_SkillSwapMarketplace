const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, text } = req.body;
    
    // Create and save the new message
    const newMessage = new Message({ conversationId, senderId, text });
    await newMessage.save();

    // Identify the receiver to update their unread count
    const conversation = await Conversation.findById(conversationId);
    const receiverId = conversation.participants.find(
      (p) => p.toString() !== senderId.toString()
    );

    // Update the parent conversation's last message and timestamp
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      $inc: { [`unreadCount.${receiverId}`]: 1 }
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};