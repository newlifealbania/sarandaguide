export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://sarandaguide.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/admin', '/api/']
      }
    ],
    sitemap: `${base}/sitemap.xml`
  };
}
