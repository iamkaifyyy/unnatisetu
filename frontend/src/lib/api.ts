const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('mota_token');
  }
  return null;
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mota_token', token);
  }
}

export function getCurrentUserRole(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('mota_role') || 'APPLICANT';
  }
  return 'APPLICANT';
}

export function setCurrentUserRole(role: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mota_role', role);
  }
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'API Error' }));
    throw new Error(errData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  seedLogin: async (role: 'APPLICANT' | 'VERIFIER' | 'STATE_ADMIN' | 'MINISTRY_ADMIN') => {
    const data = await request('/auth/seed-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    if (data.token) {
      setAuthToken(data.token);
      setCurrentUserRole(data.user.role);
    }
    return data;
  },
  login: async (credentials: { email: string; password: string }) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      setAuthToken(data.token);
      setCurrentUserRole(data.user.role);
    }
    return data;
  },
  register: async (userData: any) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      setAuthToken(data.token);
      setCurrentUserRole(data.user.role);
    }
    return data;
  },
  getMe: () => request('/auth/me'),

  // Schemes
  getSchemes: () => request('/schemes'),
  getSchemeById: (id: string) => request(`/schemes/${id}`),
  syncDataset: () => request('/schemes/sync-dataset', { method: 'POST' }),
  saveSchemeConfig: (id: string, config: any) =>
    request(`/schemes/${id}/config`, {
      method: 'POST',
      body: JSON.stringify(config),
    }),
  cloneScheme: (id: string, payload: { newCode: string; newName: string; newDescription?: string }) =>
    request(`/schemes/${id}/clone`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Applications
  getMyApplications: () => request('/applications/my'),
  saveDraftApplication: (payload: { schemeId: string; formData: any; applicationId?: string }) =>
    request('/applications/draft', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  submitApplication: (id: string) =>
    request(`/applications/${id}/submit`, {
      method: 'POST',
    }),
  getApplicationById: (id: string) => request(`/applications/${id}`),
  getPdfDownloadUrl: (id: string) => `${API_BASE_URL}/applications/${id}/pdf`,

  // Documents
  uploadDocument: (payload: { applicationId: string; documentType: string; fileName: string; fileUrl?: string }) =>
    request('/documents/upload', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getDocumentDiff: (id: string) => request(`/documents/${id}/diff`),

  // Verification Queue
  getVerificationQueue: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/verification/queue${query ? `?${query}` : ''}`);
  },
  processVerificationAction: (id: string, payload: { action: string; reason?: string; deficiencyRemarks?: string; deficiencyCategory?: string; deadlineDays?: number }) =>
    request(`/verification/${id}/action`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  processBulkAction: (payload: { applicationIds: string[]; action: string; reason?: string }) =>
    request('/verification/bulk-action', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Deficiency Resolution
  resolveDeficiency: (id: string, payload: { responseNotes?: string; reUploadedDocumentId?: string }) =>
    request(`/deficiencies/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Merit Module
  generateMeritList: (schemeId: string) =>
    request('/merit/generate', {
      method: 'POST',
      body: JSON.stringify({ schemeId }),
    }),
  getMeritList: (schemeId: string) => request(`/merit/${schemeId}`),
  overrideMeritRank: (id: string, payload: { newRank: number; overrideReason: string }) =>
    request(`/merit/${id}/override`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  publishMeritList: (schemeId: string, cutoffRank: number = 50) =>
    request(`/merit/${schemeId}/publish`, {
      method: 'POST',
      body: JSON.stringify({ cutoffRank }),
    }),

  // Analytics
  getFunnelAnalytics: () => request('/analytics/funnel'),
  getTurnaroundAnalytics: () => request('/analytics/turnaround'),
  getRejectionsAnalytics: () => request('/analytics/rejections'),
  getHeatmapAnalytics: () => request('/analytics/heatmap'),
  getBudgetAnalytics: () => request('/analytics/budget'),

  // Audit Logs
  getAuditLogs: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/audit-logs${query ? `?${query}` : ''}`);
  },

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id: string) => request(`/notifications/${id}/read`, { method: 'POST' }),

  // AI-Assisted Features
  verifyDocument: (payload: { documentType: string; fileName?: string; formData?: any; imageBase64?: string; applicationId?: string; documentId?: string }) =>
    request('/documents/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  checkEligibility: (payload: { formData: any; schemeId?: string; schemeCode?: string; documents?: any[] }) =>
    request('/applications/check-eligibility', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  adminQuery: (query: string) =>
    request('/admin/query', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),
};
