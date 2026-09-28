import { prisma } from './db.js';

export interface NotificationPayload {
  userId: string;
  type: 'DEFICIENCY_RAISED' | 'STATUS_UPDATE' | 'MERIT_SELECTION' | 'APPLICATION_SUBMITTED';
  title: string;
  message: string;
  channel?: 'IN_APP' | 'EMAIL' | 'SMS';
  recipientPhone?: string;
  recipientEmail?: string;
}

/**
 * Notification Dispatcher Stub
 * Handles in-app notifications and simulates SMS / Email dispatch logging for audit.
 */
export async function sendNotificationStub(payload: NotificationPayload) {
  const { userId, type, title, message, channel = 'IN_APP', recipientPhone, recipientEmail } = payload;

  try {
    // 1. Create In-App Notification in DB
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        channel,
        isRead: false,
      },
    });

    // 2. Console notification dispatch stub for SMS & Email
    console.log(`[NOTIFICATION STUB] ${channel} dispatched to user ${userId}:`);
    console.log(`  -> Title: ${title}`);
    console.log(`  -> Message: ${message}`);
    if (recipientPhone) console.log(`  -> SMS Gateway Dest: ${recipientPhone}`);
    if (recipientEmail) console.log(`  -> Email Gateway Dest: ${recipientEmail}`);

    return notification;
  } catch (err) {
    console.error('[NOTIFICATION STUB] Failed to record notification:', err);
    return null;
  }
}
