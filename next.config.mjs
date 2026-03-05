// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//         remotePatterns: [
//             {
//                 protocol: 'https',
//                 hostname: 'images.unsplash.com',
//                 port: '',
//                 pathname: '/**',
//             },

//             {
//                 protocol: 'https',
//                 hostname: 'api.startupsaga.in',
//                 port: '',
//                 pathname: '/media/**',
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'api.startupsaga.in',
//                 pathname: '/**',
//             },
//             {
//                 protocol: 'http',
//                 hostname: 'localhost',
//                 port: '8000',
//                 pathname: '/media/**',
//             },
//             {
//                 protocol: 'http',
//                 hostname: '127.0.0.1',
//                 port: '8000',
//                 pathname: '/media/**',
//             },
//         ],
//     },

//     async rewrites() {
//         return [
//             {
//                 source: '/admin/:path*',
//                 destination: 'http://127.0.0.1:8000/admin/:path*',
//             },
//             {
//                 source: '/api/:path*',
//                 destination: 'http://127.0.0.1:8000/api/:path*',
//             },
//             {
//                 source: '/static/:path*',
//                 destination: 'http://127.0.0.1:8000/static/:path*',
//             },
//             // {
//             //     source: '/media/:path*',
//             //     destination: 'http://127.0.0.1:8000/media/:path*',
//             // },
//         ];
//     },
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.startupsaga.in',
        pathname: '/**',
      },
    ],
    // Cache optimised images for 24 h on the server (avoids re-fetching from origin)
    minimumCacheTTL: 86400,
    // Prefer AVIF (much smaller) then WebP
    formats: ['image/avif', 'image/webp'],
    // Tighter set of widths → fewer variants to generate, faster cache hits
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.startupsaga.in/api/:path*',
      },
      {
        source: '/admin/:path*',
        destination: 'https://api.startupsaga.in/admin/:path*',
      },
      {
        source: '/static/:path*',
        destination: 'https://api.startupsaga.in/static/:path*',
      },
      {
        source: '/media/:path*',
        destination: 'https://api.startupsaga.in/media/:path*',
      },
    ];
  },
};

export default nextConfig;
