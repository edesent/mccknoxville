import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/visit",
    "/watch",
    "/events",
    "/about",
    "/serve",
    "/being-christian-and-gay",
    "/give",
    "/prayer",
    "/contact",
    "/documents",
    "/resources",
  ].map((p) => ({
    url: `${siteUrl}${p}`,
    changeFrequency: p ? "monthly" : "weekly",
    priority: p ? 0.7 : 1,
  }));
}
