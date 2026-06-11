const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  swapRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest', required: true },
  lastMessage: { type: String },
  unreadCount: { type: Map, of: Number, default: {} } 
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);