import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Update this with your actual production domain
  const baseUrl = 'https://notesphere.vercel.app'
  
  const routes = [
    '',
    '/about',
    '/community',
    '/leaderboard',
    '/notes',
    '/help',
    '/privacy',
    '/terms',
    '/report',
    '/requests',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
}
