import type { ArticleType } from '@/types/article';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  try {
    const { type } = await params;
    const { getArticlesByType } = await import('@/services/articles/service');
    const article = await getArticlesByType(type as ArticleType);
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
