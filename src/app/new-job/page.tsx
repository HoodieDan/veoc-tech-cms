"use client";
import React, { useState } from "react";
import Dropdown from "../components/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { resetDropdown, toggleDropdown } from "../reduxStore/dropdownSlice";
import { RootState } from "../reduxStore/store";
import { ExperienceLevel } from "../utils/customTypes";
import { saveNewJob, updateNewJob } from "../reduxStore/jobActionSlice";
import { Editor } from "../components/editor";
import Image from "next/image";

function Page() {
  const dispatch = useDispatch();
  const dropdown = useSelector((state: RootState) => state.dropdown);
  const jobAction = useSelector((state: RootState) => state.jobAction);

  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleLocationUpdate = (location: string) => {
    dispatch(
      updateNewJob({
        key: "location",
        value: location,
      })
    );
  };

  const handleExpLvlUpdate = (expLvl: ExperienceLevel) => {
    dispatch(
      updateNewJob({
        key: "location",
        value: expLvl,
      })
    );
  };

  const locations = [
    {
      type: "NGN",
      action: () => handleLocationUpdate("NGN"),
    },
    {
      type: "USA",
      action: () => handleLocationUpdate("USA"),
    },
    { type: "INDIA", action: () => handleLocationUpdate("INDIA") },
    { type: "GHANA", action: () => handleLocationUpdate("GHANA") },
  ];

  const experiencesLevelDropdown = [
    {
      type: ExperienceLevel.ZERO,
      action: () => handleExpLvlUpdate(ExperienceLevel.ZERO),
    },
    {
      type: ExperienceLevel.GTE_ONE,
      action: () => handleExpLvlUpdate(ExperienceLevel.GTE_ONE),
    },
    {
      type: ExperienceLevel.GTE_FIVE,
      action: () => handleExpLvlUpdate(ExperienceLevel.GTE_FIVE),
    },
  ];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDate = e.target.value; // This is in YYYY-MM-DD format (from input[type="date"])

    if (!rawDate) return;

    const dateObj = new Date(rawDate);
    const formattedDate = `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;

    dispatch(
      updateNewJob({
        key: "date",
        value: formattedDate,
      })
    );
  };

  console.log("state data: ", jobAction.newJob);

  return (
    <div
      className="bg-background rounded-lg p-5 space-y-6 mt-4 mb-10"
      onClick={() => dispatch(resetDropdown())}
    >
      <div className="border-b border-b-gray/50 py-2">
        <h2 className="font-medium text-lg">Create New Job</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2 text-sm">
            <label htmlFor="title">Title</label>
            <input
              className="border border-gray/40 p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center rounded text-sm"
              type="text"
              value={jobAction.newJob?.title}
              onChange={(e) =>
                dispatch(
                  updateNewJob({
                    key: "title",
                    value: e.target.value,
                  })
                )
              }
              placeholder="Enter title"
              id="title"
              name="title"
            />
          </div>
          <div className="space-y-2 text-sm">
            <label htmlFor="job_type">Job Type</label>
            <input
              className="border border-gray/40 p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center rounded text-sm"
              type="text"
              value={jobAction.newJob?.job_type}
              onChange={(e) =>
                dispatch(
                  updateNewJob({
                    key: "job_type",
                    value: e.target.value,
                  })
                )
              }
              placeholder="Enter Job Type"
              id="job_type"
              name="job_type"
            />
          </div>
          <div className="space-y-2 text-sm">
            <label htmlFor="location">Location</label>
            <div
              onClick={() => dispatch(toggleDropdown(0))}
              className="border border-gray/40 cursor-pointer relative p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center justify-between rounded text-sm"
            >
              <p>
                {dropdown.dropdowns[0] && dropdown.dropdowns[0].content
                  ? (dropdown.dropdowns[0].content as string)
                  : "Select location"}
              </p>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.0008 15L7.75781 10.757L9.17281 9.34302L12.0008 12.172L14.8288 9.34302L16.2438 10.757L12.0008 15Z"
                  fill="#2D2929"
                />
              </svg>

              {dropdown.dropdowns[0] && dropdown.dropdowns[0].active && (
                <Dropdown items={locations} index={0} />
              )}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <label htmlFor="dept">Department</label>
            <input
              className="border border-gray/40 p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center rounded text-sm"
              type="text"
              placeholder="Enter Department"
              id="dept"
              name="dept"
              value={jobAction.newJob?.dept}
              onChange={(e) =>
                dispatch(
                  updateNewJob({
                    key: "dept",
                    value: e.target.value,
                  })
                )
              }
            />
          </div>
          <div className="space-y-2 text-sm">
            <label htmlFor="exp-level">Experience Level</label>
            <div
              onClick={() => dispatch(toggleDropdown(1))}
              className="border border-gray/40 cursor-pointer relative p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center justify-between rounded text-sm"
            >
              <p>
                {dropdown.dropdowns[1] && dropdown.dropdowns[1].content
                  ? (dropdown.dropdowns[1].content as string)
                  : "Select experience level"}
              </p>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.0008 15L7.75781 10.757L9.17281 9.34302L12.0008 12.172L14.8288 9.34302L16.2438 10.757L12.0008 15Z"
                  fill="#2D2929"
                />
              </svg>

              {dropdown.dropdowns[1] && dropdown.dropdowns[1].active && (
                <Dropdown items={experiencesLevelDropdown} index={1} />
              )}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <label htmlFor="start-date">Start Date</label>
            <input
              className="border border-gray/40 p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center rounded text-sm"
              type="date"
              id="start-date"
              name="start-date"
              value={
                jobAction.newJob?.date
                  ? new Date(jobAction.newJob.date).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <label htmlFor="desc">Job Description</label>
          {/* <textarea
            className="border border-gray/40 p-2 px-3 flex outline-none gap-4 h-[8rem] w-[60%] items-center rounded text-sm"
            placeholder="Enter Job Description"
            id="desc"
            name="desc"
            value={jobAction.newJob?.desc}
            onChange={(e) =>
              dispatch(
                updateNewJob({
                  key: "desc",
                  value: e.target.value,
                })
              )
            }
          /> */}
          <Editor />
        </div>

        <div className="space-y-2 text-sm">
          <label htmlFor="title">Add Media</label>
          <div className="h-[13rem] w-[60%] rounded-lg relative overflow-hidden bg-foreground/15 flex items-center justify-center cursor-pointer">
            {/* Image Preview */}
            {image && (
              <Image
                src={image}
                alt="Uploaded preview"
                width={100}
                height={100}
                className="w-full h-full object-cover absolute"
              />
            )}

            {/* Gray Overlay when image is selected */}
            {image && (
              <div className="absolute inset-0 bg-foreground/50 font-semibold bg-opacity-50 items-center justify-center text-white text-sm opacity-100 transition-opacity">
                Click to change image
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {/* Default Text When No Image is Selected */}
            {!image && (
              <span className="text-gray-500 flex flex-col justify-center items-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 11.1L7 9.1L12.5 14.6L16 11.1L19 14.1V5H5V11.1ZM4 3H20C20.2652 3 20.5196 3.10536 20.7071 3.29289C20.8946 3.48043 21 3.73478 21 4V20C21 20.2652 20.8946 20.5196 20.7071 20.7071C20.5196 20.8946 20.2652 21 20 21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V4C3 3.73478 3.10536 3.48043 3.29289 3.29289C3.48043 3.10536 3.73478 3 4 3ZM15.5 10C15.1022 10 14.7206 9.84196 14.4393 9.56066C14.158 9.27936 14 8.89782 14 8.5C14 8.10218 14.158 7.72064 14.4393 7.43934C14.7206 7.15804 15.1022 7 15.5 7C15.8978 7 16.2794 7.15804 16.5607 7.43934C16.842 7.72064 17 8.10218 17 8.5C17 8.89782 16.842 9.27936 16.5607 9.56066C16.2794 9.84196 15.8978 10 15.5 10Z"
                    fill="#575757"
                  />
                </svg>
                <p className="text-foreground/40 text-center">
                  Drag and drop your image here
                </p>
                <p className="text-foreground/60 font-semibold text-center">
                  Browse file
                </p>
              </span>
            )}
          </div>
        </div>

        <div className="w-full flex justify-end">
          <button
            onClick={() => dispatch(saveNewJob())}
            className="px-8 py-2 rounded-lg flex bg-accent items-center text-background gap-x-2"
          >
            Save Job
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
