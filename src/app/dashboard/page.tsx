"use client";
import React from "react";
import HighlightCard from "../components/highlight_card";
import Search from "../components/search";
import JobTableRowCard from "../components/job_table_row_card";
import { RootState } from "../reduxStore/store";
import JobDescriptionCard from "../components/job_description_card";
import { useDispatch, useSelector } from "react-redux";
import { JobAction } from "../utils/customTypes";
import { mockJobs } from "../utils/mockData";
import { resetDropdown } from "../reduxStore/dropdownSlice";

function Page() {
  const jobAction = useSelector((state: RootState) => state.jobAction);
  const dispatch = useDispatch();

  return (
    <>
      <div
        className="space-y-6 pt-8 min-h-[calc(100vh-5rem)] mb-10"
        onClick={() => dispatch(resetDropdown())}
      >
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-lg">Jobs</h2>
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

        <div>
          <div className="flex justify-between space-x-8">
            {[
              { id: 1, subtext: "Open Job Listings", text: "5000" },
              { id: 2, subtext: "Closed Job Listings", text: "2500" },
              { id: 3, subtext: "Drafts", text: "1500" },
            ].map((item) => (
              <HighlightCard
                key={item.id}
                subtext={item.subtext}
                text={item.text}
              />
            ))}
          </div>
        </div>

        <div className="bg-background p-5 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">All Jobs (5)</h4>
            <div className="flex gap-x-2 items-center">
              <Search height="2.3rem" width="15rem" placeholder="Search job" />
              <button className="flex gap-x-3 items-center border border-gray/30 h-[2.3rem] px-4 rounded-lg">
                <p>Filter</p>
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_801_8187)">
                    <path
                      d="M0.666667 3.66684H2.49067C2.63376 4.19333 2.94612 4.6581 3.37955 4.98946C3.81299 5.32082 4.34341 5.50035 4.889 5.50035C5.43459 5.50035 5.96501 5.32082 6.39845 4.98946C6.83188 4.6581 7.14424 4.19333 7.28733 3.66684H15.3333C15.5101 3.66684 15.6797 3.5966 15.8047 3.47158C15.9298 3.34655 16 3.17698 16 3.00017C16 2.82336 15.9298 2.65379 15.8047 2.52877C15.6797 2.40374 15.5101 2.33351 15.3333 2.33351H7.28733C7.14424 1.80702 6.83188 1.34224 6.39845 1.01089C5.96501 0.679527 5.43459 0.5 4.889 0.5C4.34341 0.5 3.81299 0.679527 3.37955 1.01089C2.94612 1.34224 2.63376 1.80702 2.49067 2.33351H0.666667C0.489856 2.33351 0.320286 2.40374 0.195262 2.52877C0.0702379 2.65379 0 2.82336 0 3.00017C0 3.17698 0.0702379 3.34655 0.195262 3.47158C0.320286 3.5966 0.489856 3.66684 0.666667 3.66684V3.66684ZM4.88867 1.83351C5.11941 1.83351 5.34497 1.90193 5.53683 2.03012C5.72869 2.15832 5.87822 2.34053 5.96653 2.55371C6.05483 2.76689 6.07793 3.00147 6.03292 3.22778C5.9879 3.45409 5.87679 3.66197 5.71362 3.82513C5.55046 3.98829 5.34258 4.09941 5.11627 4.14442C4.88996 4.18944 4.65538 4.16633 4.4422 4.07803C4.22902 3.98973 4.04681 3.8402 3.91862 3.64834C3.79042 3.45648 3.722 3.23092 3.722 3.00017C3.72235 2.69086 3.84538 2.39432 4.0641 2.1756C4.28281 1.95689 4.57936 1.83386 4.88867 1.83351V1.83351Z"
                      fill="#494949"
                    />
                    <path
                      d="M15.3333 7.83269H13.5093C13.3665 7.30608 13.0542 6.84114 12.6208 6.50964C12.1874 6.17815 11.657 5.99854 11.1113 5.99854C10.5657 5.99854 10.0352 6.17815 9.60182 6.50964C9.16842 6.84114 8.85619 7.30608 8.71333 7.83269H0.666667C0.489856 7.83269 0.320286 7.90293 0.195262 8.02795C0.0702379 8.15297 0 8.32254 0 8.49935C0 8.67616 0.0702379 8.84573 0.195262 8.97076C0.320286 9.09578 0.489856 9.16602 0.666667 9.16602H8.71333C8.85619 9.69263 9.16842 10.1576 9.60182 10.4891C10.0352 10.8206 10.5657 11.0002 11.1113 11.0002C11.657 11.0002 12.1874 10.8206 12.6208 10.4891C13.0542 10.1576 13.3665 9.69263 13.5093 9.16602H15.3333C15.5101 9.16602 15.6797 9.09578 15.8047 8.97076C15.9298 8.84573 16 8.67616 16 8.49935C16 8.32254 15.9298 8.15297 15.8047 8.02795C15.6797 7.90293 15.5101 7.83269 15.3333 7.83269ZM11.1113 9.66602C10.8806 9.66602 10.655 9.59759 10.4632 9.4694C10.2713 9.3412 10.1218 9.159 10.0335 8.94582C9.94517 8.73264 9.92207 8.49806 9.96708 8.27175C10.0121 8.04544 10.1232 7.83756 10.2864 7.6744C10.4495 7.51124 10.6574 7.40012 10.8837 7.35511C11.11 7.31009 11.3446 7.33319 11.5578 7.4215C11.771 7.5098 11.9532 7.65933 12.0814 7.85119C12.2096 8.04305 12.278 8.26861 12.278 8.49935C12.2776 8.80866 12.1546 9.1052 11.9359 9.32392C11.7172 9.54264 11.4206 9.66566 11.1113 9.66602V9.66602Z"
                      fill="#494949"
                    />
                    <path
                      d="M15.3333 13.3335H7.28733C7.14424 12.807 6.83188 12.3422 6.39845 12.0109C5.96501 11.6795 5.43459 11.5 4.889 11.5C4.34341 11.5 3.81299 11.6795 3.37955 12.0109C2.94612 12.3422 2.63376 12.807 2.49067 13.3335H0.666667C0.489856 13.3335 0.320286 13.4037 0.195262 13.5288C0.0702379 13.6538 0 13.8234 0 14.0002C0 14.177 0.0702379 14.3465 0.195262 14.4716C0.320286 14.5966 0.489856 14.6668 0.666667 14.6668H2.49067C2.63376 15.1933 2.94612 15.6581 3.37955 15.9894C3.81299 16.3208 4.34341 16.5003 4.889 16.5003C5.43459 16.5003 5.96501 16.3208 6.39845 15.9894C6.83188 15.6581 7.14424 15.1933 7.28733 14.6668H15.3333C15.5101 14.6668 15.6797 14.5966 15.8047 14.4716C15.9298 14.3465 16 14.177 16 14.0002C16 13.8234 15.9298 13.6538 15.8047 13.5288C15.6797 13.4037 15.5101 13.3335 15.3333 13.3335ZM4.88867 15.1668C4.65792 15.1668 4.43236 15.0984 4.2405 14.9702C4.04864 14.842 3.89911 14.6598 3.81081 14.4466C3.72251 14.2334 3.6994 13.9989 3.74442 13.7726C3.78943 13.5462 3.90055 13.3384 4.06371 13.1752C4.22687 13.012 4.43475 12.9009 4.66106 12.8559C4.88737 12.8109 5.12195 12.834 5.33513 12.9223C5.54831 13.0106 5.73052 13.1601 5.85871 13.352C5.98691 13.5439 6.05533 13.7694 6.05533 14.0002C6.0548 14.3094 5.93172 14.6059 5.71304 14.8245C5.49436 15.0432 5.19792 15.1663 4.88867 15.1668V15.1668Z"
                      fill="#494949"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_801_8187">
                      <rect
                        width="16"
                        height="16"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>

          <div>
            <div>
              <ul className="flex bg-gray/30 rounded overflow-clip">
                <li className="py-1 text-sm px-2 w-[5%]"></li>
                <li className="py-1 text-sm px-2 w-[25%]">Job Title</li>
                <li className="py-1 text-sm px-2 w-[15%]">Department</li>
                <li className="py-1 text-sm px-2 w-[20%]">Location</li>
                <li className="py-1 text-sm px-2 w-[20%]">Job Description</li>
                <li className="py-1 text-sm px-2 w-[10%]">Status</li>
                <li className="py-1 text-sm px-2 w-[5%]"></li>
              </ul>
            </div>
            {mockJobs.map((item, index) => (
              <JobTableRowCard
                key={index}
                checked={false}
                title={item.title}
                dept={item.dept}
                location={item.location}
                desc={item.desc}
                status={item.status}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
      {jobAction.action == JobAction.OPEN_JOB && <JobDescriptionCard />}
    </>
  );
}

export default Page;
