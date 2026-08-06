import { SubjectId } from '@/types/syllabus';

export function formatSecondsToHHMM(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export function formatMinutesToHHMM(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
}

export function getTodayDateString(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });
}

export function getSubjectColor(subjectId?: SubjectId): string {
  switch (subjectId) {
    case 'physics':
      return '#a855f7'; // Purple
    case 'chemistry':
      return '#10b981'; // Emerald
    case 'maths':
      return '#3b82f6'; // Blue
    default:
      return '#6366f1'; // Indigo
  }
}

export function getSubjectName(subjectId?: SubjectId): string {
  switch (subjectId) {
    case 'physics':
      return 'Physics';
    case 'chemistry':
      return 'Chemistry';
    case 'maths':
      return 'Mathematics';
    default:
      return 'General';
  }
}
