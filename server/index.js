
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mongoConnection, FocusDataService } from '../src/utils/mongodb.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize MongoDB connection
let focusDataService;

async function initializeDatabase() {
  try {
    const db = await mongoConnection.connect();
    focusDataService = new FocusDataService(db);
    console.log('Database connected and service initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

// API Routes

// Focus Sessions
app.post('/api/focus-sessions', async (req, res) => {
  try {
    const sessionId = await focusDataService.createFocusSession(req.body);
    res.status(201).json({ success: true, sessionId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/focus-sessions/:userId', async (req, res) => {
  try {
    const sessions = await focusDataService.getFocusSessionsByUser(req.params.userId);
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/focus-sessions/:sessionId', async (req, res) => {
  try {
    await focusDataService.updateFocusSession(req.params.sessionId, req.body);
    res.json({ success: true, message: 'Focus session updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Custom Notifications
app.post('/api/notifications', async (req, res) => {
  try {
    const notificationId = await focusDataService.saveNotification(req.body);
    res.status(201).json({ success: true, notificationId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const notifications = await focusDataService.getNotificationsByUser(req.params.userId);
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/notifications/:notificationId', async (req, res) => {
  try {
    await focusDataService.updateNotification(req.params.notificationId, req.body);
    res.json({ success: true, message: 'Notification updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/notifications/:notificationId', async (req, res) => {
  try {
    await focusDataService.deleteNotification(req.params.notificationId);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health Reminders
app.post('/api/health-reminders', async (req, res) => {
  try {
    const reminderId = await focusDataService.saveHealthReminder(req.body);
    res.status(201).json({ success: true, reminderId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/health-reminders/:userId', async (req, res) => {
  try {
    const reminders = await focusDataService.getHealthRemindersByUser(req.params.userId);
    res.json({ success: true, reminders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/health-reminders/:reminderId', async (req, res) => {
  try {
    await focusDataService.updateHealthReminder(req.params.reminderId, req.body);
    res.json({ success: true, message: 'Health reminder updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/health-reminders/:reminderId', async (req, res) => {
  try {
    await focusDataService.deleteHealthReminder(req.params.reminderId);
    res.json({ success: true, message: 'Health reminder deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
async function startServer() {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing server...');
  await mongoConnection.disconnect();
  process.exit(0);
});

startServer().catch(console.error);
