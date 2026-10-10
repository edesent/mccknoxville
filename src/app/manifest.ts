import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MCC Knoxville",
    short_name: "MCC Knoxville",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4fc",
    theme_color: "#120b33",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
