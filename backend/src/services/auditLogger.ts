import { prisma } from './db.js';

export type Role = 'APPLICANT' | 'VERIFIER' | 'STATE_ADMIN' | 'MINISTRY_ADMIN' | string;

export interface LogAuditParams {
  applicationId: string;
  actorId: string;
  actorRole: Role;
  action: string;
  reason?: string;
  previousState?: string;
  newState?: string;
  metadata?: Record<string, any>;
}

export class AuditLogger {
  public static async log(params: LogAuditParams) {
    try {
      await prisma.auditLog.create({
        data: {
          applicationId: params.applicationId,
          actorId: params.actorId,
          actorRole: params.actorRole,
          action: params.action,
          reason: params.reason || null,
          previousState: params.previousState || null,
          newState: params.newState || null,
          metadataJson: params.metadata ? JSON.stringify(params.metadata) : null,
        },
      });
    } catch (error) {
      console.error('AuditLogger error:', error);
    }
  }
}
