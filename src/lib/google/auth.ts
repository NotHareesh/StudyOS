'use client';

import { getGoogleClientId } from './config';

declare global {
  interface Window {
    google?: any;
  }
}

const TOKEN_KEY = 'studyos_google_access_token';

export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function storeAccessToken(token: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function requestGoogleAccessToken(
  onSuccess: (token: string) => void,
  onError?: (err: any) => void
) {
  if (typeof window === 'undefined') return;

  const existingToken = getStoredAccessToken();
  if (existingToken) {
    onSuccess(existingToken);
    return;
  }

  const clientId = getGoogleClientId();
  if (!clientId || clientId === 'demo-google-client-id.apps.googleusercontent.com') {
    alert('To connect your live Google account, please enter your Google OAuth Client ID in Settings (or .env.local as NEXT_PUBLIC_GOOGLE_CLIENT_ID).');
    if (onError) onError('Google Client ID not configured');
    return;
  }

  if (window.google?.accounts?.oauth2) {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/drive.file',
        callback: (response: any) => {
          if (response.access_token) {
            storeAccessToken(response.access_token);
            onSuccess(response.access_token);
          } else {
            console.error('Google OAuth token error:', response);
            if (onError) onError(response);
          }
        },
      });
      client.requestAccessToken();
    } catch (e) {
      console.error('Failed to init google token client:', e);
      if (onError) onError(e);
    }
  } else {
    alert('Google Identity SDK initializing. Try again in a moment or verify internet connection.');
    if (onError) onError('SDK not ready');
  }
}
