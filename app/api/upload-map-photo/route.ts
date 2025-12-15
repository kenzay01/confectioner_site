import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Brak pliku" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "map-locations");
    await mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name) || ".jpg";
    const randomName = crypto.randomBytes(16).toString("hex");
    const fileName = `${Date.now()}-${randomName}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    const url = `/uploads/map-locations/${fileName}`;

    return NextResponse.json({ url });
  } catch (_error) {
    return NextResponse.json(
      { error: "Błąd przy przesyłaniu pliku" },
      { status: 500 }
    );
  }
}


