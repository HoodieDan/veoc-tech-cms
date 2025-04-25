import { z } from "zod"; // Import Zod
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../utils/db";
import { Article } from "../../../lib/models/article";
import cloudinary from "../../utils/cloudinary";
import { extractPublicId } from "cloudinary-build-url";

// --- Add Zod Schema for PATCH ---
// Similar to POST, but all fields are optional for patching
const patchRequestSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }).optional(),
    author: z.string().min(2, { message: "Author must be at least 2 characters." }).optional(),
    tags: z.string().min(2, { message: "Tags must be at least 2 characters." }).optional(),
    // Allow coverImage to be an empty string (for removal) or a data URL/existing URL
    coverImage: z.string().optional(),
    content: z.array(
        z.object({
            type: z.enum(["paragraph", "image"]),
            paragraphTitle: z.string().optional(),
            paragraphText: z.string().optional(),
            imageFile: z.string().optional(),
        })
    ).optional(),
    status: z.string().optional(),
});


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) { // Removed Promise from params type
    try {
        await connectDB();

        const { id } = await params; // Directly access id from params
        if (!id) {
            return NextResponse.json({ success: false, error: "Article ID is required" }, { status: 400 });
        }

        const body = await req.json();

        // --- Validate Request Body ---
        const validation = patchRequestSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error.errors }, { status: 400 });
        }
        const { title, author, tags, content, status, coverImage } = validation.data;

        const existingArticle = await Article.findById(id);
        if (!existingArticle) {
            return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
        }

        let coverImageUrl = existingArticle.coverImage; // Start with the existing URL
        const oldCoverImageUrl = existingArticle.coverImage; // Keep track of the old one

        // --- Handle Cover Image Update ---
        let coverImageChanged = false;
        if (coverImage !== undefined && coverImage !== oldCoverImageUrl) { // Check if coverImage was provided and is different
            coverImageChanged = true;
            if (coverImage.startsWith("data:image")) {
                // Upload new cover image
                console.log("Uploading new cover image...");
                try {
                    const uploadResponse = await cloudinary.uploader.upload(coverImage, { folder: "veoc/covers" });
                    coverImageUrl = uploadResponse.secure_url;
                    console.log("New cover image uploaded:", coverImageUrl);
                } catch (uploadError) {
                    console.error("Cloudinary cover image upload error:", uploadError);
                    return NextResponse.json({ success: false, error: "Failed to upload new cover image" }, { status: 500 });
                }
            } else {
                // Assume it's a new URL or an empty string (to remove it)
                coverImageUrl = coverImage;
            }
        }

        // --- Handle Content Image Updates (and deletions) ---
        let updatedContent = existingArticle.content; // Default to existing content
        let imagesToDelete: string[] = [];

        if (content) { // Only process content if it was provided in the patch request
            const oldImageUrls = existingArticle.content
                .filter((item: { type: string; imageFile: string | undefined }) => item.type === "image" && item.imageFile)
                .map((item: { imageFile: string }) => item.imageFile);

            updatedContent = await Promise.all(
                content.map(async (item: { type: "paragraph" | "image"; paragraphTitle?: string; paragraphText?: string; imageFile?: string }) => {
                    if (item.type === "image" && item.imageFile?.startsWith("data:image")) {
                        console.log("Uploading content image...");
                        try {
                            const uploadResponse = await cloudinary.uploader.upload(item.imageFile, { folder: "veoc/content" }); // Use content subfolder
                            console.log("Content image uploaded:", uploadResponse.secure_url);
                            return { ...item, imageFile: uploadResponse.secure_url }; // Update with new URL
                        } catch (uploadError) {
                            console.error("Cloudinary content image upload error:", uploadError);
                            return item; // Returning original item for now
                        }
                    }
                    return item; // Keep paragraphs and existing image URLs
                })
            );

            const newImageUrls = updatedContent
                .filter((item: { type: string; imageFile?: string }) => item.type === "image" && item.imageFile)
                .map((item: { type: string; imageFile?: string }) => item.imageFile);

            imagesToDelete = oldImageUrls.filter((url: string) => url && url.includes('cloudinary') && !newImageUrls.includes(url));
        }

        // --- Delete Old Images (Cover and Content) ---
        try {
            // Delete old cover image if it changed and was a Cloudinary URL
            if (coverImageChanged && oldCoverImageUrl && oldCoverImageUrl.includes('cloudinary')) {
                const publicId = extractPublicId(oldCoverImageUrl);
                if (publicId) {
                    console.log("Deleting old cover image:", publicId);
                    await cloudinary.uploader.destroy(publicId);
                }
            }

            // Delete old content images
            if (imagesToDelete.length > 0) {
                console.log("Deleting old content images:", imagesToDelete);
                await Promise.all(
                    imagesToDelete.map(async (url: string) => {
                        const publicId = extractPublicId(url);
                        if (publicId) {
                            await cloudinary.uploader.destroy(publicId);
                        }
                    })
                );
            }
        } catch (deleteError) {
            console.error("Cloudinary image deletion error:", deleteError);
            // Log the error but proceed with the update if possible
        }

        // --- Prepare Update Payload ---
        const updatePayload: Partial<{
            title: string;
            author: string;
            tags: string;
            content: Array<{ type: "paragraph" | "image"; paragraphTitle?: string; paragraphText?: string; imageFile?: string }>;
            status: string;
            coverImage: string;
        }> = {};
        if (title !== undefined) updatePayload.title = title;
        if (author !== undefined) updatePayload.author = author;
        if (tags !== undefined) updatePayload.tags = tags;
        if (content !== undefined) updatePayload.content = updatedContent; // Use processed content
        if (status !== undefined) updatePayload.status = status;
        if (coverImageChanged) updatePayload.coverImage = coverImageUrl; // Use new cover image URL (can be empty string)

        // --- Update Article in DB ---
        const updatedArticle = await Article.findByIdAndUpdate(
            id,
            { $set: updatePayload }, // Use $set for partial updates
            { new: true, runValidators: true }
        );

        if (!updatedArticle) {
             // Should have been caught earlier, but good failsafe
            return NextResponse.json({ success: false, error: "Article not found after update attempt" }, { status: 404 });
        }

        return NextResponse.json({ success: true, article: updatedArticle }, { status: 200 });
    } catch (error) {
        console.error("PATCH /api/article/[id] Error:", error); // Log specific error
        if (error instanceof z.ZodError) {
            return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: (error as Error).message || "Unknown server error" }, { status: 500 });
    }
}


// --- GET Function (No changes needed for coverImage) ---
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ success: false, error: "Article ID is required" }, { status: 400 });
        }

        const article = await Article.findById(id);
        if (!article) {
            return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, article }, { status: 200 });
    } catch (error) {
        console.error("GET /api/article/[id] Error:", error);
        return NextResponse.json({ success: false, error: (error as Error).message || "Unknown server error" }, { status: 500 });
    }
}


// --- Update DELETE Function ---
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ success: false, error: "Article ID is required" }, { status: 400 });
        }

        const article = await Article.findById(id);
        if (!article) {
            return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
        }

        // --- Collect all image URLs to delete (Cover + Content) ---
        const imageUrlsToDelete: string[] = [];

        // Add cover image URL if it exists and is from Cloudinary
        if (article.coverImage && article.coverImage.includes('cloudinary')) {
            imageUrlsToDelete.push(article.coverImage);
        }

        // Add content image URLs if they exist and are from Cloudinary
        article.content.forEach((item: { type: "paragraph" | "image"; imageFile?: string }) => {
            if (item.type === "image" && item.imageFile && item.imageFile.includes('cloudinary')) {
                imageUrlsToDelete.push(item.imageFile);
            }
        });

        // --- Delete images from Cloudinary ---
        if (imageUrlsToDelete.length > 0) {
            console.log("Deleting images from Cloudinary:", imageUrlsToDelete);
            try {
                await Promise.all(
                    imageUrlsToDelete.map(async (url: string) => {
                        const publicId = extractPublicId(url);
                        if (publicId) {
                            await cloudinary.uploader.destroy(publicId);
                        }
                    })
                );
            } catch (deleteError) {
                console.error("Cloudinary image deletion error during article delete:", deleteError);
               
            }
        }

        await Article.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Article and associated images deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("DELETE /api/article/[id] Error:", error);
        return NextResponse.json({ success: false, error: (error as Error).message || "Unknown server error" }, { status: 500 });
    }
}
