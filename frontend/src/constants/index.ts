import { JobStatus } from '../types/Job';

export const JOB_STATUSES: JobStatus[] = ['Intake', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

export const TRUNCATE_STYLES = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical' as const,
  overflow: 'hidden',
};

export const CARD_HOVER_STYLES = {
  boxShadow: 3,
  '& .action-buttons': {
    opacity: 1,
  }
};
