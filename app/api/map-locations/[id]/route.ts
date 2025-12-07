import { MapLocation } from "@/types/mapLocation";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const mapLocationsFile = path.join(
  process.cwd(),
  "data",
  "mapLocations.json"
);

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updatedLocation = (await request.json()) as MapLocation;
    const fileExists = await fs
      .access(mapLocationsFile)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      return NextResponse.json(
        { error: "Map locations file not found" },
        { status: 404 }
      );
    }
    const fileContents = await fs.readFile(mapLocationsFile, "utf-8");
    const mapLocations = JSON.parse(fileContents) as MapLocation[];
    const index = mapLocations.findIndex((m) => m.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Map location not found" },
        { status: 404 }
      );
    }
    mapLocations[index] = updatedLocation;
    await fs.writeFile(
      mapLocationsFile,
      JSON.stringify(mapLocations, null, 2)
    );
    return NextResponse.json(updatedLocation, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to update map location" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fileExists = await fs
      .access(mapLocationsFile)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      return NextResponse.json(
        { error: "Map locations file not found" },
        { status: 404 }
      );
    }
    const fileContents = await fs.readFile(mapLocationsFile, "utf-8");
    const mapLocations = JSON.parse(fileContents) as MapLocation[];
    const updatedLocations = mapLocations.filter((m) => m.id !== id);
    if (mapLocations.length === updatedLocations.length) {
      return NextResponse.json(
        { error: "Map location not found" },
        { status: 404 }
      );
    }
    await fs.writeFile(
      mapLocationsFile,
      JSON.stringify(updatedLocations, null, 2)
    );
    return NextResponse.json(
      { message: "Map location deleted" },
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete map location" },
      { status: 500 }
    );
  }
}

