import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Partner } from "@/types/partner";

const dataFilePath = path.join(process.cwd(), "data", "partners.json");

async function readPartners(): Promise<Partner[]> {
  const fileExists = await fs
    .access(dataFilePath)
    .then(() => true)
    .catch(() => false);

  if (!fileExists) {
    return [];
  }

  const data = await fs.readFile(dataFilePath, "utf8");
  return data ? (JSON.parse(data) as Partner[]) : [];
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const partner: Partner = await request.json();
    const partners = await readPartners();
    const index = partners.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    partners[index] = partner;
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(partners, null, 2), "utf8");

    return NextResponse.json(partner);
  } catch (error) {
    console.error("PUT /api/partners/[id]:", error);
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const partners = await readPartners();
    const filteredPartners = partners.filter((p) => p.id !== id);

    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(
      dataFilePath,
      JSON.stringify(filteredPartners, null, 2),
      "utf8"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/partners/[id]:", error);
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 });
  }
}
