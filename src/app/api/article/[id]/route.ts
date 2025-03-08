import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../utils/db";
import { Article } from "../../../lib/models/article";
import cloudinary from "../../utils/cloudinary";
import { extractPublicId } from "cloudinary-build-url";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const { id } = await params;
        const { title, author, tags, content, status } = await req.json();

        const existingArticle = await Article.findById(id);
        if (!existingArticle) {
            return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
        }


        const oldImageUrls = existingArticle.content
            .filter((item: any) => item.type === "image")
            .map((item: any) => item.imageFile);

        const updatedContent = await Promise.all(
            content.map(async (item: any) => {
                if (item.type === "image" && item.imageFile?.startsWith("data:image")) {
                    const uploadResponse = await cloudinary.uploader.upload(item.imageFile, { folder: "veoc" });
                    return { type: "image", imageFile: uploadResponse.secure_url };
                }
                return item;
            })
        );

        const newImageUrls = updatedContent
            .filter((item: any) => item.type === "image")
            .map((item: any) => item.imageFile);


        const imagesToDelete = oldImageUrls.filter((url: string) => !newImageUrls.includes(url));

        

        await Promise.all(
            imagesToDelete.map(async (url: string) => {
                const publicId = extractPublicId(url);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            })
        );

        const updatedArticle = await Article.findByIdAndUpdate(
            id,
            { title, author, tags, content: updatedContent, status },
            { new: true, runValidators: true }
        );

        return NextResponse.json({ success: true, article: updatedArticle }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: (error as Error).message || "Unknown error" }, { status: 500 });
    }
}


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const { id } = await params;


        const article = await Article.findById(id);
        if (!article) {
            return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, article }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: (error as Error).message || "Unknown error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const { id } = await params;


        const article = await Article.findById(id);
        if (!article) {
            return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
        }

        const imageUrls = article.content
            .filter((item: any) => item.type === "image")
            .map((item: any) => item.imageFile);

        await Promise.all(
            imageUrls.map(async (url: string) => {
                const publicId = extractPublicId(url);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            })
        );

        await Article.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Article deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: (error as Error).message || "Unknown error" }, { status: 500 });
    }
}
