"use client";
import React, { useEffect, useMemo, useState } from "react";
import HighlightCard from "../components/highlight_card";
import Search from "../components/search"; // Import Search component from its file
import JobTableRowCard from "../components/job_table_row_card";
import { RootState, AppDispatch } from "../reduxStore/store";
import JobDescriptionCard from "../components/job_description_card";
import { useDispatch, useSelector } from "react-redux";
import { JobAction, Status } from "../utils/customTypes";
import { resetDropdown } from "../reduxStore/dropdownSlice";
import { usePagination } from "../hooks/usePagination"; // Assuming this path is correct
import Link from "next/link";
import { fetchJobs } from "../reduxStore/thunks/jobThunk";
// Import both actions needed for selection/deselection
import { updateSelectedAction } from "../reduxStore/jobActionSlice"; // Ensure correct path

function Page() {
  // Select selectedJobId from state
  const { jobs, loading, error, selectedAction, selectedJobId } = useSelector((state: RootState) => state.jobAction); // Corrected state key
  const dispatch: AppDispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Jobs on Mount
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Calculate Counts for Highlight Cards
  const jobCounts = useMemo(() => {
    // Ensure jobs is an array before reducing
    if (!Array.isArray(jobs)) return { open: 0, closed: 0, drafts: 0, total: 0 };
    return jobs.reduce(
      (acc, job) => {
        if (job.status === Status.OPEN) acc.open++;
        else if (job.status === Status.CLOSED) acc.closed++;
        else if (job.status === Status.DRAFT) acc.drafts++;
        acc.total++;
        return acc;
      },
      { open: 0, closed: 0, drafts: 0, total: 0 }
    );
  }, [jobs]);

  // Filter Jobs based on Search Term
   const filteredJobs = useMemo(() => {
    // Ensure jobs is an array
    if (!Array.isArray(jobs)) return [];
    if (!searchTerm.trim()) { // Trim search term
      return jobs;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    // Ensure all fields exist before calling toLowerCase
    return jobs.filter(job =>
      (job.title?.toLowerCase() || '').includes(lowerSearchTerm) ||
      (job.dept?.toLowerCase() || '').includes(lowerSearchTerm) ||
      (job.location?.toLowerCase() || '').includes(lowerSearchTerm)
    );
  }, [jobs, searchTerm]);

  // Pagination
  const itemsPerPage = 5; // Or your desired number
  // --- Corrected usePagination call ---
  const { currentPage, totalPages, nextPage, prevPage } = usePagination({
    totalItems: filteredJobs.length, // Pass the total count of filtered items
    itemsPerPage,
  });
  

  // --- Calculate currentData manually ---
  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    // Ensure filteredJobs is an array before slicing
    return Array.isArray(filteredJobs) ? filteredJobs.slice(firstPageIndex, lastPageIndex) : [];
  }, [currentPage, itemsPerPage, filteredJobs]);


  // Find Selected Job using selectedJobId from Redux state
  const selectedJobData = useMemo(() => {
      // Ensure jobs is an array
      if (selectedJobId && Array.isArray(jobs)) {
          return jobs.find(job => job._id === selectedJobId);
      }
      return null;
  }, [selectedJobId, jobs]);

  // Handler to close the description card
  const handleCloseDescription = () => {
      dispatch(updateSelectedAction(null)); // This should also clear selectedJobId in the reducer logic
      // If not, uncomment the line below:
      // dispatch(setSelectedJobId(null));
  };


  return (
    <>
      {/* Main Content Area */}
      <div
        className="space-y-6 pt-8 min-h-[calc(100vh-5rem)] mb-10 px-4 md:px-6 lg:px-8" // Added padding
        onClick={() => dispatch(resetDropdown())} // Close dropdowns on background click
      >
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4"> {/* Added flex-wrap and gap */}
          <h2 className="font-medium text-lg md:text-xl">Jobs Dashboard</h2> {/* Responsive text */}
          <Link href={"/new-job"}>
            <button className="px-3 pr-5 py-2 rounded-lg flex bg-accent items-center text-background gap-x-2 hover:bg-accent-dark transition-colors text-sm md:text-base"> {/* Responsive text */}
              {/* Add Icon SVG */}
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
              <p>New Job</p>
            </button>
          </Link>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"> {/* Responsive grid */}
            <HighlightCard subtext="Open Job Listings" text={jobCounts.open.toString()} />
            <HighlightCard subtext="Closed Job Listings" text={jobCounts.closed.toString()} />
            <HighlightCard subtext="Drafts" text={jobCounts.drafts.toString()} />
            {/* <HighlightCard subtext="Total Jobs" text={jobCounts.total.toString()} /> */}
        </div>

        {/* Job Table Section */}
        <div className="bg-background p-4 md:p-5 space-y-6 rounded-lg shadow-md"> {/* Added shadow-md */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h4 className="text-lg font-medium">All Jobs ({jobCounts.total})</h4>
            <div className="flex flex-wrap gap-2 md:gap-x-4 items-center"> {/* Adjusted gap */}
              {/* Use imported Search component */}
              <Search
                height="2.5rem" // Consistent height
                width="16rem" // Adjusted width
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white" // Pass specific classes if needed
              />
              {/* Filter Button */}
              <button className="flex gap-x-2 items-center border border-gray/30 h-[2.5rem] px-3 md:px-4 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                <p>Filter</p>
                {/* Filter Icon SVG */}
                <svg className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 019 17v-5.586L4.293 6.707A1 1 0 014 6V3z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </div>

          {/* Loading and Error States */}
          {loading && <div className="text-center p-6 text-gray-500">Loading jobs...</div>}
          {error && <div className="text-center p-6 text-red-600 bg-red-50 rounded border border-red-200">Error: {error}</div>}

          {/* Job Table */}
          {!loading && !error && (
            <div className="overflow-x-auto"> {/* Added overflow for smaller screens */}
              {/* Table Header */}
              <ul className="flex bg-gray-100 rounded-t min-w-[700px] sticky top-0 z-10"> {/* Min width & sticky header */}
                <li className="py-2 text-sm font-semibold px-2 w-[5%] text-center flex-shrink-0"> {/* flex-shrink-0 */}
                    {/* Optional: Master checkbox */}
                    {/* <input type="checkbox" className="h-4 w-4 accent-accent" /> */}
                </li>
                <li className="py-2 text-sm font-semibold px-2 w-[25%] flex-shrink-0">Job Title</li>
                <li className="py-2 text-sm font-semibold px-2 w-[15%] flex-shrink-0">Department</li>
                <li className="py-2 text-sm font-semibold px-2 w-[20%] flex-shrink-0">Location</li>
                <li className="py-2 text-sm font-semibold px-2 w-[20%] flex-shrink-0">Description</li>
                <li className="py-2 text-sm font-semibold px-2 w-[10%] flex-shrink-0">Status</li>
                <li className="py-2 text-sm font-semibold px-2 w-[5%] flex-shrink-0"></li> {/* Actions */}
              </ul>
              {/* Table Body */}
              <div className="min-w-[700px]"> {/* Min width for horizontal scroll */}
                {/* --- Use calculated currentData here --- */}
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <JobTableRowCard
                      key={item._id || index} // Use unique _id as key
                      job={item}
                      // Pass the global index for dropdown management
                      index={(currentPage - 1) * itemsPerPage + index}
                    />
                  ))
                ) : (
                  <div className="text-center p-6 text-gray-500">No jobs found matching your criteria.</div>
                )}
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center md:justify-end pt-4"> {/* Centered on small screens */}
                  <div className="flex items-center space-x-2 md:space-x-4">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      aria-label="Go to previous page" // Added aria-label
                      className={`px-3 py-1 rounded text-sm border transition-colors ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      aria-label="Go to next page" // Added aria-label
                       className={`px-3 py-1 rounded text-sm border transition-colors ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Conditionally Render JobDescriptionCard */}
      {/* Check selectedJobData exists before rendering */}
      {selectedAction === JobAction.VIEW_JOB && selectedJobData && (
          <JobDescriptionCard
              job={selectedJobData}
              onClose={handleCloseDescription} // Pass the close handler
          />
      )}
    </>
  );
}

export default Page;
