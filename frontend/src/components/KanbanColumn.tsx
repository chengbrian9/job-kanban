import React from 'react';
import { Box, Typography } from '@mui/material';
import { Job, JobStatus } from '../types/Job';
import { JobCard } from './JobCard';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

interface KanbanColumnProps {
  status: JobStatus;
  jobs: Job[];
  onEditJob: (job: Job) => void;
  onDeleteJob: (id: number) => void;
}

const COLUMN_STYLES = {
  bgcolor: 'background.paper',
  borderRadius: 1,
  p: 2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column' as const,
  boxShadow: 1,
} as const;

const CONTENT_STYLES = {
  flex: 1,
  overflowY: 'auto' as const,
  overflowX: 'hidden',
  minHeight: 0, // Important for flex child scrolling
  '&::-webkit-scrollbar': {
    width: 8,
  },
  '&::-webkit-scrollbar-track': {
    bgcolor: 'background.paper',
    borderRadius: 4,
  },
  '&::-webkit-scrollbar-thumb': {
    bgcolor: 'grey.400',
    borderRadius: 4,
    '&:hover': {
      bgcolor: 'grey.500',
    },
  },
} as const;

export function KanbanColumn({
  status,
  jobs,
  onEditJob,
  onDeleteJob,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <Box
      ref={setNodeRef}
      className="kanban-column"
      sx={COLUMN_STYLES}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        {status} ({jobs.length})
      </Typography>
      
      <Box sx={CONTENT_STYLES}>
        <SortableContext 
          items={jobs.map(job => job.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={onEditJob}
              onDelete={onDeleteJob}
            />
          ))}
        </SortableContext>
      </Box>
    </Box>
  );
}
