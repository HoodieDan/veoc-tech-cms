import { NextRequest, NextResponse } from "next/server";
import { extractPublicId } from "cloudinary-build-url";
import mongoose from "mongoose";

import connectDB from "../../utils/db";
import { Job } from "../../../lib/models/job";
import cloudinary from "../../utils/cloudinary";


const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const jobId = (await params).id;

  if (!isValidObjectId(jobId)) {
    return NextResponse.json({ message: "Invalid Job ID format" }, { status: 400 });
  }

  try {
    const existingJob = await Job.findById(jobId);
    if (!existingJob) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    const formData = await req.formData();
    console.log(formData);
    
    const updateData: Record<string, string> = {};
    let imageToDeleteId: string | null = null;

    for (const [key, value] of formData.entries()) {
        console.log(key, value);
        
      if (key === "image") {
        if (value instanceof File && value.size > 0) {
          const arrayBuffer = await value.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Image = `data:${value.type};base64,${buffer.toString("base64")}`;

          try {
            const uploadResponse = await cloudinary.uploader.upload(base64Image, { folder: "veoc" });
            updateData.image = uploadResponse.secure_url;

            if (existingJob.image) {
              try {
                imageToDeleteId = extractPublicId(existingJob.image);
              } catch (e) {
                console.warn("Could not extract public ID from existing image:", e);
              }
            }
          } catch (uploadError) {
            console.error("Cloudinary upload failed:", uploadError);
            return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
          }
        } else if (typeof value === "string" && value === "") {
          updateData.image = "";

          if (existingJob.image) {
            try {
              imageToDeleteId = extractPublicId(existingJob.image);
            } catch (e) {
              console.warn("Could not extract public ID for deletion:", e);
            }
          }
        }
      } else {
        
        updateData[key] = value as string;
      }
    }

    const updatePayload = { $set: updateData };
    const updatedJob = await Job.findByIdAndUpdate(jobId, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) {
      return NextResponse.json({ message: "Job not found during update" }, { status: 404 });
    }

    if (imageToDeleteId) {
      try {
        console.log(`Deleting Cloudinary image: ${imageToDeleteId}`);
        await cloudinary.uploader.destroy(imageToDeleteId);
      } catch (deleteError) {
        console.error(`Failed to delete Cloudinary image ${imageToDeleteId}:`, deleteError);
      }
    }

    return NextResponse.json(updatedJob, { status: 200 });
  } catch (error) {
    console.error("Error updating job:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: "Validation Error", errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "An error occurred while updating the job." }, { status: 500 });
  }
}



export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) { // Use RouteParams
    await connectDB();
    const jobId = (await params).id as string; // Use params.id

    // --- ID Validation ---
    if (!isValidObjectId(jobId)) {
        return NextResponse.json({ message: "Invalid Job ID format" }, { status: 400 });
    }

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        return NextResponse.json(job, { status: 200 });

    } catch (error) {
        console.error("Error fetching job:", error);
         // Return a generic server error message
        return NextResponse.json({ message: "An error occurred while fetching the job." }, { status: 500 });
    }
}

// DELETE request to remove a job by ID
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) { // Use RouteParams
    await connectDB();
    const jobId = (await params).id as string; // Use params.id

     // --- ID Validation ---
    if (!isValidObjectId(jobId)) {
        return NextResponse.json({ message: "Invalid Job ID format" }, { status: 400 });
    }

    try {
        const job = await Job.findByIdAndDelete(jobId);
        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        // Delete image only if it exists
        if (job.image) {
             try {
                const publicId = extractPublicId(job.image);
                if (publicId) {
                    console.log(`Deleting Cloudinary image: ${publicId}`);
                    await cloudinary.uploader.destroy(publicId);
                }
             } catch (e) {
                 console.error(`Failed to extract public ID or delete Cloudinary image for ${jobId}:`, e);
                 // Log error but proceed, as DB record is deleted.
             }
        }

        return NextResponse.json({ message: "Job deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error deleting job:", error);
        // Return a generic server error message
        return NextResponse.json({ message: "An error occurred while deleting the job." }, { status: 500 });
    }
}
