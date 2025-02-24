import { MetadataRoute } from "next";
import { meta } from "@lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: meta.URL,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1
    }
  ];
}
