import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), '_posts');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description?: string;
  categories?: string[];
  author?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDir)) return [];

  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(postsDir, filename), 'utf8');
      const { data } = matter(raw);
      // Strip date prefix from filename: 2025-05-21-my-post.md → my-post
      const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
      return {
        slug,
        title: (data.title as string) ?? slug,
        date: (data.date as string) ?? '',
        description: data.description as string | undefined,
        categories: data.categories as string[] | undefined,
        author: data.author as string | undefined,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1)); // newest first
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(postsDir)) return null;

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
  const match = files.find((f) => f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '') === slug);
  if (!match) return null;

  const raw = fs.readFileSync(path.join(postsDir, match), 'utf8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: (data.title as string) ?? slug,
    date: (data.date as string) ?? '',
    description: data.description as string | undefined,
    categories: data.categories as string[] | undefined,
    author: data.author as string | undefined,
    content,
  };
}
