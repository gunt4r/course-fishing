import { NextResponse, NextRequest } from "next/server";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/product/service";
import { v4 as uuid } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import { requireAdmin } from "@/middlewares/auth";
import { uploadPdfBlob } from "@/services/upload/service";
export const config = {
  api: {
    bodyParser: false,
  },
};

const BASE_PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOAD_DIR = path.join(BASE_PUBLIC_DIR, "uploads");
const DOCUMENTS_DIR = path.join(BASE_PUBLIC_DIR, "documents");

async function ensureDirectories() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.mkdir(DOCUMENTS_DIR, { recursive: true });
}
ensureDirectories().catch(console.error);

function extFromContentType(contentType?: string) {
  if (!contentType) return "";
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "application/pdf": ".pdf",
  };
  return map[contentType.toLowerCase()] || "";
}

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const formData = await request.formData();

    const imageField = formData.get("image") || formData.get("imageUrl");
    let imageUrl = "";

    if (!imageField) {
      return NextResponse.json(
        { success: false, error: "Image file or URL is required" },
        { status: 400 },
      );
    }

    if (imageField instanceof Blob) {
      const buffer = Buffer.from(await imageField.arrayBuffer());
      const originalName = (imageField as any).name || "image";
      const ext =
        path.extname(originalName) ||
        extFromContentType(imageField.type) ||
        ".jpg";
      const filename = `${uuid()}${ext}`;

      await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
      imageUrl = `/uploads/${filename}`;
    } else if (typeof imageField === "string") {
      const s = imageField.trim();

      if (s.startsWith("data:")) {
        const match = s.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
        if (!match || !match[2]) throw new Error("Invalid data URL format");

        const contentType = match[1];
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, "base64");
        const ext = extFromContentType(contentType) || ".jpg";
        const filename = `${uuid()}${ext}`;

        await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
        imageUrl = `/uploads/${filename}`;
      } else if (/^https?:\/\//i.test(s)) {
        const res = await fetch(s);
        if (!res.ok)
          throw new Error(`Failed to fetch image: ${res.statusText}`);

        const buffer = Buffer.from(await res.arrayBuffer());
        const contentType = res.headers.get("content-type") || undefined;
        const ext = extFromContentType(contentType) || ".jpg";
        const filename = `${uuid()}${ext}`;

        await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
        imageUrl = `/uploads/${filename}`;
      } else if (s.startsWith("/") || s.startsWith("uploads/")) {
        const normalizedPath = s.startsWith("/") ? s : `/${s}`;
        const fullPath = path.join(BASE_PUBLIC_DIR, normalizedPath);

        try {
          await fs.access(fullPath);
          imageUrl = normalizedPath;
        } catch {
          throw new Error(`Local image not found at ${normalizedPath}`);
        }
      } else {
        throw new Error(
          "Invalid image format. Must be file, URL, or base64 data",
        );
      }
    }
    let documentUrl = undefined;
    const documentField = formData.get("document");
    if (documentField instanceof Blob) {
      documentUrl = await uploadPdfBlob(documentField, {
        allowedExtensions: [".pdf"],
        allowedMimeTypes: ["application/pdf"],
        uploadPath: "documents",
        maxSize: 20 * 1024 * 1024,
      });
    }
    const name = formData.get("name")?.toString().trim();
    const description = formData.get("description")?.toString().trim() || "";
    const price = parseFloat(formData.get("price")?.toString() || "0");
    const html = formData.get("html")?.toString() || "";
    const isActive = formData.get("isActive")?.toString() === "true";

    if (!name || !imageUrl) {
      throw new Error("Name and image are required fields");
    }

    if (isNaN(price) || price < 0) {
      throw new Error("Price must be a valid positive number");
    }
    console.log(" dataname ",name, description, price, imageUrl, html, documentUrl);
    const product = await createProduct({
      name,
      description,
      price,
      image: imageUrl,
      html,
      document: documentUrl,
      isActive,
    });
    console.log(product);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create product",
      },
      { status: 400 },
    );
  }
}

export async function UPDATE(request: NextRequest) {
  try {
    await requireAdmin(request);
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
    await requireAdmin(request);
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
