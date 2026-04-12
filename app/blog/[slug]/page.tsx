import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { FadeIn } from '@/components/motion/FadeIn';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts()
    .filter((p) => !p.slug.startsWith('YYYY'))
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://ebiya.sg/blog/${slug}`,
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="page blog-post-page">
      <FadeIn>
        <header className="post-header">
          {post.date && (
            <time dateTime={post.date} className="post-date">
              {new Date(post.date).toLocaleDateString('en-SG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
          <h1>{post.title}</h1>
          {post.description && <p className="post-description">{post.description}</p>}
        </header>
      </FadeIn>

      <FadeIn delay={0.1}>
        <article className="post-body">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>
      </FadeIn>
    </div>
  );
}
