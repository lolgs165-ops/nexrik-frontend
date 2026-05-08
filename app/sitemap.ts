import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://nexrik.com',       // 你的主页
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,                     // 核心页面，权重最高
    },
    {
      url: 'https://nexrik.com/blog',  // 你的博客列表页
      lastModified: new Date(),
      changeFrequency: 'daily',        // 设为 daily，告诉谷歌你会经常在这里更新技术文章
      priority: 0.9,                   // 内容营销重地，权重仅次于主页
    }
  ];
}