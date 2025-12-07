import { MapLocation } from "@/types/mapLocation";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { validateJsonInput, checkRateLimit, containsDangerousPatterns, validateId, validateUrl } from "@/lib/security";

const mapLocationsFile = path.join(
  process.cwd(),
  "data",
  "mapLocations.json"
);

export async function GET() {
  try {
    const fileExists = await fs
      .access(mapLocationsFile)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      await fs.mkdir(path.dirname(mapLocationsFile), { recursive: true });
      await fs.writeFile(mapLocationsFile, JSON.stringify([]));
    }
    const fileContents = await fs.readFile(mapLocationsFile, "utf-8");
    const mapLocations = fileContents
      ? (JSON.parse(fileContents) as MapLocation[])
      : [];
    return NextResponse.json(mapLocations, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/map-locations:", error);
    return NextResponse.json(
      { error: "Failed to read map locations", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientId = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const rateLimit = checkRateLimit(clientId, 50, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Читаємо тіло запиту
    const body = await request.text();
    
    // Валідація JSON
    const jsonValidation = validateJsonInput(body, 500000);
    if (!jsonValidation.valid) {
      return NextResponse.json(
        { error: "Invalid input", details: jsonValidation.error },
        { status: 400 }
      );
    }

    const newLocation = JSON.parse(body) as MapLocation;

    // Валідація ID
    if (newLocation.id && !validateId(newLocation.id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    // Перевірка на небезпечні паттерни
    const textFields = [
      newLocation.name?.pl,
      newLocation.name?.en,
      newLocation.description?.pl,
      newLocation.description?.en,
      newLocation.city,
    ].filter(Boolean) as string[];

    for (const field of textFields) {
      if (containsDangerousPatterns(field)) {
        return NextResponse.json(
          { error: "Dangerous patterns detected in input" },
          { status: 400 }
        );
      }
    }

    // Валідація URL фото
    if (newLocation.photos && Array.isArray(newLocation.photos)) {
      for (const photo of newLocation.photos) {
        if (typeof photo === 'string' && !validateUrl(photo) && !photo.startsWith('/')) {
          return NextResponse.json(
            { error: "Invalid photo URL" },
            { status: 400 }
          );
        }
        if (typeof photo === 'string' && containsDangerousPatterns(photo)) {
          return NextResponse.json(
            { error: "Dangerous patterns in photo URL" },
            { status: 400 }
          );
        }
      }
    }

    const fileExists = await fs
      .access(mapLocationsFile)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      await fs.mkdir(path.dirname(mapLocationsFile), { recursive: true });
      await fs.writeFile(mapLocationsFile, JSON.stringify([]));
    }
    const fileContents = await fs.readFile(mapLocationsFile, "utf-8");
    const mapLocations = fileContents
      ? (JSON.parse(fileContents) as MapLocation[])
      : [];
    mapLocations.push(newLocation);
    await fs.writeFile(
      mapLocationsFile,
      JSON.stringify(mapLocations, null, 2)
    );
    return NextResponse.json(newLocation, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/map-locations:", error);
    return NextResponse.json(
      { error: "Failed to create map location" },
      { status: 500 }
    );
  }
}

