/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '100mb',
        },
    },
    images: {
        domains: ['res.cloudinary.com'], // Add this line
    },
    reactStrictMode: false,
};

export default nextConfig;
