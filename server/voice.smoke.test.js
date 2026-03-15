const fs = require('fs');
const path = require('path');
const request = require('supertest');
const { io: ioClient } = require('socket.io-client');

const testDbFile = path.join(__dirname, `voice-smoke-${process.pid}-${Date.now()}.sqlite`);
process.env.DB_FILE = testDbFile;
process.env.JWT_SECRET = 'voice-smoke-jwt-secret-with-32-plus-characters-12345';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.NODE_ENV = 'test';
delete process.env.OPENAI_API_KEY;

const { app, db, server } = require('./server');

function uniqueEmail(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;
}

function waitForEvent(socket, eventName, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for ${eventName}`));
    }, timeoutMs);

    const cleanup = () => {
      clearTimeout(timeout);
      socket.off(eventName, handleEvent);
    };

    const handleEvent = (payload) => {
      cleanup();
      resolve(payload);
    };

    socket.once(eventName, handleEvent);
  });
}

async function registerAgent(prefix = 'voice') {
  const agent = request.agent(app);
  const response = await agent.post('/api/v1/auth/register').send({
    email: uniqueEmail(prefix),
    password: 'Password123',
    displayName: 'Voice Smoke User',
  });

  return { agent, response };
}

beforeAll((done) => {
  if (server.listening) {
    done();
    return;
  }
  server.listen(0, done);
});

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

test('voice socket joins, responds, and falls back without upstream AI', async () => {
  const { response } = await registerAgent('voice_socket');
  expect(response.status).toBe(201);

  const cookies = response.headers['set-cookie'];
  expect(cookies).toBeDefined();

  const address = server.address();
  const socket = ioClient(`http://127.0.0.1:${address.port}`, {
    path: '/socket.io',
    transports: ['websocket'],
    extraHeaders: {
      Cookie: cookies.map((entry) => entry.split(';')[0]).join('; '),
    },
  });

  await waitForEvent(socket, 'connect');

  socket.emit('voice:join', 'smoke-room');
  const joinedStatus = await waitForEvent(socket, 'voice:status');
  expect(joinedStatus.joined).toBe(true);
  expect(joinedStatus.roomId).toBe('smoke-room');

  socket.emit('voice:ping', { ts: 12345 });
  const pong = await waitForEvent(socket, 'voice:pong');
  expect(pong.ts).toBe(12345);

  socket.emit('voice:frame', { roomId: 'smoke-room', frame: '' });
  const invalidFrameError = await waitForEvent(socket, 'voice:error');
  expect(invalidFrameError.code).toBe('INVALID_FRAME');

  socket.emit('voice:frame', { roomId: 'smoke-room', frame: Buffer.from('test-audio').toString('base64') });
  const transcript = await waitForEvent(socket, 'voice:transcript');
  expect(String(transcript.text || '')).toContain('mock STT');

  socket.disconnect();
});
