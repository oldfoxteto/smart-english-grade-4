const fs = require('fs');
const path = require('path');
const request = require('supertest');

const testDbFile = path.join(__dirname, `ai-translate-${process.pid}-${Date.now()}.sqlite`);
process.env.DB_FILE = testDbFile;
process.env.JWT_SECRET = 'test-jwt-secret-with-32-plus-characters-12345';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.NODE_ENV = 'test';

const { app, db, server } = require('./server');

function uniqueEmail(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;
}

afterAll((done) => {
  const closeServer = server.listening
    ? (callback) => server.close(callback)
    : (callback) => callback();

  closeServer(() => {
    db.close(() => {
      if (fs.existsSync(testDbFile)) {
        fs.unlinkSync(testDbFile);
      }
      done();
    });
  });
});

test('translate endpoint returns structured data through the backend', async () => {
  const agent = request.agent(app);
  const registerResponse = await agent
    .post('/api/v1/auth/register')
    .send({
      email: uniqueEmail('translate'),
      password: 'Password123',
      displayName: 'Translate Learner',
    });

  expect(registerResponse.status).toBe(201);

  const translateResponse = await agent
    .post('/api/v1/ai/translate')
    .send({ text: 'I am learning English today.' });

  expect(translateResponse.status).toBe(200);
  expect(typeof translateResponse.body.translation).toBe('string');
  expect(translateResponse.body.translation.length).toBeGreaterThan(0);
  expect(typeof translateResponse.body.explanation).toBe('string');
  expect(translateResponse.body.explanation.length).toBeGreaterThan(0);
});
