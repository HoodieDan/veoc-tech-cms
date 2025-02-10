import { NextRequest, NextResponse } from "next/server";
import connectDB from "../lib/mongodb";


export async function GET(request: NextRequest) {

    const { ...all } = request.json()

    await connectDB()

    return NextResponse.json(
        { message: "Hello World.", success: true },
        { status: 200 }
    );

}