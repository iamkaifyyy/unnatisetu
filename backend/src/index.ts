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

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    system: 'Ministry of Tribal Affairs - AI Scholarship & Fellowship Management System',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
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
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
