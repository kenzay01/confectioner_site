import type { SiteContent } from "@/types/siteContent";
import { NextResponse } from "next/server";
import { readSiteContent, writeSiteContent } from "@/lib/siteContent";
import { validateJsonInput } from "@/lib/security";

export async function GET() {
  try {
    const data = await readSiteContent();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET /api/site-content:", error);
    return NextResponse.json(
      { error: "Failed to read site content" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.text();
    const validation = validateJsonInput(body, 200_000);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error },
        { status: 400 }
      );
    }
    const content = JSON.parse(body) as SiteContent;
    if (
      content?.home?.heroText == null ||
      !content?.about?.pl?.title ||
      !content?.about?.en?.title
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    await writeSiteContent(content);
    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    console.error("PUT /api/site-content:", error);
    return NextResponse.json(
      { error: "Failed to save site content" },
      { status: 500 }
    );
  }
}
