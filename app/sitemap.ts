import type { MetadataRoute } from "next";
import { stories } from "@/content/stories";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/stories`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/teachers`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const storyRoutes: MetadataRoute.Sitemap = stories.flatMap((story) => {
    const detail = {
      url: `${base}/stories/${story.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
    const learn = {
      url: `${base}/stories/${story.slug}/learn`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    };
    if (!story.reader) return [detail, learn];
    return [
      detail,
      learn,
      {
        url: `${base}/stories/${story.slug}/read`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.75,
      },
    ];
  });

  return [...staticRoutes, ...storyRoutes];
}
