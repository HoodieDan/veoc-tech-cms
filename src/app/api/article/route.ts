import { NextRequest, NextResponse } from "next/server";
import connectDB from "../utils/db";
import { Article } from "../../lib/models/article";
import cloudinary from "../utils/cloudinary";


export async function POST(req:NextRequest) {
    try {
        await connectDB();

        const { title, coOwners, tags, content } = await req.json();

        const updatedContent = await Promise.all(
            content.map(async (item: any) => {
                if (item.type === "image" && item.imageFile?.startsWith("data:image")) {
                    console.log(123);
                    
                    const uploadResponse = await cloudinary.uploader.upload(item.imageFile, { folder: "veoc" });
                    return { type: "image", imagePath: uploadResponse.secure_url };
                }
                return item; // Keep paragraphs unchanged
            })
        );


        const newArticle = new Article({
            title,
            coOwners,
            tags,
            content: updatedContent, 
        });

        await newArticle.save();

        return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({ success: false, error: (error as Error).message || "Unknown error" }, { status: 500 });    }
}



export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const articles = await Article.find(); // Fetch all articles

        return NextResponse.json({ success: true, articles }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: (error as Error).message || "Unknown error" }, { status: 500 });
    }
}