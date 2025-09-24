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
    
    // Перевіряємо, чи є доступні місця
    if (masterclass.availableSlots <= 0) {
      return NextResponse.json(
        { error: "No available slots" },
        { status: 400 }
      );
    }

    // Зменшуємо доступні місця та збільшуємо зайняті
    masterclass.availableSlots -= 1;
    masterclass.pickedSlots += 1;

    await fs.writeFile(
      masterclassesFile,
      JSON.stringify(masterclasses, null, 2)
    );

    return NextResponse.json({
      success: true,
      message: "Slot reduced successfully",
      availableSlots: masterclass.availableSlots,
      pickedSlots: masterclass.pickedSlots
    });

  } catch (error) {
    console.error('Error reducing masterclass slot:', error);
    return NextResponse.json(
      { error: "Failed to reduce masterclass slot" },
      { status: 500 }
    );
  }
}