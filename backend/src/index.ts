/**
 * National Fellowship & Scholarship Management System
 * Ministry of Tribal Affairs (MoTA), Government of India
 *
 * Core Express API Service & Realtime Event Dispatcher
 */

import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

import authRoutes from './routes/authRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import deficiencyRoutes from './routes/deficiencyRoutes.js';
import meritRoutes from './routes/meritRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.CORS_ORIGIN || 'http://localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// WebSocket event channel for real-time scrutiny updates and applicant notifications
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  socket.on('join_application', (applicationId: string) => {
    socket.join(`app_${applicationId}`);
  });

  socket.on('join_verifier_queue', () => {
    socket.join('verifier_queue');
  });
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

/**
 * Data Leakage Protection Middleware
 * Intercepts outbound JSON responses and strips sensitive authentication tokens or credentials
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  res.json = function (data: any) {
    if (data && typeof data === 'object') {
      const sanitize = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(sanitize);
        } else if (obj !== null && typeof obj === 'object') {
          const cleaned: any = {};
          for (const [key, val] of Object.entries(obj)) {
            if (['password', 'hashedPassword', 'rawAadhaarToken', 'internalSecretKey'].includes(key)) {
              continue;
            }
            cleaned[key] = sanitize(val);
          }
          return cleaned;
        }
        return obj;
      };
      data = sanitize(data);
    }
    return originalJson.call(this, data);
  };
  next();
});

// System Health Check
app.get(['/api/v1/health', '/api/health'], (_req: Request, res: Response) => {
  res.json({
    status: 'UP',
    apiVersion: 'v1.0.0',
    service: 'Ministry of Tribal Affairs - Single Window Scholarship Portal',
    timestamp: new Date().toISOString(),
  });
});

// API Routes (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/schemes', schemeRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/verification', verificationRoutes);
app.use('/api/v1/deficiencies', deficiencyRoutes);
app.use('/api/v1/merit', meritRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/audit-logs', auditRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Legacy route compatibility mapping
app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/deficiencies', deficiencyRoutes);
app.use('/api/merit', meritRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`[MoTA Portal Service] Server initialized on port ${PORT}`);
  console.log(`[MoTA Portal Service] API Base URL: http://localhost:${PORT}/api/v1`);
});

