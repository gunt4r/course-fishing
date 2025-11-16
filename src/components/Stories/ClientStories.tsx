"use client";
import Grid from "../Grid";
import { useGetArticlesByType } from "@/app/queries/articles/articlesQuery";
import Loader from "../Loader";
import { ArticleEnum } from "@/config/enum";
import Card from "../Card";
export default function ClientStories() {
  const { data: articles, isLoading } = useGetArticlesByType(
    ArticleEnum.testimonial,
  );
  if (isLoading) return <Loader />;
  return (
    <Grid>
      {articles.map((article: any) => (
        <Card key={article.id} {...article} link={`/stories/${article.id}`} />
      ))}
    </Grid>
  );
}
