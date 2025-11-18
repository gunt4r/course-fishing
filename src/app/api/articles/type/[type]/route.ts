import type { ArticleType } from '@/types/article';
import { NextResponse } from 'next/server';
import { getArticlesByType } from '@/services/articles/service';
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  try {
    const { type } = await params;
    const article = await getArticlesByType(type as ArticleType);
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
