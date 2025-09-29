import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Partner } from "@/types/partner";

const dataFilePath = path.join(process.cwd(), "data", "partners.json");

export async function GET() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    const partners = JSON.parse(data);
    return NextResponse.json(partners);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to read partners" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const partner: Partner = await request.json();
    
    const data = fs.readFileSync(dataFilePath, "utf8");
    const partners = JSON.parse(data);
    
    partners.push(partner);
    
    fs.writeFileSync(dataFilePath, JSON.stringify(partners, null, 2));
    
    return NextResponse.json(partner);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to create partner" }, { status: 500 });
  }
}
