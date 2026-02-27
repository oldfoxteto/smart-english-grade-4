const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Initialize Express app
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));

app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5174",
  credentials: true
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'طلبات كثيرة جداً. يرجى المحاولة لاحقاً'
  }
});
app.use('/api/', limiter);

// Static files
app.use('/uploads', express.static('uploads'));

// In-memory database (for demo purposes)
const users = [];
const lessons = [];
const exercises = [];
const progress = [];
const achievements = [];

// Utility functions
const generateId = () => Math.random().toString(36).substr(2, 9);
const createResponse = (success, data, message = '') => ({
  success,
  data,
  message,
  timestamp: new Date().toISOString()
});

// Mock data
const createMockData = () => {
  // Mock user
  const mockUser = {
    id: generateId(),
    username: 'student1',
    email: 'student@example.com',
    role: 'student',
    firstName: 'أحمد',
    lastName: 'محمد',
    profile: {
      bio: 'طالب في الصف الرابع',
      grade: '4'
    },
    preferences: {
      language: 'ar',
      theme: 'light',
      notifications: true
    },
    createdAt: new Date().toISOString()
  };
  users.push(mockUser);

  // Mock lessons
  const mockLessons = [
    {
      id: generateId(),
      title: 'الدرس الأول: التحيات',
      description: 'تعلم كيفية التحية باللغة الإنجليزية',
      grade: '4',
      subject: 'english',
      difficulty: 'easy',
      status: 'published',
      content: {
        vocabulary: ['hello', 'good morning', 'good evening', 'good night'],
        phrases: ['How are you?', 'I am fine', 'Thank you'],
        exercises: ['match-words', 'fill-blanks', 'pronunciation']
      },
      createdAt: new Date().toISOString()
    },
    {
      id: generateId(),
      title: 'الدرس الثاني: الأرقام',
      description: 'تعلم الأرقام من 1 إلى 10',
      grade: '4',
      subject: 'english',
      difficulty: 'easy',
      status: 'published',
      content: {
        vocabulary: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
        phrases: ['I have one book', 'There are three apples'],
        exercises: ['counting', 'matching', 'writing']
      },
      createdAt: new Date().toISOString()
    }
  ];
  lessons.push(...mockLessons);

  // Mock exercises
  const mockExercises = [
    {
      id: generateId(),
      lessonId: mockLessons[0].id,
      title: 'مطابقة الكلمات',
      type: 'matching',
      difficulty: 'easy',
      questions: [
        {
          id: generateId(),
          question: 'مرحباً',
          options: ['hello', 'goodbye', 'thank you'],
          correctAnswer: 'hello'
        },
        {
          id: generateId(),
          question: 'صباح الخير',
          options: ['good night', 'good morning', 'good evening'],
          correctAnswer: 'good morning'
        }
      ],
      createdAt: new Date().toISOString()
    }
  ];
  exercises.push(...mockExercises);
};

// Initialize mock data
createMockData();

// Routes
app.get('/api/health', (req, res) => {
  res.json(createResponse(true, { 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }));
});

app.get('/api/version', (req, res) => {
  res.json(createResponse(true, { version: '1.0.0' }));
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication
  const user = users.find(u => u.email === email);
  if (user && password === 'password') {
    const token = 'mock-jwt-token-' + generateId();
    const refreshToken = 'mock-refresh-token-' + generateId();
    
    res.json(createResponse(true, {
      user,
      token,
      refreshToken,
      expiresIn: 3600
    }, 'تم تسجيل الدخول بنجاح'));
  } else {
    res.status(401).json(createResponse(false, null, 'البريد الإلكتروني أو كلمة المرور غير صحيحة'));
  }
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json(createResponse(false, null, 'البريد الإلكتروني مسجل بالفعل'));
  }
  
  const newUser = {
    id: generateId(),
    username,
    email,
    role: 'student',
    firstName,
    lastName,
    profile: {
      bio: '',
      grade: '4'
    },
    preferences: {
      language: 'ar',
      theme: 'light',
      notifications: true
    },
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  const token = 'mock-jwt-token-' + generateId();
  const refreshToken = 'mock-refresh-token-' + generateId();
  
  res.json(createResponse(true, {
    user: newUser,
    token,
    refreshToken,
    expiresIn: 3600
  }, 'تم إنشاء الحساب بنجاح'));
});

app.get('/api/auth/profile', (req, res) => {
  // Mock user profile
  const user = users[0]; // Return first user for demo
  res.json(createResponse(true, user));
});

app.post('/api/auth/logout', (req, res) => {
  res.json(createResponse(true, null, 'تم تسجيل الخروج بنجاح'));
});

// Lessons routes
app.get('/api/lessons', (req, res) => {
  const { grade, subject } = req.query;
  let filteredLessons = lessons;
  
  if (grade) {
    filteredLessons = filteredLessons.filter(l => l.grade === grade);
  }
  if (subject) {
    filteredLessons = filteredLessons.filter(l => l.subject === subject);
  }
  
  res.json(createResponse(true, filteredLessons));
});

app.get('/api/lessons/:id', (req, res) => {
  const lesson = lessons.find(l => l.id === req.params.id);
  if (lesson) {
    res.json(createResponse(true, lesson));
  } else {
    res.status(404).json(createResponse(false, null, 'الدرس غير موجود'));
  }
});

// Exercises routes
app.get('/api/exercises', (req, res) => {
  const { lessonId, type } = req.query;
  let filteredExercises = exercises;
  
  if (lessonId) {
    filteredExercises = filteredExercises.filter(e => e.lessonId === lessonId);
  }
  if (type) {
    filteredExercises = filteredExercises.filter(e => e.type === type);
  }
  
  res.json(createResponse(true, filteredExercises));
});

app.get('/api/exercises/:id', (req, res) => {
  const exercise = exercises.find(e => e.id === req.params.id);
  if (exercise) {
    res.json(createResponse(true, exercise));
  } else {
    res.status(404).json(createResponse(false, null, 'التمرين غير موجود'));
  }
});

app.post('/api/exercises/:id/submit', (req, res) => {
  const { answers } = req.body;
  const exercise = exercises.find(e => e.id === req.params.id);
  
  if (!exercise) {
    return res.status(404).json(createResponse(false, null, 'التمرين غير موجود'));
  }
  
  // Calculate score
  let correct = 0;
  const results = exercise.questions.map((question, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer === question.correctAnswer;
    if (isCorrect) correct++;
    
    return {
      questionId: question.id,
      userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect
    };
  });
  
  const score = Math.round((correct / exercise.questions.length) * 100);
  
  const result = {
    exerciseId: exercise.id,
    score,
    totalQuestions: exercise.questions.length,
    correctAnswers: correct,
    results,
    completedAt: new Date().toISOString()
  };
  
  res.json(createResponse(true, result, 'تم إرسال الإجابات بنجاح'));
});

// Progress routes
app.get('/api/progress/student/:id', (req, res) => {
  const studentProgress = [
    {
      id: generateId(),
      studentId: req.params.id,
      lessonId: lessons[0].id,
      score: 85,
      completedAt: new Date().toISOString(),
      timeSpent: 1200 // seconds
    },
    {
      id: generateId(),
      studentId: req.params.id,
      lessonId: lessons[1].id,
      score: 92,
      completedAt: new Date().toISOString(),
      timeSpent: 900 // seconds
    }
  ];
  
  res.json(createResponse(true, studentProgress));
});

// Analytics routes
app.get('/api/analytics/dashboard', (req, res) => {
  const analytics = {
    totalStudents: users.length,
    totalLessons: lessons.length,
    totalExercises: exercises.length,
    averageProgress: 88.5,
    engagementRate: 92.3,
    completionRate: 85.7,
    timeSpentToday: 2400, // seconds
    activeUsers: 15
  };
  
  res.json(createResponse(true, analytics));
});

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);
  
  // Join room
  socket.on('join_room', (data) => {
    socket.join(data.roomId);
    console.log(`📥 User ${socket.id} joined room ${data.roomId}`);
    socket.emit('room_joined', { roomId: data.roomId });
  });
  
  // Leave room
  socket.on('leave_room', (data) => {
    socket.leave(data.roomId);
    console.log(`📤 User ${socket.id} left room ${data.roomId}`);
    socket.emit('room_left', { roomId: data.roomId });
  });
  
  // Send message
  socket.on('send_message', (data) => {
    const message = {
      id: generateId(),
      userId: data.userId,
      username: data.username,
      message: data.message,
      timestamp: Date.now(),
      roomId: data.roomId
    };
    
    io.to(data.roomId).emit('new_message', message);
  });
  
  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('user_typing', {
      userId: data.userId,
      username: data.username,
      roomId: data.roomId,
      isTyping: data.isTyping
    });
  });
  
  // User status
  socket.on('update_status', (data) => {
    socket.broadcast.emit('user_status_changed', {
      userId: socket.id,
      ...data
    });
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json(createResponse(false, null, 'حدث خطأ في الخادم'));
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json(createResponse(false, null, 'المورد غير موجود'));
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}/api`);
  console.log(`🔌 Socket.IO server ready`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5174'}`);
});

module.exports = { app, server, io };
