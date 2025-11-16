'use client';
import { useParams } from 'next/navigation';
import { useGetArticle } from '@/app/queries/articles/articlesQuery';
import Loader from '@/components/Loader';

export default function ReviewPage() {
  const { id } = useParams();
  const { data: article, isLoading } = useGetArticle(id as string);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <main className="mt-20 flex flex-col">
      <h1 className="text-center text-4xl">{article?.title}</h1>
      <section
        dangerouslySetInnerHTML={{ __html: article?.sanitizedHtml }}
      >
      </section>
    </main>
  );
}
