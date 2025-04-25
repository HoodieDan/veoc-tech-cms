import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "../../../utils/db"; // Adjust path as needed
import { Job } from "../../../../lib/models/job"; // Adjust path as needed
import { Status } from "../../../../utils/customTypes"; // Import Status enum


// Helper function for ObjectId validation
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// PATCH handler specifically for updating job status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const jobId = (await params).id;

    // --- ID Validation ---
    if (!isValidObjectId(jobId)) {
        return NextResponse.json({ message: "Invalid Job ID format" }, { status: 400 });
    }

    try {
        // --- Get status from JSON body ---
        const body = await req.json();
        const { status } = body;

        // --- Validate Status ---
        // Check if the provided status is a valid value from the Status enum
        if (!status || !Object.values(Status).includes(status as Status)) {
             return NextResponse.json({ message: "Invalid status value provided" }, { status: 400 });
        }

        // --- Find and Update Job Status ---
        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { $set: { status: status } }, // Only update the status field
            { new: true, runValidators: true } // Return updated doc & run validators
        );

        if (!updatedJob) {
             return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        // Return the updated job object (or just a success message)
        // The thunk expects the updated job object based on its return type
        return NextResponse.json(updatedJob, { status: 200 });
        // Or: return NextResponse.json({ message: "Job status updated successfully", job: updatedJob }, { status: 200 });


    } catch (error) {
        console.error("Error updating job status:", error);
        if (error instanceof mongoose.Error.ValidationError) {
             return NextResponse.json({ message: "Validation Error", errors: error.errors }, { status: 400 });
        }
        // Return a generic server error message
        return NextResponse.json({ message: "An error occurred while updating the job status." }, { status: 500 });
    }
}
