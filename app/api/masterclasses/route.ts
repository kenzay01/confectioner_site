import { Masterclass } from "@/types/masterclass";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

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
    const newMasterclass = (await request.json()) as Masterclass;
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
    masterclasses.push(newMasterclass);
    await fs.writeFile(
      masterclassesFile,
      JSON.stringify(masterclasses, null, 2)
    );
    return NextResponse.json(newMasterclass, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/masterclasses:", error);
    return NextResponse.json(
      { error: "Failed to create masterclass", details: error },
      { status: 500 }
    );
  }
}
