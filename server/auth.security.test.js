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

function findCookie(setCookieHeaders, cookieName) {
  return (setCookieHeaders || []).find((entry) => String(entry).startsWith(`${cookieName}=`));
}

async function registerUser(prefix = 'security') {
  const agent = request.agent(app);
  const email = uniqueEmail(prefix);
  const response = await agent
    .post('/api/v1/auth/register')
    .send({
      email,
      password: 'Password123',
      displayName: 'Security Learner',
    });

  return { agent, response };
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

test('blocks untrusted origins on state-changing requests', async () => {
  const response = await request(app)
    .post('/api/v1/auth/login')
    .set('Origin', 'https://evil.example.com')
    .send({
      email: uniqueEmail('origin'),
      password: 'Password123',
    });

  expect(response.status).toBe(403);
  expect(response.body.error).toBe('UNTRUSTED_ORIGIN');
});

test('rotates refresh cookies and blocks reuse of the old cookie', async () => {
  const { agent, response } = await registerUser('rotate');
  expect(response.status).toBe(201);
  expect(response.body.token).toBeDefined();
  expect(response.body.refreshToken).toBeUndefined();

  const firstRefreshCookie = findCookie(response.headers['set-cookie'], 'lisan_refresh');
  expect(firstRefreshCookie).toBeTruthy();

  const firstRefresh = await agent.post('/api/v1/auth/refresh').send({});
  expect(firstRefresh.status).toBe(200);
  const rotatedRefreshCookie = findCookie(firstRefresh.headers['set-cookie'], 'lisan_refresh');
  expect(rotatedRefreshCookie).toBeTruthy();
  expect(rotatedRefreshCookie).not.toBe(firstRefreshCookie);

  const replayRefresh = await request(app)
    .post('/api/v1/auth/refresh')
    .set('Cookie', firstRefreshCookie);

  expect(replayRefresh.status).toBe(401);
  expect(replayRefresh.body.error).toBe('INVALID_REFRESH');
});

test('logout revokes the current refresh cookie', async () => {
  const { agent, response } = await registerUser('logout');
  expect(response.status).toBe(201);

  const refreshCookie = findCookie(response.headers['set-cookie'], 'lisan_refresh');
  expect(refreshCookie).toBeTruthy();

  const logoutResponse = await agent.post('/api/v1/auth/logout').send({});
  expect(logoutResponse.status).toBe(204);

  const refreshResponse = await request(app)
    .post('/api/v1/auth/refresh')
    .set('Cookie', refreshCookie);

  expect(refreshResponse.status).toBe(401);
  expect(refreshResponse.body.error).toBe('INVALID_REFRESH');
});

test('refresh cookie cannot be used as bearer token on protected routes', async () => {
  const { response } = await registerUser('token_type');
  expect(response.status).toBe(201);

  const refreshCookie = findCookie(response.headers['set-cookie'], 'lisan_refresh');
  const refreshToken = String(refreshCookie).split(';')[0].split('=')[1];

  const protectedResponse = await request(app)
    .get('/api/v1/progress')
    .set('Authorization', `Bearer ${refreshToken}`);

  expect(protectedResponse.status).toBe(401);
  expect(protectedResponse.body.error).toBe('INVALID_TOKEN_TYPE');
});

test('session endpoint restores user from access cookie without exposing tokens', async () => {
  const { agent, response } = await registerUser('session');
  expect(response.status).toBe(201);
  expect(response.body.token).toBeDefined();
  expect(response.body.refreshToken).toBeUndefined();

  const sessionResponse = await agent.get('/api/v1/auth/session');
  expect(sessionResponse.status).toBe(200);
  expect(sessionResponse.body.user.email).toMatch(/@example\.com$/);
  expect(sessionResponse.body.token).toBeUndefined();
});

test('security headers are present on API responses', async () => {
  const response = await request(app).get('/api/v1/safety/policy');

  expect(response.headers['x-frame-options']).toBeDefined();
  expect(response.headers['x-content-type-options']).toBe('nosniff');
  expect(response.headers['referrer-policy']).toBe('no-referrer');
  expect(response.headers['content-security-policy']).toContain("default-src 'self'");
});
