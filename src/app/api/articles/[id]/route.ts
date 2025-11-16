import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { getArticleById } = await import('@/services/articles/service');
    const article = await getArticleById(id);
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { deleteArticle } = await import('@/services/articles/service');
    const deletedProduct = await deleteArticle(id);
    return NextResponse.json(
      { success: true, deletedProduct },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { updateArticle } = await import('@/services/articles/service');
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
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
