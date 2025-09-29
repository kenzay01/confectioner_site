import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Partner } from "@/types/partner";

const dataFilePath = path.join(process.cwd(), "data", "partners.json");

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const partner: Partner = await request.json();
    
    const data = fs.readFileSync(dataFilePath, "utf8");
    const partners: Partner[] = JSON.parse(data);
    
    const index = partners.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }
    
    partners[index] = partner;
    
    fs.writeFileSync(dataFilePath, JSON.stringify(partners, null, 2));
    
    return NextResponse.json(partner);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = fs.readFileSync(dataFilePath, "utf8");
    const partners: Partner[] = JSON.parse(data);
    
    const filteredPartners = partners.filter((p) => p.id !== id);
    
    fs.writeFileSync(dataFilePath, JSON.stringify(filteredPartners, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 });
  }
}
