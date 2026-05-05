import HomeClient from './HomeClient';

interface Product {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  tagColor: string;
}

interface Article {
  id: string;
  title: string;
  date: string;
  category: string;
  imageUrl: string;
  excerpt: string;
}

export default async function HomePage() {
  let products: Product[] = [];
  let articles: Article[] = [];

  const apiUrl = process.env.WORDPRESS_API_URL;

  if (apiUrl) {
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            {
              products: posts(where: {categoryName: "products"}, first: 3) {
                nodes {
                  id
                  slug
                  title
                  excerpt
                  featuredImage { node { sourceUrl } }
                  categories { nodes { name } }
                }
              }
              insights: posts(where: {categoryName: "insights"}, first: 2) {
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
        next: { revalidate: 3600 } // ISR 核心
      });

      const json = await res.json();

      // 处理产品
      if (json.data?.products?.nodes?.length > 0) {
        products = json.data.products.nodes.map((post: any, i: number) => ({
          id: post.slug || post.id,
          title: post.title,
          category: post.categories?.nodes[0]?.name || 'Product',
          imageUrl: post.featuredImage?.node?.sourceUrl || '',
          description: post.excerpt?.replace(/(<([^>]+)>)/gi, "") || '',
          tagColor: i === 0 ? 'accent-green' : i === 1 ? 'accent-orange' : 'accent-silver'
        }));
      }

      // 处理文章
      if (json.data?.insights?.nodes?.length > 0) {
        articles = json.data.insights.nodes.map((post: any) => ({
          id: post.slug || post.id,
          title: post.title,
          date: new Date(post.date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          }).toUpperCase(),
          category: post.categories?.nodes[0]?.name || 'Insight',
          imageUrl: post.featuredImage?.node?.sourceUrl || '',
          excerpt: post.excerpt?.replace(/(<([^>]+)>)/gi, "") || ''
        }));
      }
    } catch (error) {
      console.error('WordPress fetch failed:', error);
      // 保持空数组，页面优雅降级
    }
  }

  return <HomeClient initialProducts={products} initialArticles={articles} />;
}