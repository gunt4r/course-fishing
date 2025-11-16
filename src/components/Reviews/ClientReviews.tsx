"use client";
import Grid from "../Grid";
import { useGetArticlesByType } from "@/app/queries/articles/articlesQuery";
import Loader from "../Loader";
import { ArticleEnum } from "@/config/enum";
import Card from "../Card";
import { useTranslations } from "next-intl";
import Title from "../Title";
export default function ClientReviews() {
  const { data: articles, isLoading } = useGetArticlesByType(
    ArticleEnum.review,
  );
  const t = useTranslations("Reviews");
  if (isLoading) return <Loader />;
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
