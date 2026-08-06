'use client';

import { GOOGLE_CONFIG } from './config';

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

  if (window.google?.accounts?.oauth2) {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CONFIG.clientId,
        scope: GOOGLE_CONFIG.scopes,
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
    // Fallback: prompt for access token
    const token = prompt('Google Identity Services SDK loading. Enter your Google OAuth Access Token if testing:');
    if (token) {
      storeAccessToken(token);
      onSuccess(token);
    } else if (onError) {
      onError('Google SDK not ready');
    }
  }
}
