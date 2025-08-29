"use client";

import { useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { useConvex } from "convex/react";

export default function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const convex = useConvex();

  const convexQueryClient = useMemo(
    () => new ConvexQueryClient(convex),
    [convex],
  );
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            queryKeyHashFn: convexQueryClient.hashFn(),
            queryFn: convexQueryClient.queryFn(),
          },
        },
      }),
    [convexQueryClient],
  );

  useEffect(() => {
    convexQueryClient.connect(queryClient);
  }, [convexQueryClient, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
