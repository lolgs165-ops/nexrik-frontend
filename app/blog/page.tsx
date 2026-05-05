import BlogListClient from './BlogListClient';

interface Article {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  imageUrl: string;
  excerpt: string;
}

export default async function BlogPage() {
  let articles: Article[] = [];

  try {
    const apiUrl = process.env.WORDPRESS_API_URL;
    if (apiUrl) {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            {
              insights: posts(where: {categoryName: "insights"}, first: 6) {
                nodes {
                  id
                  slug
                  title
                  date
                  excerpt
                  featuredImage { node { sourceUrl } }
                  categories { nodes { name } }
                }
              }
            }
          `
        }),
        next: { revalidate: 3600 }
      });

      const json = await res.json();
      if (json.data?.insights?.nodes?.length > 0) {
        articles = json.data.insights.nodes.map((post: any) => ({
          id: post.id,
          slug: post.slug || post.id,
          title: post.title,
          date: new Date(post.date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          }).toUpperCase(),
          category: post.categories?.nodes[0]?.name || 'Insight',
          imageUrl: post.featuredImage?.node?.sourceUrl || '',
          excerpt: post.excerpt?.replace(/(<([^>]+)>)/gi, "") || ''
        }));
      }
    }
  } catch (error) {
    console.error('Failed to fetch latest articles:', error);
  }

  return <BlogListClient initialArticles={articles} />;
}