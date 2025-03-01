import { NextRequest, NextResponse } from "next/server";
import { extractPublicId } from "cloudinary-build-url";


import connectDB from "../../utils/db";
import { Job } from "../../../lib/models/job";
import cloudinary from "../../utils/cloudinary";


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id: jobId } = await params;


    try {
        const existingJob = await Job.findById(jobId);
        if (!existingJob) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        const formData = await req.formData();
        const updateData: Record<string, string | File | undefined> = {};


        for (const [key, value] of formData.entries()) {
            if (key === "image" && value instanceof File) {
                const arrayBuffer = await value.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                if (Buffer.isBuffer(buffer)) {
                    const base64Image = `data:${value.type};base64,${buffer.toString("base64")}`;

                    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                        folder: "veoc",
                    });

                    if (uploadResponse) {
                        if (existingJob.image) {
                            const oldImagePublicId = extractPublicId(existingJob.image);

                            if (oldImagePublicId) {
                                await cloudinary.uploader.destroy(oldImagePublicId);
                            }
                        }
                        updateData.image = uploadResponse.secure_url;
                    }
                }
            } else {
                updateData[key] = value;
            }
        }


        const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, { new: true });

        return NextResponse.json(updatedJob, { status: 200 });

    } catch (error) {
        console.error("Error updating job:", error);
        return NextResponse.json({ message: "Error updating job", error }, { status: 500 });
    }
}



export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id: jobId } = await params;

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        return NextResponse.json(job, { status: 200 });

    } catch (error) {
        console.error("Error fetching job:", error);
        return NextResponse.json({ message: "Error fetching job", error }, { status: 500 });
    }
}

// DELETE request to remove a job by ID
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id: jobId } = await params;

    try {
        const job = await Job.findByIdAndDelete(jobId);
        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        if (job.image) {
            const oldImagePublicId = extractPublicId(job.image);
            if (oldImagePublicId) {
                await cloudinary.uploader.destroy(oldImagePublicId);
            }
        }

        return NextResponse.json({ message: "Job deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error deleting job:", error);
        return NextResponse.json({ message: "Error deleting job", error }, { status: 500 });
    }
}
