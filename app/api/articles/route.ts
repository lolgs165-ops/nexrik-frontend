import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const first = 6; // 每次加载的数量

  const apiUrl = process.env.WORDPRESS_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ articles: [] });
  }

  try {
    // 直接使用 offset / size 分页（多数 WPGraphQL 支持）
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          {
            insights: posts(
              where: { categoryName: "insights", offsetPagination: { size: ${first}, offset: ${offset} } }
            ) {
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
    });

    const json = await res.json();
    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      return NextResponse.json({ articles: [] });
    }

    const articles = json.data?.insights?.nodes?.map((post: any) => ({
      id: post.id,
      slug: post.slug || post.id,
      title: post.title,
      date: new Date(post.date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      }).toUpperCase(),
      category: post.categories?.nodes[0]?.name || 'Insight',
      imageUrl: post.featuredImage?.node?.sourceUrl || '',
      excerpt: post.excerpt?.replace(/(<([^>]+)>)/gi, "") || ''
    })) || [];

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json({ articles: [] });
  }
}