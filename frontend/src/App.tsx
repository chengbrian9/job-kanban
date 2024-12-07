import React from 'react';
import {
  DndContext,
  DragEndEvent,
  closestCorners,
} from '@dnd-kit/core';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Job, NewJob } from './types/Job';
import { KanbanColumn } from './components/KanbanColumn';
import { JobModal } from './components/JobModal';
import { api } from './services/api';
import { JOB_STATUSES } from './constants';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

function App() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState<Job | undefined>();

  React.useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const fetchedJobs = await api.getJobs();
      setJobs(fetchedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      // You could add a snackbar/toast here for error feedback
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const jobId = parseInt(active.id.toString());
    const newStatus = over.id as Job['status'];
    const draggedJob = jobs.find(job => job.id === jobId);
    
    if (!draggedJob || draggedJob.status === newStatus) return;

    try {
      // Optimistically update the UI
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.id === jobId
            ? { ...job, status: newStatus }
            : job
        )
      );

      await api.updateJob(jobId, { status: newStatus });
    } catch (error) {
      console.error('Error updating job status:', error);
      // Revert the optimistic update on error
      await loadJobs();
    }
  };

  const handleDeleteJob = async (id: number) => {
    try {
      await api.deleteJob(id);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
    } catch (error) {
      console.error('Error deleting job:', error);
      // You could add a snackbar/toast here for error feedback
    }
  };

  const handleSaveJob = async (jobData: NewJob) => {
    try {
      if (selectedJob) {
        await api.updateJob(selectedJob.id, jobData);
        await loadJobs();
      } else {
        const newJob = await api.createJob(jobData);
        setJobs(prevJobs => [...prevJobs, newJob]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving job:', error);
      // You could add a snackbar/toast here for error feedback
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedJob(undefined);
  };
  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Job Applications
              </Typography>
              <Button color="inherit" onClick={handleOpenModal}>
                Add Job
              </Button>
            </Toolbar>
          </AppBar>

          <Box 
            className="kanban-container"
            sx={{
              flex: 1,
              display: 'flex',
              gap: 2,
              p: 2,
              overflowX: 'auto',
              overflowY: 'hidden',
              bgcolor: 'grey.100',
              minHeight: 0, 
              '& > *': {
                flex: '0 0 300px', 
              },
              '&::-webkit-scrollbar': {
                height: 8,
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
            }}
          >
            {JOB_STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                jobs={jobs.filter((job) => job.status === status)}
                onEditJob={handleEditJob}
                onDeleteJob={handleDeleteJob}
              />
            ))}
          </Box>

          <JobModal
            open={modalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveJob}
            job={selectedJob}
          />
        </Box>
      </DndContext>
    </ThemeProvider>
  );
}

export default App;
