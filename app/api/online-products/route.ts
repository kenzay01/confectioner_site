import { OnlineProduct } from "@/types/products";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const productsFile = path.join(process.cwd(), "data", "onlineProducts.json");

export async function GET() {
  try {
    const fileExists = await fs
      .access(productsFile)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      await fs.mkdir(path.dirname(productsFile), { recursive: true });
      await fs.writeFile(productsFile, JSON.stringify([]));
      console.log(`Created ${productsFile}`);
    }
    const fileContents = await fs.readFile(productsFile, "utf-8");
    const products = fileContents
      ? (JSON.parse(fileContents) as OnlineProduct[])
      : [];
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/online-products:", error);
    return NextResponse.json(
      { error: "Failed to read online products", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newProduct = (await request.json()) as OnlineProduct;
    const fileExists = await fs
      .access(productsFile)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      await fs.mkdir(path.dirname(productsFile), { recursive: true });
      await fs.writeFile(productsFile, JSON.stringify([]));
      console.log(`Created ${productsFile}`);
    }
    const fileContents = await fs.readFile(productsFile, "utf-8");
    const products = fileContents
      ? (JSON.parse(fileContents) as OnlineProduct[])
      : [];
    products.push(newProduct);
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/online-products:", error);
    return NextResponse.json(
      { error: "Failed to create online product", details: error },
      { status: 500 }
    );
  }
}
