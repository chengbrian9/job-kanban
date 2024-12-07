import axios, { AxiosError } from 'axios';
import { Job, NewJob } from '../types/Job';

const API_BASE_URL = 'http://localhost:5001/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleApiError = (error: AxiosError): never => {
  if (axios.isAxiosError(error)) {
    throw new ApiError(
      error.response?.data?.message || 'An error occurred',
      error.response?.status
    );
  }
  throw new ApiError('An unexpected error occurred');
};

export const api = {
  async getJobs(): Promise<Job[]> {
    try {
      const response = await axiosInstance.get<Job[]>('/jobs');
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  async createJob(job: NewJob): Promise<Job> {
    try {
      const response = await axiosInstance.post<Job>('/jobs', job);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  async updateJob(id: number, job: Partial<NewJob>): Promise<Job> {
    try {
      const response = await axiosInstance.put<Job>(`/jobs/${id}`, job);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  async deleteJob(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/jobs/${id}`);
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },
};
