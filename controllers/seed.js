// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kiyo_marketplace';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to DB. Creating dummy conversation...');

    // Generate valid MongoDB ObjectIDs
    const user1 = new mongoose.Types.ObjectId();
    const user2 = new mongoose.Types.ObjectId();
    const mockSwapRequestId = new mongoose.Types.ObjectId();

    // Create a new conversation
    const mockConversation = new Conversation({
      participants: [user1, user2],
      swapRequestId: mockSwapRequestId
    });

    const savedConv = await mockConversation.save();

    console.log(`\n✅ Success! Conversation created in MongoDB.\n`);
    console.log(`Copy and paste this exact command into your terminal:\n`);
    
    console.log(`curl -X POST http://localhost:5001/api/messages \\`);
    console.log(`-H "Content-Type: application/json" \\`);
    console.log(`-d '{"conversationId": "${savedConv._id}", "senderId": "${user1}", "text": "This is a real message!"}'\n`);

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });