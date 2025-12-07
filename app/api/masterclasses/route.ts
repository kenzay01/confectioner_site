import { Masterclass } from "@/types/masterclass";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { validateJsonInput, checkRateLimit, containsDangerousPatterns, validateId } from "@/lib/security";

const masterclassesFile = path.join(
  process.cwd(),
  "data",
  "masterclasses.json"
);

export async function GET() {
  try {
    const fileExists = await fs
      .access(masterclassesFile)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      await fs.mkdir(path.dirname(masterclassesFile), { recursive: true });
      await fs.writeFile(masterclassesFile, JSON.stringify([]));
      // console.log(`Created ${masterclassesFile}`);
    }
    const fileContents = await fs.readFile(masterclassesFile, "utf-8");
    const masterclasses = fileContents
      ? (JSON.parse(fileContents) as Masterclass[])
      : [];
    return NextResponse.json(masterclasses, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/masterclasses:", error);
    return NextResponse.json(
      { error: "Failed to read masterclasses", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientId = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const rateLimit = checkRateLimit(clientId, 50, 60000); // 50 запитів на хвилину
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Читаємо тіло запиту
    const body = await request.text();
    
    // Валідація JSON
    const jsonValidation = validateJsonInput(body, 500000); // Максимум 500KB
    if (!jsonValidation.valid) {
      return NextResponse.json(
        { error: "Invalid input", details: jsonValidation.error },
        { status: 400 }
      );
    }

    const newMasterclass = JSON.parse(body) as Masterclass;

    // Додаткова валідація полів
    if (newMasterclass.id && !validateId(newMasterclass.id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    // Перевірка на небезпечні паттерни в текстових полях
    const textFields = [
      newMasterclass.title?.pl,
      newMasterclass.title?.en,
      newMasterclass.description?.pl,
      newMasterclass.description?.en,
      newMasterclass.location?.pl,
      newMasterclass.location?.en,
      newMasterclass.city,
      newMasterclass.photo,
    ].filter(Boolean) as string[];

    for (const field of textFields) {
      if (containsDangerousPatterns(field)) {
        return NextResponse.json(
          { error: "Dangerous patterns detected in input" },
          { status: 400 }
        );
      }
    }

    const fileExists = await fs
      .access(masterclassesFile)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      await fs.mkdir(path.dirname(masterclassesFile), { recursive: true });
      await fs.writeFile(masterclassesFile, JSON.stringify([]));
    }
    const fileContents = await fs.readFile(masterclassesFile, "utf-8");
    const masterclasses = fileContents
      ? (JSON.parse(fileContents) as Masterclass[])
      : [];
    masterclasses.push(newMasterclass);
    await fs.writeFile(
      masterclassesFile,
      JSON.stringify(masterclasses, null, 2)
    );
    return NextResponse.json(newMasterclass, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/masterclasses:", error);
    return NextResponse.json(
      { error: "Failed to create masterclass" },
      { status: 500 }
    );
  }
}
