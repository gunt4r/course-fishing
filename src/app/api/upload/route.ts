import { NextResponse, NextRequest } from "next/server";
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

export async function POST(request: any) {
  try {
    const form = await request.formData();
    const fileName = form.get("name") || "image";
    const file = form.get(fileName);
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
    return NextResponse.json({ status: 201, url: relativePath });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 },
    );
  }
}
