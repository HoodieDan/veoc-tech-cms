import { ExperienceLevel, JobAction, JobDetail, Status } from "./customTypes";

export const mockJobs: JobDetail[] = [
  {
    checked: false,
    title: "Software Engineer",
    dept: "Engineering",
    location: "San Francisco, CA",
    desc: "Develop and maintain web applications.",
    status: Status.OPEN,
    action: JobAction.OPEN_JOB,
  },
  {
    checked: true,
    title: "Product Manager",
    dept: "Product",
    location: "Remote",
    desc: "Lead product development and strategy.",
    status: Status.DRAFT,
    action: JobAction.ADD_TO_DRAFTS,
  },
  {
    checked: false,
    title: "UX Designer",
    dept: "Design",
    location: "New York, NY",
    desc: "Design user-friendly experiences and interfaces.",
    status: Status.CLOSED,
    action: JobAction.DELETE_JOB,
  },
];

export const locations = [
  { type: "NGA", action: () => {} },
  { type: "USA", action: () => {} },
  { type: "INDIA", action: () => {} },
  { type: "GHANA", action: () => {} },
];

export const experiencesLevelDropdown = [
  { type: ExperienceLevel.ZERO, action: () => {} },
  { type: ExperienceLevel.GTE_ONE, action: () => {} },
  { type: ExperienceLevel.GTE_FIVE, action: () => {} },
];
