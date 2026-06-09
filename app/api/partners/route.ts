import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Partner } from "@/types/partner";

const dataFilePath = path.join(process.cwd(), "data", "partners.json");

async function ensurePartnersFile(): Promise<Partner[]> {
  const fileExists = await fs
    .access(dataFilePath)
    .then(() => true)
    .catch(() => false);

  if (!fileExists) {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify([]), "utf8");
    return [];
  }

  const data = await fs.readFile(dataFilePath, "utf8");
  return data ? (JSON.parse(data) as Partner[]) : [];
}

export async function GET() {
  try {
    const partners = await ensurePartnersFile();
    return NextResponse.json(partners);
  } catch (error) {
    console.error("GET /api/partners:", error);
    return NextResponse.json({ error: "Failed to read partners" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const partner: Partner = await request.json();
    const partners = await ensurePartnersFile();
    partners.push(partner);
    await fs.writeFile(dataFilePath, JSON.stringify(partners, null, 2), "utf8");
    return NextResponse.json(partner);
  } catch (error) {
    console.error("POST /api/partners:", error);
    return NextResponse.json({ error: "Failed to create partner" }, { status: 500 });
  }
}
