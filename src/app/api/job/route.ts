import { NextRequest, NextResponse } from "next/server";
import connectDB from "../utils/db";
import { Job } from "../../lib/models/job";
import cloudinary from "../utils/cloudinary";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const formData = await req.formData();

        const title = formData.get("title") as string;
        const dept = formData.get("dept") as string;
        const location = formData.get("location") as string;
        const desc = formData.get("desc") as string;
        const status = formData.get("status") as string;
        const job_type = formData.get("job_type") as string;
        const experience = formData.get("experience") as string;
        const date = formData.get("date") as string;
        const image = formData.get("image") as File | null;

        if (!title || !desc || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let imageUrl = "";

        if (image instanceof File) {
            const arrayBuffer = await image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
        
            if (Buffer.isBuffer(buffer)) {
                const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;
        
                const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                    folder: "veoc",
                });
        
                imageUrl = uploadResponse.secure_url;
            }
        }
        

        const newJob = new Job({
            title,
            dept,
            location,
            desc,
            status,
            job_type,
            experience,
            date,
            image: imageUrl,
        });

        await newJob.save();

        return NextResponse.json(
            { message: "Job created successfully", job: newJob },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating job:", error);
        return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
    }
}



export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // Get status from query parameters
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        // Build the query object
        const query: { status?: string } = {};
        if (status) {
            query.status = status;
        }

        // Fetch jobs based on the query
        // You might want to add sorting, e.g., by date or title
        const jobs = await Job.find(query).sort({ createdAt: -1 }); // Example sorting

        return NextResponse.json({ success: true, jobs }, { status: 200 });
    } catch (error) {
        console.error("GET /api/job Error:", error);
        return NextResponse.json({ success: false, error: (error as Error).message || "Unknown server error" }, { status: 500 });
    }
}