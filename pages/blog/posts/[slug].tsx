// import type {
//   InferGetStaticPropsType,
//   GetStaticProps,
//   GetStaticPaths,
// } from "next";

import { useRouter } from "next/router";

import MDXLayout from "@/blog/components/layout";
// import { getBlogPosts } from "@/blog/utils/posts";

export default function BlogPost(
  // props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const router = useRouter();
  return (
    <MDXLayout>
      <h1>{router.query.slug}</h1>
      {/* <h2>{JSON.stringify(router, null, 2)}</h2> */}
      {/* {props.post?.content} */}
    </MDXLayout>
  );
}

// // This function gets called at build time
// export async function getStaticProps({ params }) {
//   const blogPostForSlug = getBlogPosts().find(
//     (blogPost) => blogPost.slug === params.slug
//   );
//   console.log("@@ params", params);
//   console.log("@@ blogPostForSlug", blogPostForSlug);
//   if (!blogPostForSlug) {
//     return {
//       props: {
//         post: null
//       },
//     };
//   }
//   return {
//     props: {
//       post: blogPostForSlug
//     },
//   };
// }

// // This function gets called at build time
// export async function getStaticPaths() {
//   return {
//     paths: getBlogPosts().map((blogPost) => ({ params: blogPost })),
//     fallback: false,
//   };
// }
