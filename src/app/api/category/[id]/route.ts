import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../utils/db";
import { Category } from "../../../lib/models/category";

// UPDATE a category by ID (PATCH)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = params;

        const updateData = await req.json();

        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });

        console.log(updatedCategory);
        

        if (!updatedCategory) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

// DELETE a category by ID (DELETE)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = params;

        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Category deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = params;

        

        const category = await Category.findById(id);
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
    }
}
