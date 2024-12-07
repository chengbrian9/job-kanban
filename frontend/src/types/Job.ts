export type JobStatus = 'Intake' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface Job {
  id: number;
  company: string;
  position: string;
  status: JobStatus;
  notes?: string;
  date_added?: string;
  referral?: boolean;
}

export type NewJob = Omit<Job, 'id' | 'date_added'>;
