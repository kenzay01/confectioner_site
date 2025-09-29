import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "polishCities.json");

export async function GET() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    const cities = JSON.parse(data);
    return NextResponse.json(cities);
  } catch (error) {
    console.error("Error reading cities:", error);
    return NextResponse.json({ error: "Failed to read cities" }, { status: 500 });
  }
}
