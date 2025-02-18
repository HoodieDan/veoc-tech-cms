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



export async function GET() {
    try {
        await connectDB(); // Ensure DB connection
        const jobs = await Job.find(); // Fetch all jobs

        return NextResponse.json(jobs, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching jobs", error }, { status: 500 });
    }
}