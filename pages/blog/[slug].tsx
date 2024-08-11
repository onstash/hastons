import { GetStaticPaths, GetStaticProps } from "next";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

import MDXLayout from "@/blog/components/layout";
import { BlogPostHeaderNavigation } from "@/blog/components/HeaderNavigation";
import {
  BlogPostFooterNavigation,
  BlogPostLinkWithTitleAndSlug,
} from "@/blog/components/FooterNavigation";
import { BlogPostSEOTags } from "@/blog/components/SEO/BlogPostSEOTags";

import {
  getAllMDXFilePaths,
  getMDXFileContent,
  getPreviousAndNextBlogPosts,
} from "@/blog/utils/markdown-util"; // Adjust path as needed

const _dir = "";
const staticPaths = getAllMDXFilePaths(_dir);

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: staticPaths.paths,
    fallback: staticPaths.fallback,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  console.log("@@ getStaticProps", { slug, params });
  const slugWithDirPrefix = _dir?.length ? `${_dir}/${slug}` : slug;

  const staticBlogPostData = await getMDXFileContent(slugWithDirPrefix);
  const { previousBlogPost, nextBlogPost } =
    await getPreviousAndNextBlogPosts(slugWithDirPrefix);
  console.log(
    "@@ getPreviousAndNextBlogPosts()",
    { slug: slugWithDirPrefix, mdxFiles: staticPaths.mdxFiles },
    { previousBlogPost, nextBlogPost }
  );

  return {
    props: {
      ...staticBlogPostData,
      slug,
      footer: {
        previousBlogPost,
        nextBlogPost,
      },
    },
  };
};

const Post = ({
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
  return (
    <div>
      <BlogPostSEOTags
        title={frontmatter.title}
        url={`https://coachwithsantosh.vercel.app/blog/${slug}`}
        datePublished={frontmatter.publishedAt}
      />
      <MDXLayout>
        <BlogPostHeaderNavigation />
        <MDXRemote {...source} />
        <BlogPostFooterNavigation
          previousPost={footer.previousBlogPost}
          nextPost={footer.nextBlogPost}
        />
      </MDXLayout>
    </div>
  );
};

export default Post;
