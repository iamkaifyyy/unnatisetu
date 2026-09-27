import dns from 'dns';
import { PrismaClient } from '@prisma/client';

// Configure DNS servers for MongoDB Atlas SRV lookup on macOS
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Fallback if DNS server override is restricted
}

export const prisma = new PrismaClient();
