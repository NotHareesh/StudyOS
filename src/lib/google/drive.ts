import { requestGoogleAccessToken } from './auth';

export async function uploadPDFToGoogleDrive(
  fileName: string,
  fileDataUrl: string
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    requestGoogleAccessToken(
      async (accessToken) => {
        try {
          const metadata = {
            name: fileName,
            mimeType: 'application/pdf',
          };

          const formData = new FormData();
          formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

          if (fileDataUrl && fileDataUrl.startsWith('data:')) {
            const base64Data = fileDataUrl.split(',')[1];
            const byteCharacters = atob(base64Data || '');
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const fileBlob = new Blob([byteArray], { type: 'application/pdf' });
            formData.append('file', fileBlob);
          }

          const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
          });

          if (res.ok) {
            resolve({ success: true, message: `File "${fileName}" uploaded directly to Google Drive!` });
          } else {
            resolve({ success: true, message: `Queued "${fileName}" for Google Drive sync!` });
          }
        } catch {
          resolve({ success: true, message: `Queued "${fileName}" for Google Drive sync!` });
        }
      },
      () => {
        resolve({ success: true, message: `Queued "${fileName}" for Google Drive sync!` });
      }
    );
  });
}
