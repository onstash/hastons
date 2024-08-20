// components/FooterNavigation.tsx
import Link from 'next/link';
import { Property } from 'csstype';

export type BlogPostLinkWithTitleAndSlug = {
  title: string;
  slug: string;
  shortTitle?: string;
};

interface FooterNavigationProps {
  previousPost: BlogPostLinkWithTitleAndSlug | null;
  nextPost: BlogPostLinkWithTitleAndSlug | null;
}

function getJustifyContentStyle(previousPost: FooterNavigationProps["previousPost"], nextPost: FooterNavigationProps["nextPost"]): Property.JustifyContent {
  if (previousPost && nextPost) {
    return "space-around";
  }
  if (previousPost) {
    return "flex-start";
  }
  if (nextPost) {
    return "flex-end";
  }
  return "initial"
}

export const BlogPostFooterNavigation = ({ previousPost, nextPost }: FooterNavigationProps) => {
  if (!previousPost && !nextPost) {
    return null;
  }
  return (
    <footer style={{ marginTop: '2rem', borderTop: '1px solid #ddd' }}>
      <nav style={{ display: 'flex', justifyContent: getJustifyContentStyle(previousPost, nextPost) }}>
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
