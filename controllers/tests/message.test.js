const request = require('supertest');
const app = require('../../../server'); // Point this to your main Express app file
const mongoose = require('mongoose');
const Conversation = require('../../models/Conversation');

describe('Messaging System API Endpoints', () => {
  let conversationId;
  let senderId;

  beforeAll(async () => {
    // Connect to test DB
await mongoose.connect(process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/kiyo_test');
    
    senderId = new mongoose.Types.ObjectId();
    
    // Seed a mock conversation
    const mockConversation = new Conversation({
      participants: [senderId, new mongoose.Types.ObjectId()],
      swapRequestId: new mongoose.Types.ObjectId()
    });
    const savedConv = await mockConversation.save();
    conversationId = savedConv._id;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should save a new message and return 201', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({
        conversationId: conversationId,
        senderId: senderId,
        text: 'I can teach you UI design if you help with my code!'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('text', 'I can teach you UI design if you help with my code!');
  });

  it('should fetch message history for a conversation', async () => {
    const res = await request(app).get(`/api/messages/${conversationId}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });
});