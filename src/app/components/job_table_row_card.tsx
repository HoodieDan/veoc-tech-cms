"use client";
import React from "react";
import StatusCard from "./status_card";
import { JobAction, Status, JobData } from "../utils/customTypes";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSelectedAction,
  toggleJobChecked,
  setSelectedJobId,
} from "../reduxStore/jobActionSlice";
import { deleteJob, updateJobStatus } from "../reduxStore/thunks/jobThunk";
import Dropdown from "./dropdown";
import { RootState, AppDispatch } from "../reduxStore/store";
import { toggleDropdown } from "../reduxStore/dropdownSlice"; // Ensure this is imported
import { stripHtml } from "../utils/helpers"; // Assuming you have this helper
import { useRouter } from "next/navigation";

interface Params {
  job: JobData;
  index: number;
}

function JobTableRowCard({ job, index }: Params) {
  const dispatch: AppDispatch = useDispatch();
  const specificDropdownState = useSelector(
    (state: RootState) => state.dropdown.dropdowns[index]
  );

  const router = useRouter();

  const { submitting } = useSelector((state: RootState) => state.jobAction); // Use jobAction key

  const handleCheckboxChange = () => {
    if (job._id) {
      dispatch(toggleJobChecked(job._id));
    }
  };

  // --- Handle Actions using Thunks (parameter type is now just JobAction) ---
  const handlePerformAction = (action: JobAction) => {
    if (!job._id) {
      console.error("Job ID is missing, cannot perform action.");
      return;
    }

    switch (action) {
      case JobAction.VIEW_JOB:
        dispatch(setSelectedJobId(job._id));
        dispatch(updateSelectedAction(JobAction.VIEW_JOB));
        break;

      case JobAction.EDIT_JOB:
        router.push(`/edit-job/${job._id}`);
        break;

      case JobAction.DELETE_JOB:
        if (
          window.confirm(`Are you sure you want to delete job: "${job.title}"?`)
        ) {
          dispatch(deleteJob(job._id));
        }
        break;

      case JobAction.ADD_TO_DRAFTS:
        dispatch(updateJobStatus({ id: job._id, status: Status.DRAFT }));
        break;
      // --- Handle new enum members for status changes ---
      case JobAction.OPEN_JOB_STATUS:
        dispatch(updateJobStatus({ id: job._id, status: Status.OPEN }));
        break;
      case JobAction.CLOSE_JOB_STATUS:
        dispatch(updateJobStatus({ id: job._id, status: Status.CLOSED }));
        break;
      default:
        // Optional: Exhaustiveness check (if using TypeScript)
        // const _exhaustiveCheck: never = action;
        console.warn("Unhandled action:", action);
    }
  };

  // --- Define actions for the dropdown using the enum ---
  const actions = [
    // Always show View Job
    {
      type: JobAction.VIEW_JOB, // Use enum value as type (which is the display string)
      action: () => handlePerformAction(JobAction.VIEW_JOB),
    },

    {
      type: JobAction.EDIT_JOB,
      action: () => handlePerformAction(JobAction.EDIT_JOB),
    },

    ...(job.status !== Status.DRAFT
      ? [
          {
            type: JobAction.ADD_TO_DRAFTS,
            action: () => handlePerformAction(JobAction.ADD_TO_DRAFTS),
          },
        ]
      : []),
    // Conditionally show "Open Job"
    ...(job.status !== Status.OPEN
      ? [
          {
            type: JobAction.OPEN_JOB_STATUS, // Use enum value
            action: () => handlePerformAction(JobAction.OPEN_JOB_STATUS),
          },
        ]
      : []),
    // Conditionally show "Close Job"
    ...(job.status !== Status.CLOSED
      ? [
          {
            type: JobAction.CLOSE_JOB_STATUS, // Use enum value
            action: () => handlePerformAction(JobAction.CLOSE_JOB_STATUS),
          },
        ]
      : []),
    // Always show Delete Job
    {
      type: JobAction.DELETE_JOB,
      action: () => handlePerformAction(JobAction.DELETE_JOB),
    },
  ];

  const handleRowClick = () => {
    if (job._id) {
      handlePerformAction(JobAction.VIEW_JOB);
    }
  };

  const plainTextDesc = stripHtml(job.desc);
  const truncatedDesc = ((text: string, limit: number) => {
      return text.length > limit ? text.substring(0, limit) + "..." : text;
  })(plainTextDesc, 15); // Immediately call with the text and limit (e.g., 20)


  return (
    <ul
      className={`flex border-b border-b-gray/30 transition-opacity duration-300 ${
        submitting
          ? "opacity-60 pointer-events-none"
          : "hover:bg-gray-100 cursor-pointer"
      }`}
      onClick={handleRowClick}
    >
      {" "}
      <li
        className="py-1 h-[4rem] flex items-center text-sm px-2 w-[5%]"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          className="h-5 w-5 cursor-pointer accent-accent"
          checked={job.checked || false}
          onChange={handleCheckboxChange}
        />
      </li>
      <li className="py-1 h-[4rem] flex items-center text-sm px-2 w-[25%]">
        {job.title}
      </li>
      <li className="py-1 h-[4rem] font-semibold flex items-center text-sm px-2 w-[15%]">
        {job.dept}
      </li>
      <li className="py-1 h-[4rem] flex items-center text-sm px-2 w-[20%]">
        {job.location}
      </li>
      <li
        className="py-1 h-[4rem] flex items-center text-sm px-2 w-[20%] overflow-hidden whitespace-nowrap text-ellipsis"
        title={truncatedDesc}
      >
        {truncatedDesc}
      </li>
      <li className="py-1 h-[4rem] flex items-center text-sm px-2 w-[10%]">
        <StatusCard type={job.status} />
      </li>
      <li
        onClick={(e) => {
          // Prevent opening dropdown if submitting
          if (!submitting) {
            e.stopPropagation();
            dispatch(toggleDropdown(index));
          }
        }}
        // Adjust styling for disabled state if needed
        className={`py-1 h-[4rem] flex relative items-center justify-center text-sm px-2 w-[5%] ${
          submitting ? "cursor-not-allowed" : ""
        }`}
      >
        {/* More options icon */}
        <svg
          className={`h-5 w-5 ${
            submitting ? "text-gray-300" : "text-gray-500"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z"
            clipRule="evenodd"
          />
        </svg>
        {/* --- Check the specific dropdown state's active property --- */}
        {!submitting && specificDropdownState?.active && (
          <Dropdown items={actions} index={index} />
        )}
      </li>
    </ul>
  );
}

export default JobTableRowCard;
