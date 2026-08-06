'use client';

import React from 'react';
import { SubjectId } from '@/types/syllabus';
import { getSubjectColor, getSubjectName } from '@/lib/utils/formatters';

interface SubjectBadgeProps {
  subjectId?: SubjectId;
  customText?: string;
  size?: 'sm' | 'md';
}

export const SubjectBadge: React.FC<SubjectBadgeProps> = ({
  subjectId,
  customText,
  size = 'sm',
}) => {
  const color = getSubjectColor(subjectId);
  const name = customText || getSubjectName(subjectId);

  return (
    <span
      style={{
        backgroundColor: `${color}18`,
        color: color,
        borderColor: `${color}35`,
      }}
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {name}
    </span>
  );
};
