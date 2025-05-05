"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Dropdown from "../components/dropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  resetDropdown,
  toggleDropdown,
  updateDropdownContent,
} from "../reduxStore/dropdownSlice";
import { RootState } from "../reduxStore/store";
import { ExperienceLevel, JobData, Status } from "../utils/customTypes";
import { createJob } from "../reduxStore/thunks/jobThunk";
// Corrected import path for clearJobError
import { clearJobError } from "../reduxStore/jobActionSlice"; // Assuming jobActionSlice.ts is the correct file name
import { Editor } from "../components/editor"; // Ensure this path is correct
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppDispatch } from "../reduxStore/store";

function Page() {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const dropdown = useSelector((state: RootState) => state.dropdown);
  // Corrected selector to use 'jobAction' based on previous error
  const { submitting, error } = useSelector(
    (state: RootState) => state.jobAction
  );

  const [newJob, setNewJob] = useState<Partial<JobData>>({
    status: Status.DRAFT, // Default status
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Clear Redux error on component mount/unmount
  useEffect(() => {
    dispatch(clearJobError());
    return () => {
      dispatch(clearJobError());
    };
  }, [dispatch]);

  // Generic input handler
  const handleInputChange = (
    key: keyof JobData,
    value: string | ExperienceLevel | Status
  ) => {
    setNewJob((prevJob) => ({
      ...prevJob,
      [key]: value,
    }));
  };

  // Image change handler with preview cleanup
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview); // Clean up previous URL
      }
      setImagePreview(previewUrl);
    } else {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview); // Clean up if file is removed
      }
      setImageFile(null);
      setImagePreview(null);
    }
  };

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Dropdown update handlers
  const handleLocationUpdate = (location: string) => {
    handleInputChange("location", location);
    dispatch(updateDropdownContent({ id: 0, content: location }));
  };

  const handleExpLvlUpdate = (expLvl: ExperienceLevel) => {
    handleInputChange("experience", expLvl);
    dispatch(updateDropdownContent({ id: 1, content: expLvl }));
  };

  // Date change handler
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawDate = e.target.value; // Keeps YYYY-MM-DD format
    handleInputChange("date", rawDate);
  };

  // Editor change handler
  const handleDescriptionChange = (content: string) => {
    handleInputChange("desc", content);
  };

  // Dropdown data definitions
  const locations = [
    { type: "NGN", action: () => handleLocationUpdate("NGN") },
    { type: "USA", action: () => handleLocationUpdate("USA") },
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

  // Form submission handler
  const handleSaveJob = async () => {
    // Basic Validation
    const requiredFields: (keyof JobData)[] = [
      "title",
      "dept",
      "location",
      "experience",
      "date",
      "desc",
    ];
    const missingFields = requiredFields.filter((field) => !newJob[field]);

    if (missingFields.length > 0) {
      // Consider using a toast library for better UX
      alert(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    // Create FormData
    const formData = new FormData();
    Object.entries(newJob).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string); // Append non-null/undefined values
      }
    });
    if (imageFile) {
      formData.append("image", imageFile); // Append image file if exists
    }

    // Dispatch createJob thunk
    try {
      await dispatch(createJob(formData)).unwrap(); // Use unwrap for direct error handling
      // Success: Reset form state, clear dropdowns, navigate
      setNewJob({ status: Status.DRAFT });
      setImageFile(null);
      setImagePreview(null);
      dispatch(resetDropdown());
      // Optionally show a success message/toast
      router.push("/dashboard"); // Redirect after successful creation
    } catch (rejectedValueOrSerializedError) {
      // Error is already set in Redux state by the thunk's rejection
      console.error("Failed to create job:", rejectedValueOrSerializedError);
      // Optionally show an error toast here
    }
  };

  return (
    // Main container prevents dropdown closing when clicking inside form
    <div
      className="bg-background rounded-lg p-5 space-y-6 mt-4 mb-10"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Error Display Area */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => dispatch(clearJobError())}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            aria-label="Close error"
          >
            {/* Close Icon SVG */}
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </button>
        </div>
      )}

      {/* Form Header */}
      <div className="border-b border-b-gray/50 py-2">
        <h2 className="font-medium text-lg">Create New Job</h2>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Grid for top fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Title */}
          <div className="space-y-2 text-sm">
            <label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="border border-gray/40 p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center rounded text-sm"
              placeholder="Enter title"
              value={newJob.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>
          {/* Job Type */}
          <div className="space-y-2 text-sm">
            <label htmlFor="job_type">Job Type</label>
            <input
              id="job_type"
              name="job_type"
              type="text"
              className="border border-gray/40 p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center rounded text-sm"
              placeholder="e.g., Full-time, Contract"
              value={newJob.job_type || ""}
              onChange={(e) => handleInputChange("job_type", e.target.value)}
            />
          </div>
          {/* Add Submission Link Field Here */}
          <div className="space-y-2 text-sm">
            <label htmlFor="submission_link">Submission Link</label>{" "}
            {/* Add * if required */}
            <input
              id="submission_link"
              name="submission_link"
              type="url" // Use type="url" for better mobile keyboards and basic validation
              className="border border-gray/40 p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center rounded text-sm"
              placeholder="Enter submission URL"
              value={newJob.submission_link || ""}
              onChange={(e) =>
                handleInputChange("submission_link", e.target.value)
              }
              // Add required if submission_link is required
              // required={true}
            />
          </div>
          {/* Location Dropdown */}
          <div className="space-y-2 text-sm">
            <label htmlFor="location-dropdown">
              Location <span className="text-red-500">*</span>
            </label>
            <div
              id="location-dropdown"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleDropdown(0));
              }}
              className="border border-gray/40 cursor-pointer relative p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center justify-between rounded text-sm"
              role="button" // Added role
              aria-haspopup="listbox" // Added aria attribute
            >
              <p>{newJob.location || "Select location"}</p>
              {/* Arrow Icon SVG */}
              <svg
                className="h-5 w-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {dropdown.dropdowns[0]?.active && (
                <Dropdown items={locations} index={0} />
              )}
            </div>
          </div>
          {/* Department */}
          <div className="space-y-2 text-sm">
            <label htmlFor="dept">
              Department <span className="text-red-500">*</span>
            </label>
            <input
              id="dept"
              name="dept"
              type="text"
              className="border border-gray/40 p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center rounded text-sm"
              placeholder="e.g., Engineering, Marketing"
              value={newJob.dept || ""}
              onChange={(e) => handleInputChange("dept", e.target.value)}
              required
            />
          </div>
          {/* Experience Level Dropdown */}
          <div className="space-y-2 text-sm">
            <label htmlFor="exp-level-dropdown">
              Experience Level <span className="text-red-500">*</span>
            </label>
            <div
              id="exp-level-dropdown"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleDropdown(1));
              }}
              className="border border-gray/40 cursor-pointer relative p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center justify-between rounded text-sm"
              role="button"
              aria-haspopup="listbox"
            >
              <p>{newJob.experience || "Select experience level"}</p>
              {/* Arrow Icon SVG */}
              <svg
                className="h-5 w-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {dropdown.dropdowns[1]?.active && (
                <Dropdown items={experiencesLevelDropdown} index={1} />
              )}
            </div>
          </div>
          {/* Start Date */}
          <div className="space-y-2 text-sm">
            <label htmlFor="start-date">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              id="start-date"
              name="start-date"
              type="date"
              className="border border-gray/40 p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center rounded text-sm"
              value={newJob.date || ""} // Expects YYYY-MM-DD
              onChange={handleDateChange}
              required
            />
          </div>
        </div>

        {/* Job Description Editor */}
        <div className="space-y-2 text-sm">
          <label htmlFor="desc">
            Job Description <span className="text-red-500">*</span>
          </label>
          <Editor
            value={newJob.desc || ""}
            onChange={handleDescriptionChange}
            placeholder="Enter job description..."
            width="100%"
            // height="15rem" // Optionally set height
          />
        </div>

        {/* Media Upload */}
        <div className="space-y-2 text-sm">
          <label htmlFor="image-upload">Add Media (Optional)</label>
          <div className="h-[13rem] w-full md:w-[60%] rounded-lg relative overflow-hidden bg-foreground/15 flex items-center justify-center border border-dashed border-gray-400">
            {/* Image Preview */}
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Uploaded preview"
                layout="fill"
                objectFit="cover"
                className="absolute"
              />
            )}
            {/* Overlay for changing image */}
            {imagePreview && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-sm opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                Click to change image
              </div>
            )}
            {/* Hidden File Input */}
            <input
              id="image-upload"
              type="file"
              accept="image/*" // Accept only image files
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {/* Default Text/Icon */}
            {!imagePreview && (
              <span className="text-gray-500 flex flex-col justify-center items-center text-center p-4">
                {/* Upload Icon SVG */}
                <svg
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-foreground/40 mt-2 text-sm">
                  Drag and drop your image here or
                </p>
                <p className="text-accent font-semibold cursor-pointer text-sm">
                  Browse file
                </p>
              </span>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="w-full flex justify-end pt-4">
          <button
            onClick={handleSaveJob}
            disabled={submitting} // Disable button while submitting
            className={`px-8 py-2 rounded-lg flex justify-center items-center min-w-[100px] bg-accent text-background gap-x-2 ${
              // Added min-width
              submitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-accent-dark transition-colors"
            }`}
          >
            {submitting ? (
              // Simple spinner
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Save Job"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
