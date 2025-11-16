import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";

const BASE_UPLOAD_DIR = path.join(process.cwd(), "public");

async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.mkdir(dirPath, { recursive: true });
    } else {
      throw error;
    }
  }
}

export interface UploadOptions {
  allowedExtensions?: string[];

  allowedMimeTypes?: string[];

  uploadPath?: string;

  maxSize?: number;
}
export async function uploadFile(
  request: NextRequest,
  fieldName: string,
  options: UploadOptions = {},
): Promise<string> {
  const {
    allowedExtensions = [".pdf"],
    allowedMimeTypes = ["application/pdf"],
    uploadPath = "uploads",
    maxSize = 10485760,
  } = options;

  const uploadDir = path.join(BASE_UPLOAD_DIR, uploadPath);
  await ensureDirectoryExists(uploadDir);

  const formData = await request.formData();
  const file = formData.get(fieldName);

  if (!file) {
    throw new Error(`Отсутствует файл в поле "${fieldName}"`);
  }

  if (!(file instanceof Blob)) {
    throw new Error(`Неверный тип данных в поле "${fieldName}"`);
  }

  if (file.size > maxSize) {
    throw new Error(
      `Файл слишком большой. Максимальный размер: ${maxSize / 1024 / 1024}MB`,
    );
  }

  if (allowedMimeTypes.length && !allowedMimeTypes.includes(file.type)) {
    throw new Error(
      `Недопустимый тип файла. Разрешены: ${allowedMimeTypes.join(", ")}`,
    );
  }

  const originalName = file.name || "file";
  const ext = path.extname(originalName).toLowerCase();

  if (allowedExtensions.length && !allowedExtensions.includes(ext)) {
    throw new Error(
      `Недопустимое расширение файла. Разрешены: ${allowedExtensions.join(", ")}`,
    );
  }

  const safeFilename = `${uuidv4()}${ext}`;
  const fullPath = path.join(uploadDir, safeFilename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(fullPath, buffer);

  return `/${uploadPath}/${safeFilename}`;
}

export async function uploadPdfBlob(
  fileBlob: Blob, 
  options: UploadOptions = {}
): Promise<string> {
  const {
    allowedExtensions = [".pdf"],
    allowedMimeTypes = ["application/pdf"],
    uploadPath = "documents",
    maxSize = 10485760,
  } = options;

  const uploadDir = path.join(BASE_UPLOAD_DIR, uploadPath);
  await ensureDirectoryExists(uploadDir);

  if (allowedMimeTypes.length && !allowedMimeTypes.includes(fileBlob.type)) {
    throw new Error(`Invalid file type. Allowed: ${allowedMimeTypes.join(", ")}`);
  }

  if (fileBlob.size > maxSize) {
    throw new Error(`File too large. Max size: ${maxSize / 1024 / 1024}MB`);
  }

  const originalName = (fileBlob as any).name || "file.pdf";
  const ext = path.extname(originalName).toLowerCase();
  
  if (allowedExtensions.length && !allowedExtensions.includes(ext)) {
    throw new Error(`Invalid file extension. Allowed: ${allowedExtensions.join(", ")}`);
  }

  const safeFilename = `${uuidv4()}${ext}`;
  const fullPath = path.join(uploadDir, safeFilename);

  const buffer = Buffer.from(await fileBlob.arrayBuffer());
  await fs.writeFile(fullPath, buffer);

  return `/${uploadPath}/${safeFilename}`;
}