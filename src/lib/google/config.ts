export function getGoogleClientId(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('studyos_google_client_id');
    if (saved && saved.trim()) return saved.trim();
  }
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
}

export function setGoogleClientId(id: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('studyos_google_client_id', id.trim());
  }
}

export const GOOGLE_CONFIG = {
  get clientId() {
    return getGoogleClientId();
  },
  scopes: [
    'https://www.googleapis.com/auth/tasks',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/drive.file',
  ].join(' '),
};
