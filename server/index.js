
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mongoConnection, FocusDataService } from '../src/utils/mongodb.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize MongoDB connection
let focusDataService;
let isDbConnected = false;

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    const db = await mongoConnection.connect();
    focusDataService = new FocusDataService(db);
    isDbConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    // Don't exit, let the app run without DB for development
    isDbConnected = false;
  }
}

// Middleware to check DB connection
const requireDB = (req, res, next) => {
  if (!isDbConnected) {
    return res.status(503).json({ 
      success: false, 
      error: 'Database not connected. Please check your MongoDB connection.' 
    });
  }
  next();
};

// Health check endpoint (works without DB)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: isDbConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'MERN Stack API is working!',
    database: isDbConnected ? 'Connected' : 'Disconnected'
  });
});

// Focus Sessions API
app.post('/api/focus-sessions', requireDB, async (req, res) => {
  try {
    const sessionId = await focusDataService.createFocusSession(req.body);
    res.status(201).json({ success: true, sessionId });
  } catch (error) {
    console.error('Error creating focus session:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/focus-sessions/:userId', requireDB, async (req, res) => {
  try {
    const sessions = await focusDataService.getFocusSessionsByUser(req.params.userId);
    res.json({ success: true, sessions });
  } catch (error) {
    console.error('Error getting focus sessions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/focus-sessions/:sessionId', requireDB, async (req, res) => {
  try {
    await focusDataService.updateFocusSession(req.params.sessionId, req.body);
    res.json({ success: true, message: 'Focus session updated' });
  } catch (error) {
    console.error('Error updating focus session:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Notifications API
app.post('/api/notifications', requireDB, async (req, res) => {
  try {
    const notificationId = await focusDataService.saveNotification(req.body);
    res.status(201).json({ success: true, notificationId });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/notifications/:userId', requireDB, async (req, res) => {
  try {
    const notifications = await focusDataService.getNotificationsByUser(req.params.userId);
    res.json({ success: true, notifications });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health Reminders API
app.post('/api/health-reminders', requireDB, async (req, res) => {
  try {
    const reminderId = await focusDataService.saveHealthReminder(req.body);
    res.status(201).json({ success: true, reminderId });
  } catch (error) {
    console.error('Error creating health reminder:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/health-reminders/:userId', requireDB, async (req, res) => {
  try {
    const reminders = await focusDataService.getHealthRemindersByUser(req.params.userId);
    res.json({ success: true, reminders });
  } catch (error) {
    console.error('Error getting health reminders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Start server
async function startServer() {
  // Initialize database connection
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 MERN Server running on port ${PORT}`);
    console.log(`📱 API Base URL: http://localhost:${PORT}`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
    
    if (!isDbConnected) {
      console.log('⚠️  Server running without database connection');
      console.log('📝 Add MONGODB_URI to your .env file to connect to MongoDB');
    }
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down server...');
  if (isDbConnected) {
    await mongoConnection.disconnect();
    console.log('📦 Database connection closed');
  }
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

startServer().catch(console.error);
