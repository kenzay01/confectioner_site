import { Masterclass } from "@/types/masterclass";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const masterclassesFile = path.join(
  process.cwd(),
  "data",
  "masterclasses.json"
);

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updatedMasterclass = (await request.json()) as Masterclass;
    const fileExists = await fs
      .access(masterclassesFile)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      return NextResponse.json(
        { error: "Masterclasses file not found" },
        { status: 404 }
      );
    }
    const fileContents = await fs.readFile(masterclassesFile, "utf-8");
    const masterclasses = JSON.parse(fileContents) as Masterclass[];
    const index = masterclasses.findIndex((m) => m.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Masterclass not found" },
        { status: 404 }
      );
    }
    masterclasses[index] = updatedMasterclass;
    await fs.writeFile(
      masterclassesFile,
      JSON.stringify(masterclasses, null, 2)
    );
    return NextResponse.json(updatedMasterclass, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to update masterclass" },
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
      .access(masterclassesFile)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      return NextResponse.json(
        { error: "Masterclasses file not found" },
        { status: 404 }
      );
    }
    const fileContents = await fs.readFile(masterclassesFile, "utf-8");
    const masterclasses = JSON.parse(fileContents) as Masterclass[];
    const updatedMasterclasses = masterclasses.filter((m) => m.id !== id);
    if (masterclasses.length === updatedMasterclasses.length) {
      return NextResponse.json(
        { error: "Masterclass not found" },
        { status: 404 }
      );
    }
    await fs.writeFile(
      masterclassesFile,
      JSON.stringify(updatedMasterclasses, null, 2)
    );
    return NextResponse.json(
      { message: "Masterclass deleted" },
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete masterclass" },
      { status: 500 }
    );
  }
}
