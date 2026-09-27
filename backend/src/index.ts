import express from 'express';
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

// Socket.io Setup for Realtime Queue updates & Applicant status pushes
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`⚡ [Socket.io] Client connected: ${socket.id}`);

  socket.on('join_application', (applicationId: string) => {
    socket.join(`app_${applicationId}`);
  });

  socket.on('join_verifier_queue', () => {
    socket.join('verifier_queue');
  });

  socket.on('disconnect', () => {
    console.log(`⚡ [Socket.io] Client disconnected: ${socket.id}`);
  });
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Security Middleware: Prevent Data Leakage in Network Responses
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (data: any) {
    if (data && typeof data === 'object') {
      const sanitize = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(sanitize);
        } else if (obj !== null && typeof obj === 'object') {
          const cleaned: any = {};
          for (const [key, val] of Object.entries(obj)) {
            // Strip password and private token fields from network payloads
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

// Health Check API v1
app.get(['/api/v1/health', '/api/health'], (req, res) => {
  res.json({
    status: 'HEALTHY',
    version: 'v1.0.0',
    system: 'Ministry of Tribal Affairs - AI Scholarship & Fellowship Management System',
    timestamp: new Date().toISOString(),
  });
});

// Version 1 API Routes (/api/v1/*)
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

// Legacy API Aliasing for Backward Compatibility
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
  console.log(`=======================================================`);
  console.log(`🚀 MoTA Scholarship Management System Backend Server`);
  console.log(`📡 API v1 Endpoint: http://localhost:${PORT}/api/v1`);
  console.log(`🔒 Network Data Leakage Protection Active`);
  console.log(`=======================================================`);
});
