import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jathaka Katha — ජාතක කතා",
    short_name: "Jathaka Katha",
    description:
      "An immersive bilingual library of Sri Lankan Jataka tales for children, families and classrooms.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#FBF5E7",
    theme_color: "#1E3A2B",
    lang: "en",
    dir: "ltr",
    categories: ["education", "books", "kids"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
