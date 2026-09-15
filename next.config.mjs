/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.29.7", "192.168.162.189"],
  compress: true,
  poweredByHeader: false,
  experimental: {
    // Keep the compiler-API checker because Next 16.3.4's CLI capture path
    // returns empty stdout under the Node 20 deployment runtime.
    useTypeScriptCli: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
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
    ];
  },
  async redirects() {
    return [
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
    ];
  },
};

export default nextConfig;
