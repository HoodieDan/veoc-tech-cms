import { JobData, Status } from "@/app/utils/customTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// Fetch all jobs
export const fetchJobs = createAsyncThunk(
  "job/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/job");
      console.log("Fetched Jobs:", response.data);
      return response.data.jobs as JobData[];
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Fetch Jobs Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs"
      );
    }
  }
);

// --- Fetch Job By ID ---
export const fetchJobById = createAsyncThunk(
  "job/fetchJobById",
  async (id: string, { rejectWithValue }) => {
    try {
      // Assuming you have a GET /api/job/[id] endpoint
      const response = await axios.get(`/api/job/${id}`);
      console.log("Fetched Job By ID:", response.data);
      return response.data as JobData;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Fetch Job By ID Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch job details"
      );
    }
  }
);


export const updateJob = createAsyncThunk(
  "job/updateJob",
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      // Correctly calls the PATCH endpoint for full updates
      const response = await axios.patch(`/api/job/${id}`, formData, {
        headers: {
          // Correctly sets the Content-Type for FormData
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Job updated:", response.data);
      // Correctly expects the updated job object in the response
      return response.data as JobData;
    } catch (err) {
      const error = err as AxiosError<{ message: string; errors?: string }>;
      console.error("Update Job Error:", error.response?.data);
      if (error.response?.data?.errors) {
          // Handles potential validation errors from the API
          return rejectWithValue(JSON.stringify(error.response.data.errors));
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to update job"
      );
    }
  }
);

// Create a new job
export const createJob = createAsyncThunk(
  "job/createJob",
  async (jobData: FormData, { rejectWithValue }) => { // Use FormData as per your API
    try {
      const response = await axios.post("/api/job", jobData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Job created:", response.data);
      return response.data.job as JobData; // API returns { message, job }
    } catch (err) {
      const error = err as AxiosError<{ message: string; error?: string }>; // API might return 'error' field
      console.error("Create Job Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.error || "Failed to create job"
      );
    }
  }
);

// Update job status (Example - requires PATCH endpoint)
export const updateJobStatus = createAsyncThunk(
  "job/updateJobStatus",
  async ({ id, status }: { id: string; status: Status }, { rejectWithValue }) => {
    try {
      // --- Call the new dedicated status update endpoint ---
      const response = await axios.patch(`/api/job/${id}/status`, { status }); // Send status in JSON body
      console.log("Job status updated via dedicated route:", response.data);
      // --- Ensure the API returns the full updated job object ---
      // The new API route returns the updated job directly
      return response.data as JobData;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Update Job Status Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update job status"
      );
    }
  }
);

// Delete a job (Example - requires DELETE endpoint)
export const deleteJob = createAsyncThunk(
  "job/deleteJob",
  async (id: string, { rejectWithValue }) => {
    try {
      // *** ASSUMPTION: You need a DELETE endpoint like /api/job/[id] ***
      const response = await axios.delete(`/api/job/${id}`);
      console.log("Job deleted:", response.data);
      return id; // Return the ID of the deleted job for removal from state
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Delete Job Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete job"
      );
    }
  }
);

// Add other thunks as needed (e.g., full updateJob)
