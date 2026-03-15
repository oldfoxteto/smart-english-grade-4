const fs = require('fs');
const path = require('path');
const request = require('supertest');

const testDbFile = path.join(__dirname, `auth-security-${process.pid}-${Date.now()}.sqlite`);
process.env.DB_FILE = testDbFile;
process.env.JWT_SECRET = 'test-jwt-secret-with-32-plus-characters-12345';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.NODE_ENV = 'test';

const { app, db, server } = require('./server');

function uniqueEmail(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;
}

async function registerUser(prefix = 'security') {
  const email = uniqueEmail(prefix);
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send({
      email,
      password: 'Password123',
      displayName: 'Security Learner',
    });

  return response;
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

test('rejects weak passwords on registration', async () => {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send({
      email: uniqueEmail('weak'),
      password: '12345678',
      displayName: 'Weak Password',
    });

  expect(response.status).toBe(400);
  expect(response.body.error).toBe('WEAK_PASSWORD');
});

test('rotates refresh tokens and blocks reuse of the old token', async () => {
  const registerResponse = await registerUser('rotate');
  expect(registerResponse.status).toBe(201);

  const firstRefreshToken = registerResponse.body.refreshToken;
  const firstRefresh = await request(app)
    .post('/api/v1/auth/refresh')
    .send({ refreshToken: firstRefreshToken });

  expect(firstRefresh.status).toBe(200);
  expect(firstRefresh.body.refreshToken).toBeTruthy();
  expect(firstRefresh.body.refreshToken).not.toBe(firstRefreshToken);

  const replayRefresh = await request(app)
    .post('/api/v1/auth/refresh')
    .send({ refreshToken: firstRefreshToken });

  expect(replayRefresh.status).toBe(401);
  expect(replayRefresh.body.error).toBe('INVALID_REFRESH');
});

test('logout revokes the current refresh token', async () => {
  const registerResponse = await registerUser('logout');
  expect(registerResponse.status).toBe(201);

  const refreshToken = registerResponse.body.refreshToken;
  const logoutResponse = await request(app)
    .post('/api/v1/auth/logout')
    .send({ refreshToken });

  expect(logoutResponse.status).toBe(204);

  const refreshResponse = await request(app)
    .post('/api/v1/auth/refresh')
    .send({ refreshToken });

  expect(refreshResponse.status).toBe(401);
  expect(refreshResponse.body.error).toBe('INVALID_REFRESH');
});

test('refresh token cannot be used as bearer token on protected routes', async () => {
  const registerResponse = await registerUser('token_type');
  expect(registerResponse.status).toBe(201);

  const response = await request(app)
    .get('/api/v1/progress')
    .set('Authorization', `Bearer ${registerResponse.body.refreshToken}`);

  expect(response.status).toBe(401);
  expect(response.body.error).toBe('INVALID_TOKEN_TYPE');
});
