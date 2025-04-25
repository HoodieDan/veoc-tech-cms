"use client";
import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reduxStore/store";
// --- Fixed dropdownSlice import ---
import { resetDropdown, toggleDropdown, updateDropdownContent } from "../../reduxStore/dropdownSlice";
import { ExperienceLevel, JobData, Status } from "../../utils/customTypes";
import { updateJob, fetchJobById } from "../../reduxStore/thunks/jobThunk";
import { clearJobError } from "../../reduxStore/jobActionSlice";
import { Editor } from "../../components/editor";
import Image from "next/image";
import Dropdown from "../../components/dropdown";

function EditJobPage() {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const dropdown = useSelector((state: RootState) => state.dropdown);
  const { submitting, error } = useSelector((state: RootState) => state.jobAction); // Ensure 'jobAction' is the correct key

  const [editJob, setEditJob] = useState<Partial<JobData>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [initialImage, setInitialImage] = useState<string | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState(true);



  // --- Define Dropdown Data (COPY FROM new-job/page.tsx) ---
  // Placeholder - Replace with your actual definitions
  const locations = [
    { type: "NGN", action: () => handleLocationUpdate("NGN") },
    { type: "USA", action: () => handleLocationUpdate("USA") },
    { type: "INDIA", action: () => handleLocationUpdate("INDIA") },
    { type: "GHANA", action: () => handleLocationUpdate("GHANA") },
  ];
  const experiencesLevelDropdown = [
    { type: ExperienceLevel.ZERO, action: () => handleExpLvlUpdate(ExperienceLevel.ZERO) },
    { type: ExperienceLevel.GTE_ONE, action: () => handleExpLvlUpdate(ExperienceLevel.GTE_ONE) },
    { type: ExperienceLevel.GTE_FIVE, action: () => handleExpLvlUpdate(ExperienceLevel.GTE_FIVE) },
  ];
  // --- End Dropdown Data ---


  // --- Fetch Job Data ---
  const loadJobData = useCallback(async () => {
    if (!jobId) return;
    setIsLoadingJob(true);
    dispatch(clearJobError());
    dispatch(resetDropdown()); // Reset dropdowns when loading new data

    try {
      // Prefer fetching directly for edit pages to ensure fresh data
      const fetchedJob = await dispatch(fetchJobById(jobId)).unwrap();
      setEditJob(fetchedJob);
      setInitialImage(fetchedJob.image || null);
      setImagePreview(fetchedJob.image || null);

      // --- Initialize dropdown display text ---
      if (fetchedJob.location) {
        dispatch(updateDropdownContent({ id: 0, content: fetchedJob.location }));
      }
      if (fetchedJob.experience) {
        dispatch(updateDropdownContent({ id: 1, content: fetchedJob.experience }));
      }

    } catch (fetchError) {
      console.error("Failed to fetch job:", fetchError);
      // Error state is set by the thunk, maybe redirect or show specific error UI
      // router.push('/dashboard'); // Example: redirect if job not found
    } finally {
      setIsLoadingJob(false);
    }
  }, [jobId, dispatch]); // Removed 'jobs' dependency as we fetch directly

  useEffect(() => {
    loadJobData();
  }, [loadJobData]);


  // --- Handlers ---
  const handleInputChange = (
    key: keyof JobData,
    value: string | ExperienceLevel | Status
  ) => {
    setEditJob((prevJob) => ({
      ...prevJob,
      [key]: value,
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const currentPreview = imagePreview; // Store current preview before changing

    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl); // Show preview of the NEW image
      // Revoke previous object URL if it was one
      if (currentPreview && currentPreview.startsWith('blob:')) {
        URL.revokeObjectURL(currentPreview);
      }
    } else {
      // If cleared, revert preview to initial image or null
      setImageFile(null);
      setImagePreview(initialImage); // Revert to original image on clear
      // Revoke previous object URL if it was one
      if (currentPreview && currentPreview.startsWith('blob:')) {
        URL.revokeObjectURL(currentPreview);
      }
    }
  };
  const handleRemoveImage = () => {
    const currentPreview = imagePreview;
    setImageFile(null); // Clear any selected file
    setImagePreview(null); // Clear the preview
    // Revoke URL if it was a blob
    if (currentPreview && currentPreview.startsWith('blob:')) {
      URL.revokeObjectURL(currentPreview);
    }
    // Reset the file input visually (optional but good UX)
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = "";
    }
};
  // Cleanup object URL on unmount
  useEffect(() => {
    // Check if imagePreview is a blob URL before revoking
    const isObjectURL = imagePreview && imagePreview.startsWith('blob:');
    return () => {
      if (isObjectURL) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]); // Depend only on imagePreview



  const handleLocationUpdate = (location: string) => {
    handleInputChange("location", location);
    dispatch(updateDropdownContent({ id: 0, content: location }));
  };

  const handleExpLvlUpdate = (expLvl: ExperienceLevel) => {
    handleInputChange("experience", expLvl);
    dispatch(updateDropdownContent({ id: 1, content: expLvl }));
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleInputChange("date", e.target.value); // Store as YYYY-MM-DD
  };

  const handleDescriptionChange = (content: string) => {
    handleInputChange("desc", content);
  };

  // --- Form Submission Handler ---
  const handleUpdateJob = async () => {
    if (!jobId) return;

    const requiredFields: (keyof JobData)[] = ['title', 'dept', 'location', 'experience', 'date', 'desc'];
    const missingFields = requiredFields.filter(field => !editJob[field]);
    if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
    }

    const formData = new FormData();
    Object.entries(editJob).forEach(([key, value]) => {
        if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && value !== undefined && value !== null) {
             formData.append(key, value as string);
        }
    });

    if (imageFile) { // Only append if a new file was selected
      formData.append("image", imageFile);
    }
    // Note: Backend needs logic to handle image removal if imageFile is null and initialImage existed

    try {
      await dispatch(updateJob({ id: jobId, formData })).unwrap();
      // Optionally show success message/toast
      router.push("/dashboard");
    } catch (rejectedValueOrSerializedError) {
      console.error("Failed to update job:", rejectedValueOrSerializedError);
      // Error state is handled globally
    }
  };

  // --- Loading State UI ---
  if (isLoadingJob) {
      return <div className="p-10 text-center text-gray-600">Loading job details...</div>;
  }

  // --- Render Form ---
  return (
    <div
      className="bg-background rounded-lg p-5 space-y-6 mt-4 mb-10"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Error Display */}
      {error && (
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{typeof error === 'string' ? error : 'An unknown error occurred'}</span>
            <button
              onClick={() => dispatch(clearJobError())}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              aria-label="Close error"
            >
              {/* Close Icon SVG */}
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </button>
         </div>
      )}

      {/* Form Header */}
      <div className="border-b border-b-gray/50 py-2">
        <h2 className="font-medium text-lg">Edit Job: {editJob.title || ''}</h2>
      </div>

      {/* Form Fields - Use `editJob` state for values */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Title */}
          <div className="space-y-2 text-sm">
            <label htmlFor="title">Title <span className="text-red-500">*</span></label>
            <input
              id="title" name="title" type="text"
              className="border border-gray/40 p-2 px-3 h-[2.5rem] w-full rounded text-sm focus:ring-accent focus:border-accent" // Added focus styles
              placeholder="Enter title"
              value={editJob.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>
          {/* Job Type */}
          <div className="space-y-2 text-sm">
            <label htmlFor="job_type">Job Type</label>
            <input
              id="job_type" name="job_type" type="text"
              className="border border-gray/40 p-2 px-3 h-[2.5rem] w-full rounded text-sm focus:ring-accent focus:border-accent"
              placeholder="e.g., Full-time, Contract"
              value={editJob.job_type || ""}
              onChange={(e) => handleInputChange("job_type", e.target.value)}
            />
          </div>
          {/* Location Dropdown */}
          <div className="space-y-2 text-sm">
             <label htmlFor="location-dropdown">Location <span className="text-red-500">*</span></label>
             <div id="location-dropdown" onClick={(e) => { e.stopPropagation(); dispatch(toggleDropdown(0)); }}
                  className="border border-gray/40 cursor-pointer relative p-2 px-3 h-[2.5rem] w-full flex items-center justify-between rounded text-sm"
                  role="button" aria-haspopup="listbox">
                {/* Display selected value from dropdown state for consistency */}
                <p>{String(dropdown.dropdowns[0]?.content ?? editJob.location ?? "Select location")}</p>
                <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                {dropdown.dropdowns[0]?.active && (
                   <Dropdown items={locations} index={0} />
                )}
             </div>
          </div>
          {/* Department */}
          <div className="space-y-2 text-sm">
             <label htmlFor="dept">Department <span className="text-red-500">*</span></label>
             <input id="dept" name="dept" type="text"
                    className="border border-gray/40 p-2 px-3 h-[2.5rem] w-full rounded text-sm focus:ring-accent focus:border-accent"
                    placeholder="e.g., Engineering, Marketing"
                    value={editJob.dept || ""}
                    onChange={(e) => handleInputChange("dept", e.target.value)}
                    required />
          </div>
          {/* Experience Level Dropdown */}
          <div className="space-y-2 text-sm">
             <label htmlFor="exp-level-dropdown">Experience Level <span className="text-red-500">*</span></label>
             <div id="exp-level-dropdown" onClick={(e) => { e.stopPropagation(); dispatch(toggleDropdown(1)); }}
                  className="border border-gray/40 cursor-pointer relative p-2 px-3 h-[2.5rem] w-full flex items-center justify-between rounded text-sm"
                  role="button" aria-haspopup="listbox">
                 {/* Display selected value from dropdown state for consistency */}
                <p>{String(dropdown.dropdowns[1]?.content || editJob.experience || "Select experience level")}</p>
                <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                {dropdown.dropdowns[1]?.active && (
                   <Dropdown items={experiencesLevelDropdown} index={1} />
                )}
             </div>
          </div>
          {/* Start Date */}
          <div className="space-y-2 text-sm">
             <label htmlFor="start-date">Start Date <span className="text-red-500">*</span></label>
             <input id="start-date" name="start-date" type="date"
                    className="border border-gray/40 p-2 px-3 h-[2.5rem] w-full rounded text-sm focus:ring-accent focus:border-accent"
                    // --- Simplified date value ---
                    value={editJob.date || ""} // Assumes date is stored as YYYY-MM-DD
                    onChange={handleDateChange}
                    required />
          </div>
        </div>

        {/* Job Description Editor */}
        <div className="space-y-2 text-sm">
          <label htmlFor="desc">Job Description <span className="text-red-500">*</span></label>
          {/* Ensure Editor component is correctly imported and used */}
          <Editor
            value={editJob.desc || ""}
            onChange={handleDescriptionChange}
            placeholder="Enter job description..."
            width="100%"
          />
        </div>

        {/* Media Upload */}
        <div className="space-y-2 text-sm">
          <label htmlFor="image-upload">Media (Optional)</label>
          <div className="h-[13rem] w-full md:w-[60%] rounded-lg relative overflow-hidden bg-foreground/15 flex items-center justify-center border border-dashed border-gray-400">
             {/* Image Preview */}
             {imagePreview && (
                <Image src={imagePreview} alt="Job image preview" layout="fill" objectFit="cover" className="absolute" />
             )}
             {/* Overlay */}
             {imagePreview && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-sm opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                   Click to change image
                </div>
             )}
             {/* Hidden Input */}
             <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
             {/* Default Text/Icon */}
             {!imagePreview && (
                <span className="text-gray-500 flex flex-col justify-center items-center text-center p-4">
                   <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   <p className="text-foreground/40 mt-2 text-sm">Drag and drop image or</p>
                   <p className="text-accent font-semibold cursor-pointer text-sm">Browse file</p>
                </span>
             )}
          </div>
          {imagePreview && ( // Only show if there's an image preview
            <button
                type="button" // Prevent form submission
                onClick={handleRemoveImage}
                className="mt-2 px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting || isLoadingJob} // Disable while loading/submitting
            >
                Remove Image
            </button>
          )}
        </div>

        {/* Update Button */}
        <div className="w-full flex justify-end pt-4">
          <button
            onClick={handleUpdateJob}
            disabled={submitting || isLoadingJob}
            className={`px-8 py-2 rounded-lg flex justify-center items-center min-w-[120px] bg-accent text-background gap-x-2 ${
              (submitting || isLoadingJob) ? "opacity-50 cursor-not-allowed" : "hover:bg-accent-dark transition-colors"
            }`}
          >
            {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
                "Update Job"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditJobPage;
