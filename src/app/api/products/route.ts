import { NextResponse, NextRequest } from "next/server";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/product/service";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdir(uploadDir, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
  });
}
export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: any) {
  try {
    const form = await request.formData();
    console.log(form);
    const file = form.get("image");
    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { success: false, error: "Image file is required (field name: image)" },
        { status: 400 },
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = (file as any).name || "file";
    const ext = path.extname(originalName) || "";
    const filename = uuid() + ext;
    const fullPath = path.join(uploadDir, filename);

    await fs.promises.writeFile(fullPath, buffer);

    const relativePath = `/uploads/${filename}`;
    const price = form.get("price");
    const name = form.get("name");
    const description = form.get("description");
    const html = form.get("html");
    const product = await createProduct({
      name,
      description,
      price: price || 0,
      image: relativePath,
      html,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 },
    );
  }
}

export async function UPDATE(request: NextRequest) {
  try {
    const data = await request.json();

    const updatedProduct = await updateProduct(data);

    return NextResponse.json(updatedProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const deletedProduct = await deleteProduct(id);
    return NextResponse.json(deletedProduct, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 },
    );
  }
}
