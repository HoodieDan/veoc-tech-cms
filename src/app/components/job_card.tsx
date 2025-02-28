"use client";
import React from "react";
import Label from "./label";
import { Category } from "../utils/customTypes";
import { truncateString } from "../utils/helpers";
import { initUpdate } from "../reduxStore/categorySlice";
import { useDispatch } from "react-redux";

interface Params {
  data: Category;
  index: number;
}

function JobCard({ data, index }: Params) {
  const dispatch = useDispatch();
  return (
    <div className="border border-gray/30 p-4 space-y-5 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-foreground/70">Department</h2>
          <div
            className="flex gap-x-2 text-sm items-center"
            style={{ color: data.tag.color }}
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: data.tag.color }}
            />{" "}
            <p>{truncateString(data.name.toUpperCase(), 10)}</p>
          </div>
        </div>

        <button
          onClick={() => {
            dispatch(initUpdate(index));
          }}
          className="rounded-full p-2 cursor-pointer border border-gray/40 bg-gray/20"
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.59936 12.1073L12.53 7.17664C11.7006 6.83013 10.9472 6.32411 10.3127 5.68731C9.67558 5.05267 9.16933 4.29908 8.82269 3.46931L3.89203 8.39998C3.50736 8.78464 3.3147 8.97731 3.14936 9.18931C2.95429 9.43963 2.78687 9.71031 2.65003 9.99664C2.5347 10.2393 2.44869 10.498 2.27669 11.014L1.36869 13.736C1.3269 13.8606 1.3207 13.9944 1.35079 14.1224C1.38088 14.2503 1.44606 14.3674 1.53901 14.4603C1.63196 14.5533 1.74899 14.6185 1.87695 14.6485C2.00491 14.6786 2.13873 14.6724 2.26336 14.6306L4.98536 13.7226C5.50203 13.5506 5.76003 13.4646 6.0027 13.3493C6.29025 13.2124 6.55936 13.046 6.81003 12.85C7.02203 12.6846 7.21469 12.492 7.59936 12.1073ZM13.898 5.80864C14.3897 5.31702 14.6658 4.65024 14.6658 3.95498C14.6658 3.25972 14.3897 2.59293 13.898 2.10131C13.4064 1.60969 12.7396 1.3335 12.0444 1.3335C11.3491 1.3335 10.6823 1.60969 10.1907 2.10131L9.59936 2.69264L9.62469 2.76664C9.91602 3.6005 10.3929 4.3573 11.0194 4.97998C11.6607 5.62519 12.444 6.11147 13.3067 6.39998L13.898 5.80864Z"
              fill="#3E3E3E"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex text-sm text-foreground/50 items-center justify-between">
          <p>Divisions</p>
          <p>Total: {data.division.length}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {data.division.map((division, index) => (
            <Label key={index} content={division} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobCard;
