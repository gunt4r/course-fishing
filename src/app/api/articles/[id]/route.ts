import {
  getArticleById,
  deleteArticle,
  updateArticle,
} from "@/services/articles/service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const article = await getArticleById(id);
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const deletedProduct = await deleteArticle(id);
    return NextResponse.json(
      { success: true, deletedProduct },
      { status: 200 },
    );
  } catch (error) {
    throw error;
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const data: any = {};
    formData.forEach((value: any, key: any) => {
      data[key] = value;
    });

    data.id = id;
    const updatedProduct = await updateArticle(id, data);
    return NextResponse.json(
      { success: true, updatedProduct },
      { status: 200 },
    );
  } catch (error) {
    throw error;
  }
}
