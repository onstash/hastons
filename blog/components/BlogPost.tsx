import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { BlogPostFooterNavigation, BlogPostLinkWithTitleAndSlug } from "./FooterNavigation";
import { BlogPostSEOTags } from "./SEO/BlogPostSEOTags";
import MDXLayout from "./layout";
import { BlogPostHeaderNavigation } from "./HeaderNavigation";
import { formatHumanReadableDate } from "../utils/date-util";

export const BlogPost = ({
  source,
  frontmatter,
  slug,
  footer,
}: {
  source: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, unknown>
  >;
  frontmatter: Record<string, any>;
  slug: string;
  footer: {
    previousBlogPost: BlogPostLinkWithTitleAndSlug;
    nextBlogPost: BlogPostLinkWithTitleAndSlug;
  };
}) => {
  console.log('@@ BlogPost footer', footer);
  return (
    <div>
      <BlogPostSEOTags
        title={frontmatter.title}
        url={`https://coachwithsantosh.vercel.app/blog/${slug}`}
        datePublished={frontmatter.publishedAt}
      />
      <MDXLayout>
        <BlogPostHeaderNavigation />
        <h1>{frontmatter.title}</h1>
        <h4>{formatHumanReadableDate(new Date(frontmatter.publishedAt))}</h4>
        <MDXRemote {...source} />
        <BlogPostFooterNavigation
          previousPost={footer.previousBlogPost}
          nextPost={footer.nextBlogPost}
        />
      </MDXLayout>
    </div>
  );
};