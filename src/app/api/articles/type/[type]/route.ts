import { getArticlesByType } from "@/services/articles/service";
import { NextResponse } from "next/server";
import { ArticleType } from "@/types/article";
export async function GET(
  req: Request,
  { params }: { params: { type: string } },
) {
  try {
    const { type } = await params;
    const article = await getArticlesByType(type as ArticleType);
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
