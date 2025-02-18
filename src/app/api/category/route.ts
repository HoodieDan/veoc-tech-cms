import { NextRequest, NextResponse } from "next/server";
import connectDB from "../utils/db";
import { Category } from "../../lib/models/category";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { name, tag, division } = await req.json();

        if (!name || !tag || !division) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newCategory = new Category({
            name,
            tag,
            division,
        });

        await newCategory.save();

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error("POST Error:", error);  // ✅ Logs error
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find();

        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error("GET Error:", error);  // ✅ Logs error

        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}
