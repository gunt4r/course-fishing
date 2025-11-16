'use client';
import { useGetArticlesByType } from '@/app/queries/articles/articlesQuery';
import { ArticleEnum } from '@/config/enum';
import Card from '../Card';
import Grid from '../Grid';
import Loader from '../Loader';

export default function ClientReviews() {
  const { data: articles, isLoading } = useGetArticlesByType(
    ArticleEnum.review,
  );
  if (isLoading) {
    return <Loader />;
  }
  return (
    <Grid>
      {articles.map((article: any) => (
        <Card key={article.id} {...article} link={`/reviews/${article.id}`} />
      ))}
    </Grid>
  );
}
