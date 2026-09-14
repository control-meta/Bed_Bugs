/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.29.7", "192.168.162.189"],
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
