export enum JobAction {
  VIEW_JOB = "View Job", // Renamed from OPEN_JOB for clarity if it just views details
  ADD_TO_DRAFTS = "Add to Drafts",
  DELETE_JOB = "Delete Job",
  OPEN_JOB_STATUS = "Open Job", // Action to change status to Open
  CLOSE_JOB_STATUS = "Close Job", // Action to change status to Closed
  EDIT_JOB = "Edit Job", // <-- Add this
}

export enum Status {
  OPEN = "Open",
  DRAFT = "Draft",
  CLOSED = "Closed",
}

export enum ExperienceLevel {
  ZERO = "0 yrs",
  GTE_ONE = ">= 1yrs",
  GTE_FIVE = ">= 5yrs",
}

// Represents the core data of a Job, matching the backend model
export interface JobData {
  _id?: string;
  checked?: boolean;
  title: string;
  dept: string;
  location: string;
  desc: string;
  status: Status;
  job_type: string;
  submission_link: string;
  experience: ExperienceLevel;
  date: string;
  image?: string; 
  createdAt?: string;
  updatedAt?: string;
}

// Keep JobDetail if it represents a slightly different structure used only in the UI/Redux state,
// but it's better to align it closely with JobData.
export type JobDetail = JobData;


export type Tag = {
  active: boolean;
  color: string;
};

export type Category = {
  _id: string;
  name: string;
  tag: Tag;
  division: Array<string>;
};
