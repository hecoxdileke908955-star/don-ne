/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  async redirects() {
    return [
      {
        source: '/korean-house-cleaning-hanoi',
        destination: '/ve-sinh-nha-cua',
        permanent: true,
      },
      {
        source: '/korean-mattress-cleaning-hanoi',
        destination: '/giat-dem',
        permanent: true,
      },
      {
        source: '/korean-sofa-cleaning-hanoi',
        destination: '/giat-ghe-sofa',
        permanent: true,
      },
      {
        source: '/hanoi-house-cleaning-service',
        destination: '/ve-sinh-nha-cua',
        permanent: true,
      },
      {
        source: '/hanoi-mattress-cleaning-service',
        destination: '/giat-dem',
        permanent: true,
      },
      {
        source: '/hanoi-sofa-cleaning-service',
        destination: '/giat-ghe-sofa',
        permanent: true,
      },
      {
        source: '/khu-vuc-phuc-vu',
        destination: '/khu-vuc',
        permanent: true,
      },
      {
        source: '/cam-nang-ve-sinh',
        destination: '/cam-nang',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;