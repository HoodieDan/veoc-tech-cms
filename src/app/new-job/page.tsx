"use client";
import React, { useState } from "react";
import Dropdown from "../components/dropdown";
import { experiencesLevelDropdown, locations } from "../utils/mockData";
import { useDispatch, useSelector } from "react-redux";
import { resetDropdown, toggleDropdown } from "../reduxStore/dropdownSlice";
import { RootState } from "../reduxStore/store";

function Page() {
  const dispatch = useDispatch();
  const dropdown = useSelector((state: RootState) => state.dropdown);

  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

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
              placeholder="Enter title"
              id="title"
              name="title"
            />
          </div>
          <div className="space-y-2 text-sm">
            <label htmlFor="job-type">Job Type</label>
            <input
              className="border border-gray/40 p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center rounded text-sm"
              type="text"
              placeholder="Enter Job Type"
              id="job-type"
              name="job-type"
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
            <label htmlFor="department">Department</label>
            <input
              className="border border-gray/40 p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center rounded text-sm"
              type="text"
              placeholder="Enter Department"
              id="department"
              name="department"
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
            />
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <label htmlFor="job-descrption">Job Description</label>
          <textarea
            className="border border-gray/40 p-2 px-3 flex outline-none gap-4 h-[8rem] w-[60%] items-center rounded text-sm"
            placeholder="Enter Job Description"
            id="job-descrption"
            name="job-descrption"
          />
        </div>

        <div className="space-y-2 text-sm">
          <label htmlFor="title">Add Media</label>
          <div className="h-[13rem] w-[60%] rounded-lg relative overflow-hidden bg-foreground/15 flex items-center justify-center cursor-pointer">
            {/* Image Preview */}
            {image && (
              <img
                src={image}
                alt="Uploaded preview"
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
      </div>
    </div>
  );
}

export default Page;
