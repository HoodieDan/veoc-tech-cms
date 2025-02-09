import React from "react";
import JobCard from "../components/job_card";

function Page() {
  return (
    <div className="p-1 space-y-6 pt-8 min-h-[calc(100vh-5rem)] mb-10">
      <div className="flex justify-between items-center">
        <h2 className="font-medium text-lg">Manage Jobs</h2>
        <button className="px-3 pr-5 py-2 rounded-lg flex bg-accent items-center text-background gap-x-2">
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_801_8125)">
              <path
                d="M11.5 11V5H13.5V11H19.5V13H13.5V19H11.5V13H5.5V11H11.5Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_801_8125">
                <rect
                  width="24"
                  height="24"
                  fill="white"
                  transform="translate(0.5)"
                />
              </clipPath>
            </defs>
          </svg>
          <p className="">New Job</p>
        </button>
      </div>

      <div className="bg-background rounded-lg p-5 space-y-6 mt-4 pb-10">
        <div className="border-b border-b-gray/50 py-2">
          <h2 className="">Categories</h2>
        </div>

        <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <JobCard />
          <JobCard />
          <JobCard />
          <JobCard />
          <JobCard />
        </div>
      </div>
    </div>
  );
}

export default Page;
