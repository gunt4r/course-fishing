'use client';
import { useGetArticlesByType } from '@/app/queries/articles/articlesQuery';
import { ArticleEnum } from '@/config/enum';
import Card from '../Card';
import Grid from '../Grid';
import Loader from '../Loader';
import { useTranslations } from "next-intl";
import Title from "../Title";
export default function ClientReviews() {
    const t = useTranslations("Reviews");
  const { data: articles, isLoading } = useGetArticlesByType(
    ArticleEnum.review,
  );
  if (isLoading) {
    return <Loader />;
  }
  return (
    <main className="mb-30">
      <Title additionalClassNames="text-3xl mt-20 uppercase mb-20">
        {t("title")}
      </Title>
      <Grid>
        {articles.map((article: any) => (
          <Card key={article.id} {...article} link={`/reviews/${article.id}`} />
        ))}
      </Grid>
    </main>
  );
}
