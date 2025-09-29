import { OnlineProduct } from "@/types/products";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const productsFile = path.join(process.cwd(), "data", "onlineProducts.json");

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updatedProduct = (await request.json()) as OnlineProduct;
    const fileExists = await fs
      .access(productsFile)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      return NextResponse.json(
        { error: "Online products file not found" },
        { status: 404 }
      );
    }
    const fileContents = await fs.readFile(productsFile, "utf-8");
    const products = JSON.parse(fileContents) as OnlineProduct[];
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Online product not found" },
        { status: 404 }
      );
    }
    products[index] = updatedProduct;
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to update online product" },
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
      .access(productsFile)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      return NextResponse.json(
        { error: "Online products file not found" },
        { status: 404 }
      );
    }
    const fileContents = await fs.readFile(productsFile, "utf-8");
    const products = JSON.parse(fileContents) as OnlineProduct[];
    const updatedProducts = products.filter((p) => p.id !== id);
    if (products.length === updatedProducts.length) {
      return NextResponse.json(
        { error: "Online product not found" },
        { status: 404 }
      );
    }
    await fs.writeFile(productsFile, JSON.stringify(updatedProducts, null, 2));
    return NextResponse.json(
      { message: "Online product deleted" },
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete online product" },
      { status: 500 }
    );
  }
}
