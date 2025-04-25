import React from "react";
import StatusCard from "./status_card";
import { JobData } from "../utils/customTypes"; // Import JobData
import Image from "next/image";

interface JobDescriptionProps {
    job: JobData;
    onClose: () => void; // Function to close the card
}

function JobDescriptionCard({ job, onClose }: JobDescriptionProps) {
  // Removed dispatch

  // Format date if needed
  const formattedDate = job.date ? new Date(job.date).toLocaleDateString() : 'N/A';
  const createdAtDate = job.createdAt ? new Date(job.createdAt).toLocaleString() : 'N/A';

  return (
    // Overlay
    <div className="fixed inset-0 z-40 bg-black bg-opacity-40 flex justify-end" onClick={onClose}>
      {/* Card Content - Stop propagation to prevent closing when clicking inside */}
      <div
        className="fixed top-0 right-0 overflow-y-auto pb-6 h-screen space-y-6 w-full max-w-md md:max-w-lg bg-background px-4 shadow-lg" // Responsive width
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-b-gray/30 py-4 sticky top-0 bg-background z-10">
          <div className="flex gap-x-3 items-center">
            <h2 className="text-lg font-semibold">Job Description</h2>
            <StatusCard type={job.status} />
          </div>
          <button onClick={onClose} aria-label="Close job description"> {/* Use button for accessibility */}
            <svg /* Close Icon */ >...</svg>
          </button>
        </div>

        {/* Job Title and Date */}
        <div className="space-y-1 pt-2">
          <h2 className="text-xl font-semibold">{job.title}</h2>
          <p className="text-sm text-foreground/50">
            Posted: {createdAtDate}
          </p>
        </div>

        {/* Application Tracking (Example - Data needs to come from somewhere) */}
        {/* <div>
          <title>Application Tracking</title>
          <div className="flex justify-between space-y-4 xl:space-y-0 xl:space-x-6 flex-wrap xl:flex-nowrap">
            <HighlightCard subtext={"Applications"} text={"N/A"} />
            <HighlightCard subtext={"Interviews"} text={"N/A"} />
            <HighlightCard subtext={"Offers"} text={"N/A"} />
          </div>
        </div> */}

        {/* Description */}
        <div className="space-y-1">
          <h3 className="font-semibold">Description</h3>
          {/* Render HTML content safely if job.desc contains HTML */}
          <div
            className="text-sm text-foreground/70 prose max-w-none" // Use prose for basic HTML styling
            dangerouslySetInnerHTML={{ __html: job.desc || "" }}
          />
          {/* Or if it's plain text: */}
          {/* <p className="text-sm text-foreground/70 whitespace-pre-wrap">{job.desc}</p> */}
        </div>

        {/* Media */}
        {job.image && (
          <div className="space-y-2">
            <h3 className="font-semibold">Media</h3>
            <div className="h-[13rem] rounded-lg relative overflow-clip bg-gray-200"> {/* Added bg color */}
              <Image
                src={job.image} // Use image from job data
                layout="fill"
                objectFit="cover"
                className="absolute"
                alt={`Image for ${job.title}`}
              />
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
          <div>
            <h3 className="font-semibold text-sm">Start date</h3>
            <p className="text-foreground/70 text-sm">{formattedDate}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Location</h3>
            <p className="text-foreground/70 text-sm">{job.location}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Department</h3>
            <p className="text-foreground/70 text-sm">{job.dept}</p>
          </div>
           <div>
            <h3 className="font-semibold text-sm">Experience</h3>
            <p className="text-foreground/70 text-sm">{job.experience}</p>
          </div>
           <div>
            <h3 className="font-semibold text-sm">Job Type</h3>
            <p className="text-foreground/70 text-sm">{job.job_type || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDescriptionCard;
