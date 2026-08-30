/** @type {import('next').NextConfig} */
const isPort5180 = process.argv.includes('5180') || process.env.PORT === '5180' || process.env.NEXT_DIST_DIR === '.next-5180';

const nextConfig = {
  distDir: isPort5180 ? '.next-5180' : '.next',
};

export default nextConfig;
