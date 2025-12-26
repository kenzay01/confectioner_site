import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync, statSync } from "fs";
import path from "path";
import crypto from "crypto";

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Brak pliku" }, { status: 400 });
    }

    // Перевірка MIME типу
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: "Nieprawidłowy typ pliku", 
        allowedTypes: ALLOWED_TYPES 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(bytes));
    
    if (buffer.length === 0) {
      return NextResponse.json({ error: "Plik jest pusty" }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "map-locations");
    await mkdir(uploadsDir, { recursive: true });

    const originalFileName = file.name || "file";
    const ext = path.extname(originalFileName).toLowerCase() || ".jpg";
    const randomName = crypto.randomBytes(16).toString("hex");
    const fileName = `${Date.now()}-${randomName}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    // Перевірка після запису
    if (existsSync(filePath)) {
      const stats = statSync(filePath);
      console.log('✅ File saved successfully:', {
        fileName,
        mimeType: file.type,
        fileSize: stats.size,
        url: `/uploads/map-locations/${fileName}`
      });
    } else {
      console.error('❌ File not found after write:', filePath);
    }

    const url = `/api/static/map-locations/${fileName}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Błąd przy przesyłaniu pliku", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}


