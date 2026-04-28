import type { MetadataRoute } from "next";

const BASE_URL = "https://mypapyr.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = [
    "/compress",
    "/merge",
    "/split",
    "/image-to-pdf",
    "/pdf-to-image",
  ];

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...tools.map((tool) => ({
      url: `${BASE_URL}${tool}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
