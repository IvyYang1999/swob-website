import type { MetadataRoute } from 'next';
import docsRoutes from './docs-routes.json';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/sources', '/zh', '/zh/sources', ...docsRoutes].map(route => ({ url: 'https://swob.app' + route }));
}
