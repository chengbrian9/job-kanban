import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Job, JobStatus, NewJob } from '../types/Job';

interface JobModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (job: NewJob) => void;
  job?: Job;
}

const STATUSES: JobStatus[] = ['Intake', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

export const JobModal: React.FC<JobModalProps> = ({ open, onClose, onSave, job }) => {
  const [formData, setFormData] = React.useState<NewJob>({
    company: '',
    position: '',
    status: 'Intake',
    notes: '',
    referral: false,
  });

  React.useEffect(() => {
    if (job) {
      setFormData({
        company: job.company,
        position: job.position,
        status: job.status,
        notes: job.notes || '',
        referral: job.referral || false,
      });
    } else {
      setFormData({
        company: '',
        position: '',
        status: 'Intake',
        notes: '',
        referral: false,
      });
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
      onClose();
      setFormData({
        company: '',
        position: '',
        status: 'Intake',
        notes: '',
        referral: false,
      });
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{job ? 'Edit Job' : 'Add New Job'}</DialogTitle>
        <DialogContent>
          <TextField
            name="company"
            label="Company"
            value={formData.company}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            name="position"
            label="Position"
            value={formData.position}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            name="status"
            select
            label="Status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          >
            {STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="notes"
            label="Notes"
            value={formData.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="referral"
                checked={formData.referral}
                onChange={handleChange}
              />
            }
            label="Applied with Referral"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {job ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
