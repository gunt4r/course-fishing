"use client";
import Loader from "@/components/Loader";
import { useParams } from "next/navigation";
import { useGetArticle } from "@/app/queries/articles/articlesQuery";
export default function StoryPage() {
  const { id } = useParams();
  const { data: article, isLoading } = useGetArticle(id as string);

  if (isLoading) return <Loader />;
  return (
    <main className="flex flex-col mt-20">
      <h1 className="text-center text-4xl">{article?.title}</h1>
      <section
        dangerouslySetInnerHTML={{ __html: article?.sanitizedHtml }}
      ></section>
    </main>
  );
}
