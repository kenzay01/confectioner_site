import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, access } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "Brak pliku" }, { status: 400 });
    }

    if (typeof file === "string") {
      return NextResponse.json({ error: "Nieprawidłowy format pliku" }, { status: 400 });
    }

    // Конвертуємо File/Blob в Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length === 0) {
      return NextResponse.json({ error: "Plik jest pusty" }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "map-locations");
    
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (mkdirError) {
      console.error("Error creating directory:", mkdirError);
      return NextResponse.json(
        { error: "Nie można utworzyć katalogu uploads" },
        { status: 500 }
      );
    }

    // Проверяем, можно ли записывать в директорию
    try {
      await access(uploadsDir, 2); // W_OK = 2 (write permission)
    } catch (accessError) {
      console.error("Error accessing directory (no write permission):", accessError);
      return NextResponse.json(
        { error: "Brak uprawnień do zapisu w katalogu uploads" },
        { status: 500 }
      );
    }

    const originalFileName = file.name || "file";
    const ext = path.extname(originalFileName) || ".jpg";
    const randomName = crypto.randomBytes(16).toString("hex");
    const fileName = `${Date.now()}-${randomName}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    const url = `/uploads/map-locations/${fileName}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Błąd przy przesyłaniu pliku", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}


