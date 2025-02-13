import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ExperienceLevel,
  JobAction,
  JobDetail,
  Status,
} from "../utils/customTypes";
import { mockJobs } from "../utils/mockData";

interface StateParams {
  action: JobAction | null;
  jobs: JobDetail[];
  newJob: JobDetail | undefined;
}
const initialState: StateParams = {
  action: null,
  jobs: mockJobs,
  newJob: undefined,
};

export const jobActionSlice = createSlice({
  name: "job-action",
  initialState,
  reducers: {
    updateAction: (state, action: PayloadAction<JobAction | null>) => {
      state.action = action.payload;
    },
    handleAction: (state, index: PayloadAction<number>) => {
      const currentJob = state.jobs[index.payload];
      if (state.action && state.action == JobAction.ADD_TO_DRAFTS) {
        currentJob.status = Status.DRAFT;
        state.jobs[index.payload] = currentJob;
      }
      if (state.action && state.action == JobAction.DELETE_JOB) {
        const filteredJobs = state.jobs.filter((job) => job != currentJob);
        state.jobs = filteredJobs;
      }
    },
    updateNewJob: <T>(
      state: StateParams,
      action: PayloadAction<{ key: string; value: T }>
    ) => {
      state.newJob = {
        ...state.newJob,
        [action.payload.key]: action.payload.value,
      } as JobDetail;
    },
    saveNewJob: (state) => {
      if (state.newJob) {
        state.jobs.push(state.newJob);
        state.newJob = {
          checked: false,
          title: "",
          dept: "",
          location: "",
          desc: "",
          status: Status.CLOSED,
          action: JobAction.DELETE_JOB,
          job_type: "",
          experience: ExperienceLevel.ZERO,
          date: "",
        };
      }
    },
  },
});

export const {
  updateAction,
  handleAction,
  updateNewJob,
  saveNewJob,
} = jobActionSlice.actions;

export default jobActionSlice.reducer;
