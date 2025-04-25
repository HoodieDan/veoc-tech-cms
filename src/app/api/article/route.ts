import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../utils/db";
import { Article } from "../../lib/models/article";
import cloudinary from "../utils/cloudinary";

// Zod schema (as updated above)
const requestSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    author: z.string().min(2, { message: "Author must be at least 2 characters." }),
    tags: z.string().min(2, { message: "Tags must be at least 2 characters." }),
    coverImage: z.string().min(1, { message: "Cover image is required." }).optional(), // Ensure it's here
    content: z.array(
        z.object({
            type: z.enum(["paragraph", "image"]),
            paragraphTitle: z.string().optional(),
            paragraphText: z.string().optional(),
            imageFile: z.string().optional(),
        })
    ),
    status: z.string().optional(),
});


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        const validation = requestSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error.errors }, { status: 400 });
        }

        const { title, author, tags, content, status, coverImage } = validation.data;

        let coverImageUrl = coverImage; 

       
        if (coverImage && coverImage.startsWith("data:image")) {
            console.log("Uploading cover image...");
            try {
                const uploadResponse = await cloudinary.uploader.upload(coverImage, { folder: "veoc/covers" }); // Optional: use a subfolder
                coverImageUrl = uploadResponse.secure_url;
                console.log("Cover image uploaded:", coverImageUrl);
            } catch (uploadError) {
                console.error("Cloudinary cover image upload error:", uploadError);
                // Decide if you want to fail the whole request or proceed without a cover image
                return NextResponse.json({ success: false, error: "Failed to upload cover image" }, { status: 500 });
            }
        }

        // --- Upload Content Images ---
        const updatedContent = await Promise.all(
            content.map(async (item) => { // No need for 'any' type here if schema is correct
                if (item.type === "image" && item.imageFile?.startsWith("data:image")) {
                    try {
                        console.log("Uploading content image...");
                        const uploadResponse = await cloudinary.uploader.upload(item.imageFile, { folder: "veoc/content" }); // Optional: use a subfolder
                        console.log("Content image uploaded:", uploadResponse.secure_url);
                        return { ...item, imageFile: uploadResponse.secure_url }; // Return the whole item with updated URL
                    } catch (uploadError) {
                        console.error("Cloudinary content image upload error:", uploadError);
                        // Handle content image upload error - maybe return the item unchanged or throw
                        // For now, returning item unchanged to avoid losing text content if image fails
                        return item;
                    }
                }
                return item; // Keep paragraphs and non-data-URL images unchanged
            })
        );

        // --- Create and Save New Article ---
        const newArticle = new Article({
            title,
            author,
            tags,
            status: status || "draft", // Default status if not provided
            coverImage: coverImageUrl, // Use the potentially updated URL
            content: updatedContent,
        });

        await newArticle.save();

        return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
    } catch (error) {
        console.error("POST /api/article Error:", error); // Log the specific error

        // Handle Zod validation errors specifically if not caught above (though safeParse should handle it)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
        }

        return NextResponse.json({ success: false, error: (error as Error).message || "Unknown server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();

        const articles = await Article.find().sort({ updatedAt: -1 }); // Fetch all articles

        return NextResponse.json({ success: true, articles }, { status: 200 });
    } catch (error) {
        console.error("GET /api/article Error:", error);
        return NextResponse.json({ success: false, error: (error as Error).message || "Unknown server error" }, { status: 500 });
    }
}
