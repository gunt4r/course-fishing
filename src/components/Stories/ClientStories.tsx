'use client';
import { useGetArticlesByType } from '@/app/queries/articles/articlesQuery';
import { ArticleEnum } from '@/config/enum';
import Card from '../Card';
import Grid from '../Grid';
import Loader from '../Loader';

export default function ClientStories() {
  const { data: articles, isLoading } = useGetArticlesByType(
    ArticleEnum.testimonial,
  );
  if (isLoading) {
    return <Loader />;
  }
  return (
    <Grid>
      {articles.map((article: any) => (
        <Card key={article.id} {...article} link={`/stories/${article.id}`} />
      ))}
    </Grid>
  );
}
