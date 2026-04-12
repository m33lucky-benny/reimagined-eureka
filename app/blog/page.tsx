import type { Metadata } from 'next';
import Link from 'next/link';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerList, StaggerItem } from '@/components/motion/StaggerList';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog — Caridina Shrimp Guides & Tips',
  description:
    'In-depth guides on Caridina shrimp care, tank setup, water parameters, and breeding for Singapore keepers.',
  openGraph: {
    title: 'Caridina Shrimp Blog | ebiya.sg',
    description:
      'Expert guides on Caridina shrimp keeping, water parameters, tank setup, and breeding in Singapore.',
    url: 'https://ebiya.sg/blog',
  },
};

export default function BlogPage() {
  const posts = getAllPosts().filter((p) => !p.slug.startsWith('YYYY'));

  return (
    <div className="page blog-page">
      <FadeIn>
        <h1>Blog</h1>
        <p className="blog-intro">
          Guides, tips, and deep dives on Caridina shrimp keeping in Singapore.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <StaggerList className="post-list">
          {posts.map((post) => (
            <StaggerItem key={post.slug} className="post-card">
              <Link href={`/blog/${post.slug}`} className="post-card-link">
                <div className="post-meta">
                  {post.date && (
                    <time dateTime={post.date} className="post-date">
                      {new Date(post.date).toLocaleDateString('en-SG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                  {post.categories && (
                    <span className="post-categories">
                      {post.categories.join(' · ')}
                    </span>
                  )}
                </div>
                <h2 className="post-title">{post.title}</h2>
                {post.description && <p className="post-excerpt">{post.description}</p>}
              </Link>
            </StaggerItem>
          ))}
        </StaggerList>
      </FadeIn>
    </div>
  );
}
