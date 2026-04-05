import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    Wrap: ({ children }) => (
      <ConvexClientProvider>{children}</ConvexClientProvider>
    ),
  });

  return router;
}
