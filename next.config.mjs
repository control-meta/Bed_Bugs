/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.29.7", "192.168.162.189"],
  compress: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    deviceSizes: [360, 420, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [50, 70, 72, 75, 78],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shmvcmwaqokemuobsuzn.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/blog-images/**",
      },
      {
        protocol: "https",
        hostname: "cdn.rankyak.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
        ],
      },

    ];
  },
  async redirects() {
    return [
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/bed-bug-treatment",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/frequently-asked-questions",
        destination: "/faq",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/bed-bug-treatment-in-bangalore",
        destination: "/bangalore",
        permanent: true,
      },
      {
        source: "/bed-bugs-treatment-in-mumbai",
        destination: "/mumbai",
        permanent: true,
      },
      {
        source: "/bed-bugs-control-in-pune",
        destination: "/pune",
        permanent: true,
      },
      {
        source: "/bed-bugs-control-in-delhi",
        destination: "/delhi",
        permanent: true,
      },
      {
        source: "/bed-bug-treatment-in-noida",
        destination: "/noida",
        permanent: true,
      },
      {
        source: "/locations/:city",
        destination: "/:city",
        permanent: true,
      },
      {
        source: "/locations",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
