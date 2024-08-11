import Head from "next/head";

export const BlogPostSEOTags = ({
  title,
  description = "Santosh Venkatraman's Blog",
  url,
  datePublished,
  authorName,
  image = "https://coachwithsantosh.vercel.app/favicon.ico",
}: {
  title: string;
  description?: string;
  url: string;
  datePublished: string;
  authorName?: "Santosh Venkatraman"
  image?: string;
}) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    url: url,
    datePublished: datePublished,
    author: {
      "@type": "Person",
      name: authorName,
    },
    image: image,
    publisher: {
      "@type": "Person",
      name: "Santosh Venkatraman",
      // logo: {
      //   "@type": "ImageObject",
      //   url: "https://coachwithsantosh.vercel.app/favicon.ico", // Your site logo
      // },
    },
  };
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Santosh Venkatraman's Blog" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Head>
  );
};
