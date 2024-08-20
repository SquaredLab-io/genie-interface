import { QueryClient } from "@tanstack/react-query";

// React Query client setup
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 30000
    }
  }
});
