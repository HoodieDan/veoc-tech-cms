import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../utils/db";
import { Article } from "../../lib/models/article";
import cloudinary from "../utils/cloudinary";


const requestSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    author: z.string().min(2, { message: "Co-Owners must be at least 2 characters." }),
    tags: z.string().min(2, { message: "Tags must be at least 2 characters." }),
    content: z.array(
        z.object({
            type: z.enum(["paragraph", "image"]),
            paragraphTitle: z.string().optional(),
            paragraphText: z.string().optional(),
            imageFile: z.string().optional(),
        })
    ),
    status: z.string().optional(), // Adjust validation rules if needed
});



export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { title, author, tags, content, status } = await req.json();


        const updatedContent = await Promise.all(
            content.map(async (item: any) => {
                if (item.type === "image" && item.imageFile?.startsWith("data:image")) {

                    const uploadResponse = await cloudinary.uploader.upload(item.imageFile, { folder: "veoc" });
                    return { type: "image", imageFile: uploadResponse.secure_url };
                }
                return item; // Keep paragraphs unchanged
            })
        );


        const newArticle = new Article({
            title,
            author,
            tags,
            status,
            content: updatedContent,
        });

        await newArticle.save();

        return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ success: false, error: (error as Error).message || "Unknown error" }, { status: 500 });
    }
}



export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const articles = await Article.find().sort({ updatedAt: -1 }); // Fetch all articles

        return NextResponse.json({ success: true, articles }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: (error as Error).message || "Unknown error" }, { status: 500 });
    }
}