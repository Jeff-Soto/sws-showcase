import { NextResponse } from "next/server";
import { getDemosFromDB } from "@/lib/projects";

export async function GET() {
  try {
    const demos = await getDemosFromDB();
    return NextResponse.json(demos);
  } catch (error) {
    console.error("Error fetching demos:", error);
    return NextResponse.json(
      { error: "Failed to fetch demos" },
      { status: 500 }
    );
  }
}

