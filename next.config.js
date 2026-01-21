/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repo = 'ai_discovery_scorecard';

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // basePath: isProd ? `/${repo}` : '',
    // assetPrefix: isProd ? `/${repo}/` : '',
    images: {
        unoptimized: true,
    },
}

module.exports = nextConfig;
