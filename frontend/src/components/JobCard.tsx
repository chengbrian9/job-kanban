import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, Typography, IconButton, Box, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import { Job } from '../types/Job';
import { TRUNCATE_STYLES, CARD_HOVER_STYLES } from '../constants';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: number) => void;
}

const ACTION_BUTTON_STYLES = {
  bgcolor: 'background.paper',
  cursor: 'pointer',
} as const;

const CARD_STYLES = {
  mb: 2,
  cursor: 'grab',
  '&:active': { 
    cursor: 'grabbing',
    zIndex: 1,
  },
  position: 'relative',
  // Prevent text selection during drag
  userSelect: 'none',
  // Ensure card stays above others during drag
  '&:hover': CARD_HOVER_STYLES,
} as const;

const REFERRAL_CARD_STYLES = {
  ...CARD_STYLES,
  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
  borderLeft: '4px solid #1976d2',
  '& .MuiTypography-root': {
    color: '#1565c0',
  },
  '& .MuiTypography-colorTextSecondary': {
    color: '#1976d2',
  },
  boxShadow: '0 2px 4px rgba(25, 118, 210, 0.1)',
  '&:hover': {
    ...CARD_HOVER_STYLES,
    boxShadow: '0 4px 8px rgba(25, 118, 210, 0.2)',
  },
} as const;

export const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: job.id.toString() });

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this job application?')) {
      onDelete(job.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(job);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    touchAction: 'none', // Prevent scrolling while dragging on touch devices
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={job.referral ? REFERRAL_CARD_STYLES : CARD_STYLES}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          <Box 
            sx={{ flex: 1, minWidth: 0 }} 
            {...attributes} 
            {...listeners}
          >
            <Typography variant="h6" component="div" noWrap>
              {job.company}
            </Typography>
            <Typography color="text.secondary" noWrap>
              {job.position}
            </Typography>
            {job.notes && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 1, ...TRUNCATE_STYLES }}
              >
                {job.notes}
              </Typography>
            )}
          </Box>
          <Box 
            className="action-buttons"
            sx={{ 
              display: 'flex',
              gap: 0.5,
              opacity: 0.4,
              transition: 'opacity 0.2s ease-in-out',
              alignSelf: 'flex-start',
              ml: 'auto',
              flexShrink: 0,
              cursor: 'default',
              // Ensure buttons stay above content during drag
              position: 'relative',
              zIndex: 2,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              size="small"
              onClick={handleEdit}
              sx={{ 
                ...ACTION_BUTTON_STYLES,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDelete}
              color="error"
              sx={{ 
                ...ACTION_BUTTON_STYLES,
                '&:hover': { bgcolor: 'error.lighter' },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        {job.referral && (
          <Box sx={{ mt: 2 }}>
            <Chip
              icon={<PersonIcon fontSize="small" />}
              label="Referral"
              size="small"
              sx={{
                backgroundColor: job.referral ? '#1565c0' : '#1976d2',
                color: 'white',
                '& .MuiChip-icon': {
                  color: 'white'
                }
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
