"use client";
import Grid from "../Grid";
import { useGetArticlesByType } from "@/app/queries/articles/articlesQuery";
import Loader from "../Loader";
import { ArticleEnum } from "@/config/enum";
import Card from "../Card";
import Title from "../Title";
import { useTranslations } from "next-intl";
export default function ClientStories() {
  const { data: articles, isLoading } = useGetArticlesByType(
    ArticleEnum.testimonial,
  );
  const t = useTranslations("Stories");
  if (isLoading) return <Loader />;
  return (
    <main className="mb-30">
      <Title additionalClassNames="text-3xl mt-20 uppercase mb-20">
        {t("title")}
      </Title>
      <Grid>
        {articles.map((article: any) => (
          <Card key={article.id} {...article} link={`/stories/${article.id}`} />
        ))}
      </Grid>
    </main>
  );
}
