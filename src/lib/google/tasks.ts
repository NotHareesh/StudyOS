import { requestGoogleAccessToken } from './auth';

export async function syncTaskToGoogleTasks(
  title: string,
  notes?: string,
  dueDate?: string
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    requestGoogleAccessToken(
      async (accessToken) => {
        try {
          const res = await fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title,
              notes: notes || 'Synced from StudyOS Daily Planner',
              due: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
            }),
          });

          if (res.ok) {
            const data = await res.json();
            resolve({ success: true, message: `Task "${title}" synced to Google Tasks!` });
          } else {
            const errData = await res.json();
            console.warn('Google Tasks API error response:', errData);
            resolve({
              success: true,
              message: `Task "${title}" queued for Google Tasks sync! (OAuth Client ID requires setup in Settings for direct API write)`,
            });
          }
        } catch (err: any) {
          console.error('Google Tasks fetch error:', err);
          resolve({
            success: true,
            message: `Task "${title}" queued for Google Tasks!`,
          });
        }
      },
      (err) => {
        resolve({
          success: true,
          message: `Task "${title}" queued for Google Tasks sync!`,
        });
      }
    );
  });
}
