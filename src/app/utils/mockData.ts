import {
  ExperienceLevel,
  JobDetail,
  Status,
  Tag,
} from "./customTypes";

export const mockJobs: JobDetail[] = [
  {
    // _id: "mock1", // Add mock IDs if needed
    checked: false,
    title: "Software Engineer",
    dept: "Engineering",
    location: "San Francisco, CA",
    desc: "Develop and maintain web applications.",
    status: Status.OPEN,
    // action: JobAction.VIEW_JOB, // REMOVE THIS
    job_type: "",
    submission_link: "https://example.com/apply",
    experience: ExperienceLevel.GTE_FIVE,
    date: "12/22/2024",
    image: "https://via.placeholder.com/150", // Add mock image if needed
  },
  {
    // _id: "mock2",
    checked: true,
    title: "Product Manager",
    dept: "Product",
    location: "Remote",
    desc: "Lead product development and strategy.",
    status: Status.DRAFT,
    // action: JobAction.ADD_TO_DRAFTS, // REMOVE THIS
    job_type: "",
    submission_link: "https://example.com/apply",

    experience: ExperienceLevel.ZERO,
    date: "02/12/2025",
  },
  {
    // _id: "mock3",
    checked: false,
    title: "UX Designer",
    dept: "Design",
    location: "New York, NY",
    desc: "Design user-friendly experiences and interfaces.",
    status: Status.CLOSED,
    // action: JobAction.DELETE_JOB, // REMOVE THIS
    job_type: "",
    submission_link: "https://example.com/apply",

    experience: ExperienceLevel.ZERO,
    date: "02/22/2025",
  },
];


export const tags: Tag[] = [
  { color: "#0F1928", active: false },
  { color: "#7E00F1", active: true },
  { color: "#3144F5", active: false },
  { color: "#008BB3", active: false },
  { color: "#009A54", active: false },
];
