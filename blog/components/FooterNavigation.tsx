// components/FooterNavigation.tsx
import Link from 'next/link';

export type BlogPostLinkWithTitleAndSlug = { title: string; slug: string };

interface FooterNavigationProps {
  previousPost: BlogPostLinkWithTitleAndSlug | null;
  nextPost: BlogPostLinkWithTitleAndSlug | null;
}

export const BlogPostFooterNavigation = ({ previousPost, nextPost }: FooterNavigationProps) => {
  return (
    <footer style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid #ddd' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
        {previousPost ? (
          <Link href={`/blog/${previousPost.slug}`}>
            <span style={{fontSize: 12}}>&larr; Previous: {previousPost.title}</span>
          </Link>
        ) : <span />}
        
        {nextPost ? (
          <Link href={`/blog/${nextPost.slug}`}>
            <span style={{fontSize: 12}}>Next: {nextPost.title} &rarr;</span>
          </Link>
        ) : <span />}
      </nav>
    </footer>
  );
};
