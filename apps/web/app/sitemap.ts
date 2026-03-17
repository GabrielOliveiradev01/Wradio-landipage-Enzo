import { MetadataRoute } from "next";
import { SITE_URL } from "../config/seo.config";

export default function sitemap(): MetadataRoute.Sitemap {
  // Data da última modificação
  const lastModified = new Date();

  // Rotas estáticas do site
  const routes = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/home`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    // Adicione aqui outras páginas estáticas
    // Exemplo:
    // {
    //   url: `${SITE_URL}/sobre`,
    //   lastModified,
    //   changeFrequency: "monthly" as const,
    //   priority: 0.8,
    // },
    // {
    //   url: `${SITE_URL}/contato`,
    //   lastModified,
    //   changeFrequency: "monthly" as const,
    //   priority: 0.7,
    // },
  ];

  // Se você tiver rotas dinâmicas (como posts de blog, produtos, etc),
  // pode buscar do banco de dados ou API aqui
  // Exemplo:
  // const posts = await getPosts();
  // const postRoutes = posts.map((post) => ({
  //   url: `${SITE_URL}/blog/${post.slug}`,
  //   lastModified: new Date(post.updatedAt),
  //   changeFrequency: "monthly" as const,
  //   priority: 0.6,
  // }));

  return [
    ...routes,
    // ...postRoutes, // Se tiver rotas dinâmicas
  ];
}
