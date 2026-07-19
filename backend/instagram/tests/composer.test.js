const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const ComposerPost = require('../models/composerPostModel');

jest.setTimeout(30000);

describe('Composer API', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    await ComposerPost.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  test('POST /api/composer-posts creates an instagram composer post', async () => {
    const response = await request(app)
      .post('/api/composer-posts')
      .field('platform', 'instagram')
      .field('title', 'Launch post')
      .field('description', 'Launching the new composer')
      .field('status', 'scheduled')
      .field('scheduleAt', '2026-07-15T10:00:00.000Z')
      .attach('media', Buffer.from('media'), 'media.txt');

    expect(response.status).toBe(201);
    expect(response.body.platform).toBe('instagram');
    expect(response.body.title).toBe('Launch post');
    expect(response.body.mediaUrl).toContain('/public/uploads/');
  });

  test('GET /api/composer-posts returns saved posts', async () => {
    await ComposerPost.create({
      platform: 'twitter',
      title: 'Tweet draft',
      description: 'Draft for twitter',
      status: 'draft',
    });

    const response = await request(app).get('/api/composer-posts');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].platform).toBe('twitter');
  });

  test('PUT /api/composer-posts/:id updates a composer post', async () => {
    const post = await ComposerPost.create({
      platform: 'reddit',
      title: 'Reddit title',
      description: 'Reddit body',
    });

    const response = await request(app)
      .put(`/api/composer-posts/${post._id}`)
      .field('platform', 'instagram')
      .field('title', 'Updated title')
      .field('description', 'Updated body')
      .field('status', 'posted');

    expect(response.status).toBe(200);
    expect(response.body.platform).toBe('instagram');
    expect(response.body.title).toBe('Updated title');
  });

  test('DELETE /api/composer-posts/:id removes a composer post', async () => {
    const post = await ComposerPost.create({
      platform: 'instagram',
      title: 'Delete me',
      description: 'Delete composer post',
    });

    const response = await request(app).delete(`/api/composer-posts/${post._id}`);

    expect(response.status).toBe(204);
    const remaining = await ComposerPost.findById(post._id);
    expect(remaining).toBeNull();
  });
});