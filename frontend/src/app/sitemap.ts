import type { MetadataRoute } from "next";

const BASE_URL = "https://mypapyr.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = [
    "/compress",
    "/merge",
    "/split",
    "/rotate",
    "/image-to-pdf",
    "/pdf-to-image",
    "/protect",
    "/unlock",
    "/watermark",
    "/sign",
    "/pdf-to-word",
    "/ocr",
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
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
