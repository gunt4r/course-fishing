import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';
// Define the base Next.js configuration
const baseConfig: NextConfig = {
  eslint: {
    dirs: ['.'],
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/': ['./migrations/**/*'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  serverExternalPackages: [
    'typeorm',
    'pg',
    'pg-native',
    'reflect-metadata',
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization.minimize = false;
      config.externals = [
        ...(config.externals || []),
        'typeorm',
        'pg',
        'pg-native',
        'pg-hstore',
      ];
    }
    return config;
  },
};

// Initialize the Next-Intl plugin
let configWithPlugins = createNextIntlPlugin('./src/libs/I18n.ts')(baseConfig);

if (process.env.ANALYZE === 'true') {
  configWithPlugins = withBundleAnalyzer({
    enabled: true,
  })(configWithPlugins);
}

const nextConfig = configWithPlugins;
export default nextConfig;