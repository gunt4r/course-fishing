import type { ArticleType } from '@/types/article';
import sanitize from 'sanitize-html';
import { ArticleEnum } from '@/config/enum';
import { getDataSource } from '@/libs/DB';
import { sanitizeOptions } from '@/libs/SanitizeOptions';
import { Article } from '@/models/article';

export async function getAllArticles() {
  try {
    const dataSource = await getDataSource();
    const articleRepository = dataSource.getRepository(Article);
    const articles = await articleRepository.find({
      order: { createdAt: 'DESC' },
    });
    return articles;
  } catch (error) {
    throw error;
  }
}
export async function getArticlesByType(type: keyof typeof ArticleEnum) {
  const dataSource = await getDataSource();
  const articleRepository = dataSource.getRepository(Article);
  try {
    const articles = await articleRepository.find({
      where: { type: ArticleEnum[type] as ArticleType },
      order: { createdAt: 'DESC' },
      take: 10,
    });
    return articles;
  } catch (error) {
    throw error;
  }
}

export async function getArticleById(id: string) {
  try {
    const dataSource = await getDataSource();
    const articleRepository = dataSource.getRepository(Article);
    const article = await articleRepository.findOneBy({ id });
    return article;
  } catch (error) {
    throw error;
  }
}

export async function createArticle(data: any) {
  try {
    const dataSource = await getDataSource();
    const articleRepository = dataSource.getRepository(Article);
    const { html, type, title, image, isActive } = data;
    if (!html || !type || !title || !image) {
      throw new Error('All fields are required');
    }
    const sanitizedHtml = sanitize(html, sanitizeOptions);

    const article = articleRepository.create({
      html,
      type,
      title,
      image,
      isActive,
      sanitizedHtml,
    });
    await articleRepository.save(article);
    return article;
  } catch (error) {
    throw error;
  }
}

export async function updateArticle(id: string, data: Partial<Article>) {
  try {
    const dataSource = await getDataSource();
    const articleRepository = dataSource.getRepository(Article);
    const article = await articleRepository.findOneBy({ id });
    if (!article) {
      throw new Error('Article not found');
    }
    const { html } = data;
    if (html) {
      const sanitizedHtml = sanitize(html, sanitizeOptions);
      data.sanitizedHtml = sanitizedHtml;
    }
    Object.assign(article, data);
    await articleRepository.save(article);
    return article;
  } catch (error) {
    throw error;
  }
}

export async function deleteArticle(id: string): Promise<Article> {
  const dataSource = await getDataSource();
  const articleRepository = dataSource.getRepository(Article);
  try {
    const article = await getArticleById(id);
    if (!article) {
      throw new Error('Article not found');
    }
    await articleRepository.remove(article);
    return article;
  } catch (error) {
    throw error;
  }
}
