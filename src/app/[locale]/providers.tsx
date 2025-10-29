"use client";
import { HeroUIProvider } from "@heroui/react";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <PostHogProvider>{children}</PostHogProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
