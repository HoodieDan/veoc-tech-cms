export enum JobAction {
  ADD_TO_DRAFTS = "Add to Drafts",
  OPEN_JOB = "Open Job",
  DELETE_JOB = "Delete Job",
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

export interface JobDetail {
  checked: boolean;
  title: string;
  dept: string;
  location: string;
  desc: string;
  status: Status;
  job_type: string;
  experience: ExperienceLevel;
  action: JobAction;
  date: string;
}

export type Tag = {
  active: boolean;
  color: string;
};

export type Category = {
  name: string;
  tag: Tag;
  division: Array<string>;
};
