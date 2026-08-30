/** @type {import('next').NextConfig} */
const isPort5180 = process.argv.includes('5180') || process.env.PORT === '5180' || process.env.NEXT_DIST_DIR === '.next-5180';
const isPort5173 = process.argv.includes('5173') || process.env.PORT === '5173' || process.env.NEXT_DIST_DIR === '.next-5173';

const nextConfig = {
  distDir: isPort5180 ? '.next-5180' : isPort5173 ? '.next-5173' : '.next',
};

export default nextConfig;
