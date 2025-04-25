import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  // ExperienceLevel,
  JobAction, 
  JobDetail, 
  // Status,
} from "../utils/customTypes";

import { createJob, deleteJob, fetchJobById, fetchJobs, updateJob, updateJobStatus } from "./thunks/jobThunk";

interface StateParams {
  selectedAction: JobAction | null;
  selectedJobId: string | null; // <-- Add this field
  jobs: JobDetail[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: StateParams = {
  selectedAction: null,
  selectedJobId: null, // <-- Initialize as null
  jobs: [],
  loading: false,
  submitting: false,
  error: null,
};
export const jobActionSlice = createSlice({
  name: "job", 
  initialState,
  reducers: {

    updateSelectedAction: (state, action: PayloadAction<JobAction | null>) => {
      state.selectedAction = action.payload;
    },

    setSelectedJobId: (state, action: PayloadAction<string | null>) => {
      state.selectedJobId = action.payload;
  },

    toggleJobChecked: (state, action: PayloadAction<string>) => { 
        const job = state.jobs.find(j => j._id === action.payload);
        if (job) {
            job.checked = !job.checked;
        }
    },

    clearJobError: (state) => {
        state.error = null;
    }

  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<JobDetail[]>) => {
        state.jobs = action.payload.map(job => ({ ...job, checked: false })); 
        state.loading = false;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchJobById.pending, (state) => { state.loading = true; state.error = null; }) // Use loading state
      .addCase(fetchJobById.fulfilled, (state, action: PayloadAction<JobDetail>) => {
          // Optional: Add/update the fetched job in the main jobs array if needed
          const index = state.jobs.findIndex(job => job._id === action.payload._id);
          if (index !== -1) {
              state.jobs[index] = { ...action.payload, checked: state.jobs[index].checked }; // Preserve checked state
          } else {
              state.jobs.push({ ...action.payload, checked: false }); // Add if not present
          }
          state.loading = false;
      })
      .addCase(fetchJobById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(createJob.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action: PayloadAction<JobDetail>) => {
        state.jobs.push({ ...action.payload, checked: false }); 
        state.submitting = false;

      })
      .addCase(createJob.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })

      .addCase(updateJob.pending, (state) => { state.submitting = true; state.error = null; })
      .addCase(updateJob.fulfilled, (state, action: PayloadAction<JobDetail>) => {
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          const checkedState = state.jobs[index].checked; // Preserve checked state
          state.jobs[index] = { ...action.payload, checked: checkedState ?? false };
        }
        state.submitting = false;
        state.selectedJobId = null; // Clear selection after update
        state.selectedAction = null;
      })
      .addCase(updateJob.rejected, (state, action) => { state.submitting = false; state.error = action.payload as string; })


      .addCase(updateJobStatus.pending, (state) => {
        state.submitting = true; 
        state.error = null;
      })
      .addCase(updateJobStatus.fulfilled, (state, action: PayloadAction<JobDetail>) => {
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {

          const checkedState = state.jobs[index].checked;
          state.jobs[index] = { ...action.payload, checked: checkedState ?? false };
        }
        state.submitting = false;
        state.selectedAction = null; 
      })
      .addCase(updateJobStatus.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })

      .addCase(deleteJob.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action: PayloadAction<string>) => { 
        if (state.selectedJobId === action.payload) {
          state.selectedJobId = null;
          state.selectedAction = null;
      }
        state.jobs = state.jobs.filter(job => job._id !== action.payload);
        state.submitting = false;
        state.selectedAction = null; 
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateSelectedAction,
  setSelectedJobId, 
  toggleJobChecked,
  clearJobError,
} = jobActionSlice.actions;

export default jobActionSlice.reducer;