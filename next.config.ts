import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    /* AVIF first (better compression than WebP on photographic
       content), WebP fallback. Next.js negotiates via the Accept
       header automatically so old browsers still get something. */
    formats: ["image/avif", "image/webp"],
    /* The local assets in public/images/dental are content-addressed
       by filename — if we swap a photo we change the path. Safe to
       cache the transcoded variants for a year. */
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
