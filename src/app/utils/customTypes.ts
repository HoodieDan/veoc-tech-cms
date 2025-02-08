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

export interface JobDetail {
  checked: boolean;
  title: string;
  dept: string;
  location: string;
  desc: string;
  status: Status;
  action: JobAction;
}
