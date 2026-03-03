import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
 
const nextConfig: NextConfig = {
  // Configure pageExtensions to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // Optimize production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image Optimization - Modern formats and responsive sizes
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000,
  },
  
  async redirects() {
    return [
      {
        source: '/support-us',
        destination: '/contribute',
        permanent: true,
      },
      {
        source: '/:locale(ar|es|fr|en)/support-us',
        destination: '/:locale/contribute',
        permanent: true,
      },
    ];
  },

  // Security Headers - Protect against common web vulnerabilities
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          // Prevent DNS prefetch to external domains (privacy)
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          // Force HTTPS - Prevent SSL stripping attacks
          // max-age=63072000 = 2 years in seconds
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          // Prevent clickjacking by disallowing iframe embedding from other domains
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Enable browser XSS protection (legacy but adds defense in depth)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Control referrer information sent to external sites
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // Restrict access to sensitive device features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          // Content Security Policy - Comprehensive protection against XSS
          // Note: Using report-only mode initially to avoid breaking anything
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob: https://www.googletagmanager.com https://www.google-analytics.com",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com",
              "media-src 'self' blob:",
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'"
            ].join('; ')
          }
        ],
      },
    ];
  },
};

// Configure MDX with plugins
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      remarkGfm, // GitHub Flavored Markdown
    ],
    rehypePlugins: [
      rehypeSlug, // Add IDs to headings
      [rehypeAutolinkHeadings, { behavior: 'wrap' }], // Add links to headings
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }], // Open external links in new tab
    ],
  },
});
 
const withNextIntl = createNextIntlPlugin();

// Compose plugins: MDX first, then next-intl
export default withNextIntl(withMDX(nextConfig));