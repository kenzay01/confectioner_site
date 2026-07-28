// app/api/masterclasses/[id]/reduce-slot/route.ts
import { Masterclass } from "@/types/masterclass";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const masterclassesFile = path.join(
  process.cwd(),
  "data",
  "masterclasses.json"
);

export async function POST(
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
    
    const index = masterclasses.findIndex((m) => m.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Masterclass not found" },
        { status: 404 }
      );
    }

    const masterclass = masterclasses[index];
    let quantity = 1;
    try {
      const body = await request.json().catch(() => ({}));
      if (body && typeof body.quantity === "number" && body.quantity > 0) {
        quantity = Math.floor(body.quantity);
      }
    } catch {
      quantity = 1;
    }

    const freeSlots = Math.max(
      0,
      (masterclass.availableSlots || 0) - (masterclass.pickedSlots || 0)
    );

    if (freeSlots < quantity) {
      return NextResponse.json(
        { error: "No available slots" },
        { status: 400 }
      );
    }

    masterclass.pickedSlots = (masterclass.pickedSlots || 0) + quantity;

    await fs.writeFile(
      masterclassesFile,
      JSON.stringify(masterclasses, null, 2)
    );

    return NextResponse.json({
      success: true,
      message: "Slot reduced successfully",
      availableSlots: masterclass.availableSlots,
      pickedSlots: masterclass.pickedSlots,
      quantity,
    });

  } catch (error) {
    console.error('Error reducing masterclass slot:', error);
    return NextResponse.json(
      { error: "Failed to reduce masterclass slot" },
      { status: 500 }
    );
  }
}