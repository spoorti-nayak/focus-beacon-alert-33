
import { MongoClient, Db, ObjectId } from 'mongodb';

class MongoDBConnection {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private uri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/attention-please';

  async connect(): Promise<Db> {
    if (this.db) {
      return this.db;
    }

    try {
      this.client = new MongoClient(this.uri);
      await this.client.connect();
      this.db = this.client.db();
      console.log('Connected to MongoDB');
      return this.db;
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('Disconnected from MongoDB');
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }
}

export const mongoConnection = new MongoDBConnection();

// Focus session data interface
export interface FocusSession {
  _id?: ObjectId | string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  whitelistedApps: string[];
  distractionsBlocked: number;
  duration: number; // in minutes
  focusScore: number;
}

// Custom notification interface
export interface NotificationRecord {
  _id?: ObjectId | string;
  userId: string;
  name: string;
  message: string;
  type: 'text' | 'image' | 'video';
  content?: string;
  active: boolean;
  createdAt: Date;
}

// Health reminder interface
export interface HealthReminderRecord {
  _id?: ObjectId | string;
  userId: string;
  type: 'posture' | 'hydration' | 'eyecare';
  interval: number;
  message: string;
  active: boolean;
  lastTriggered?: Date;
}

// Database operations
export class FocusDataService {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  // Focus Sessions
  async createFocusSession(session: Omit<FocusSession, '_id'>): Promise<string> {
    const result = await this.db.collection('focusSessions').insertOne(session);
    return result.insertedId.toString();
  }

  async updateFocusSession(sessionId: string, updates: Partial<FocusSession>): Promise<void> {
    await this.db.collection('focusSessions').updateOne(
      { _id: new ObjectId(sessionId) },
      { $set: updates }
    );
  }

  async getFocusSessionsByUser(userId: string): Promise<FocusSession[]> {
    const result = await this.db.collection<FocusSession>('focusSessions').find({ userId }).toArray();
    return result;
  }

  // Custom Notifications
  async saveNotification(notification: Omit<NotificationRecord, '_id'>): Promise<string> {
    const result = await this.db.collection('notifications').insertOne(notification);
    return result.insertedId.toString();
  }

  async getNotificationsByUser(userId: string): Promise<NotificationRecord[]> {
    const result = await this.db.collection<NotificationRecord>('notifications').find({ userId }).toArray();
    return result;
  }

  async updateNotification(notificationId: string, updates: Partial<NotificationRecord>): Promise<void> {
    await this.db.collection('notifications').updateOne(
      { _id: new ObjectId(notificationId) },
      { $set: updates }
    );
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await this.db.collection('notifications').deleteOne({ _id: new ObjectId(notificationId) });
  }

  // Health Reminders
  async saveHealthReminder(reminder: Omit<HealthReminderRecord, '_id'>): Promise<string> {
    const result = await this.db.collection('healthReminders').insertOne(reminder);
    return result.insertedId.toString();
  }

  async getHealthRemindersByUser(userId: string): Promise<HealthReminderRecord[]> {
    const result = await this.db.collection<HealthReminderRecord>('healthReminders').find({ userId }).toArray();
    return result;
  }

  async updateHealthReminder(reminderId: string, updates: Partial<HealthReminderRecord>): Promise<void> {
    await this.db.collection('healthReminders').updateOne(
      { _id: new ObjectId(reminderId) },
      { $set: updates }
    );
  }

  async deleteHealthReminder(reminderId: string): Promise<void> {
    await this.db.collection('healthReminders').deleteOne({ _id: new ObjectId(reminderId) });
  }
}
