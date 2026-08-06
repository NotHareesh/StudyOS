export const GOOGLE_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'demo-google-client-id.apps.googleusercontent.com',
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GEMINI_API_KEY || '',
  scopes: [
    'https://www.googleapis.com/auth/tasks',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/drive.file',
  ].join(' '),
};

export interface GoogleIntegrationStatus {
  isTasksConnected: boolean;
  isCalendarConnected: boolean;
  isDriveConnected: boolean;
  lastSyncedAt?: string;
}

const STORAGE_KEY = 'studyos_google_status';

export function getGoogleStatus(): GoogleIntegrationStatus {
  if (typeof window === 'undefined') return { isTasksConnected: false, isCalendarConnected: false, isDriveConnected: false };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load Google status:', e);
  }
  return { isTasksConnected: true, isCalendarConnected: true, isDriveConnected: true, lastSyncedAt: new Date().toLocaleTimeString() };
}

export function saveGoogleStatus(status: GoogleIntegrationStatus) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
  } catch (e) {
    console.error('Failed to save Google status:', e);
  }
}
