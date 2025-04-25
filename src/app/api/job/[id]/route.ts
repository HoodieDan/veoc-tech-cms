import { NextRequest, NextResponse } from "next/server";
import { extractPublicId } from "cloudinary-build-url";
import mongoose from "mongoose";

import connectDB from "../../utils/db";
import { Job } from "../../../lib/models/job";
import cloudinary from "../../utils/cloudinary";


const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const jobId = (await params).id as string;

    if (!isValidObjectId(jobId)) {
        return NextResponse.json({ message: "Invalid Job ID format" }, { status: 400 });
    }

    try {
        const existingJob = await Job.findById(jobId);
        if (!existingJob) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        const formData = await req.formData();
        const updateData: Record<string, string | File> = {};
        let newImageUrl: string | null = null;
        let oldImagePublicId: string | null = null;
        let hasNewImageFile = false; // Flag to track if a new file was processed

        if (existingJob.image) {
             try {
                oldImagePublicId = extractPublicId(existingJob.image);
             } catch (e) {
                console.warn("Could not extract public ID from existing image URL:", existingJob.image, e);
             }
        }

        // --- Process FormData ---
        for (const [key, value] of formData.entries()) {
            // Check specifically for a valid image file
            if (key === "image" && value instanceof File && value.size > 0) {
                hasNewImageFile = true; // Mark that we found a new file
                const arrayBuffer = await value.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                if (Buffer.isBuffer(buffer) && buffer.length > 0) {
                    const base64Image = `data:${value.type};base64,${buffer.toString("base64")}`;
                    try {
                        const uploadResponse = await cloudinary.uploader.upload(base64Image, { folder: "veoc" });
                        newImageUrl = uploadResponse.secure_url;
                        updateData.image = newImageUrl; // Set new image URL for DB update
                    } catch (uploadError) {
                         console.error("Cloudinary upload failed:", uploadError);
                         return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
                    }
                }
            }
            // Handle other fields (exclude the 'image' key itself here)
            else if (key !== "image") {
                 updateData[key] = value;
            }
        }

        // --- Handle Image Removal/Replacement Logic ---
        let imageToDeleteId: string | null = null;

        // Case 1: New image uploaded, replace old one if it exists
        if (hasNewImageFile && oldImagePublicId) {
            imageToDeleteId = oldImagePublicId; // Mark old image for deletion
        }
        // Case 2: No new image file submitted, but an old image exists -> Implicit Removal
        else if (!hasNewImageFile && oldImagePublicId) {
            updateData.image = ""; // Set image field to empty string in DB
            imageToDeleteId = oldImagePublicId; // Mark old image for deletion
        }
        // Case 3: New image uploaded, no old image -> newImageUrl set, imageToDeleteId null (Correct)
        // Case 4: No new image, no old image -> updateData.image unset, imageToDeleteId null (Correct)


        // --- Database Update ---
        // Check if any data actually changed or if an image needs deletion
        if (Object.keys(updateData).length === 0 && !imageToDeleteId) {
            // Nothing changed, return existing job
            return NextResponse.json(existingJob, { status: 200 });
        }

        // Prepare payload, ensuring image field is explicitly set if removing
        const updatePayload = Object.keys(updateData).length > 0
            ? { $set: updateData }
            : (imageToDeleteId ? { $set: { image: "" } } : {}); // Only set image if removing and no other updates

        // Avoid empty $set if only imageToDeleteId is set but updateData is empty
        if (Object.keys(updatePayload).length === 0 && imageToDeleteId) {
             // This case shouldn't happen with the logic above, but as a safeguard
             console.warn("Attempting update with only image deletion intent but no payload.");
             // Decide how to handle: maybe just proceed with deletion? For now, return existing.
             // Or proceed with an empty update if schema allows? Let's assume we need $set
             updatePayload.$set = { image: "" }; // Ensure payload exists if deleting
        }


        // Only perform update if there's a payload
        let updatedJob = existingJob; // Default to existing if no update needed
        if (Object.keys(updatePayload).length > 0 && updatePayload.$set && Object.keys(updatePayload.$set).length > 0) {
            updatedJob = await Job.findByIdAndUpdate(
                jobId,
                updatePayload,
                { new: true, runValidators: true }
            );

            if (!updatedJob) {
                 return NextResponse.json({ message: "Job not found during update" }, { status: 404 });
            }
        }


        // --- Delete from Cloudinary AFTER successful DB update ---
        if (imageToDeleteId) {
            try {
                console.log(`Deleting Cloudinary image: ${imageToDeleteId}`);
                await cloudinary.uploader.destroy(imageToDeleteId);
            } catch (deleteError) {
                console.error(`Failed to delete Cloudinary image ${imageToDeleteId}:`, deleteError);
            }
        }

        // Return the potentially updated job object
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
