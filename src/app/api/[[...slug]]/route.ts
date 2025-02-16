import { NextResponse } from "next/server";

export function GET() {
    return NextResponse.json({ error: "API route not found" }, { status: 404 });
}
