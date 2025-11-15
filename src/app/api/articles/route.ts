import { getAllArticles, createArticle } from "@/services/articles/service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const articles = await getAllArticles();
    return NextResponse.json(articles);
  } catch (error) {
    throw NextResponse.json({ error });
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const entries = Object.fromEntries(form) as Record<
      string,
      FormDataEntryValue
    >;
    const payload: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(entries)) {
      if (value instanceof File) {
        payload[key] = value;
      } else {
        payload[key] = value as string;
      }
    }

    const article = await createArticle(payload as any);
    return NextResponse.json(article);
  } catch (error) {
    throw NextResponse.json({ error });
  }
}
