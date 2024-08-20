import { GetStaticPaths, GetStaticProps } from "next";

import { BlogPost } from '@/blog/components/BlogPost';

import {
  getAllMDXFilePaths,
  getMDXFileContent,
  getPreviousAndNextBlogPosts,
} from "@/blog/utils/markdown-util"; // Adjust path as needed

const _dir = "book-summaries";
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

export default BlogPost;
