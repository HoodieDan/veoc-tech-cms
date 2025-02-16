import { NextRequest, NextResponse } from "next/server";
import { extractPublicId } from "cloudinary-build-url";


import connectDB from "../../utils/db";
import { Job } from "../../../lib/models/job";
import cloudinary from "../../utils/cloudinary";



// PATCH request to update a job by ID
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    await connectDB(); // Ensure DB is connected
    const jobId = params.id;
    

    try {
        const existingJob = await Job.findById(jobId);
        if (!existingJob) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        const formData = await req.formData();
        const updateData: Record<string, any> = {};


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
