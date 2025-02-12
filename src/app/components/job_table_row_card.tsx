"use client";
import React from "react";
import StatusCard from "./status_card";
import { JobAction, Status } from "../utils/customTypes";
import { useDispatch, useSelector } from "react-redux";
import { handleAction, updateAction } from "../reduxStore/jobActionSlice";
import Dropdown from "./dropdown";
import { RootState } from "../reduxStore/store";
import { toggleDropdown } from "../reduxStore/dropdownSlice";

interface Params {
  checked: boolean;
  title: string;
  dept: string;
  location: string;
  desc: string;
  status: Status;
  index: number;
}

function JobTableRowCard({
  title,
  dept,
  location,
  desc,
  status,
  index,
}: Params) {
  const dispatch = useDispatch();
  const dropdown = useSelector((state: RootState) => state.dropdown);
  const handleActionUpdate = (action: JobAction, index: number) => {
    dispatch(updateAction(action));
    dispatch(handleAction(index));
  };
  const actions = [
    {
      type: JobAction.ADD_TO_DRAFTS,
      action: (index: number) =>
        handleActionUpdate(JobAction.ADD_TO_DRAFTS, index),
    },
    {
      type: JobAction.OPEN_JOB,
      action: (index: number) => handleActionUpdate(JobAction.OPEN_JOB, index),
    },
    {
      type: JobAction.DELETE_JOB,
      action: (index: number) =>
        handleActionUpdate(JobAction.DELETE_JOB, index),
    },
  ];
  return (
    <div>
      <ul className="flex border-b border-b-gray/30 rounded">
        <li className="py-1 h-[4rem] flex items-center cursor-pointer text-sm px-2 w-[5%]">
          <input type="checkbox" className="h-5 w-6 cursor-pointer" />
        </li>
        <li className="py-1 h-[4rem] flex items-center text-sm px-2 w-[25%]">
          {title}
        </li>
        <li className="py-1 h-[4rem] font-semibold flex items-center text-sm px-2 w-[15%]">
          {dept}
        </li>
        <li className="py-1 h-[4rem] flex items-center text-sm px-2 w-[20%]">
          {location}
        </li>
        <li className="py-1 h-[4rem] flex items-center text-sm px-2 w-[20%]">
          {desc}
        </li>
        <li className="py-1 h-[4rem] flex items-center text-sm px-2 w-[10%]">
          <StatusCard type={status} />
        </li>
        <li
          onClick={() => dispatch(toggleDropdown(index))}
          className="py-1 h-[4rem] flex relative items-center cursor-pointer text-sm px-2 w-[5%]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_801_8200)">
              <path
                d="M8.0013 2.66667C8.73768 2.66667 9.33463 2.06971 9.33463 1.33333C9.33463 0.596954 8.73768 0 8.0013 0C7.26492 0 6.66797 0.596954 6.66797 1.33333C6.66797 2.06971 7.26492 2.66667 8.0013 2.66667Z"
                fill="#374957"
              />
              <path
                d="M8.0013 9.33353C8.73768 9.33353 9.33463 8.73658 9.33463 8.0002C9.33463 7.26382 8.73768 6.66687 8.0013 6.66687C7.26492 6.66687 6.66797 7.26382 6.66797 8.0002C6.66797 8.73658 7.26492 9.33353 8.0013 9.33353Z"
                fill="#374957"
              />
              <path
                d="M8.0013 15.9998C8.73768 15.9998 9.33463 15.4029 9.33463 14.6665C9.33463 13.9301 8.73768 13.3331 8.0013 13.3331C7.26492 13.3331 6.66797 13.9301 6.66797 14.6665C6.66797 15.4029 7.26492 15.9998 8.0013 15.9998Z"
                fill="#374957"
              />
            </g>
            <defs>
              <clipPath id="clip0_801_8200">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          {dropdown.dropdowns[index] && dropdown.dropdowns[index].active && (
            <Dropdown items={actions} index={index} />
          )}
        </li>
      </ul>
    </div>
  );
}

export default JobTableRowCard;
