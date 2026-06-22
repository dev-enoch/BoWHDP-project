"use client";

import React, { useState, useEffect } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Use state to ensure the QueryClient is only initialized once per session
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        staleTime: 1000 * 60 * 5, // 5 minutes before refetching in background
        refetchOnWindowFocus: true,
      },
    },
  }));

  const [persister, setPersister] = useState<any>(null);

  useEffect(() => {
    // We can only access window.localStorage on the client
    if (typeof window !== 'undefined') {
      const syncStoragePersister = createSyncStoragePersister({
        storage: window.localStorage,
      });
      setPersister(syncStoragePersister);
    }
  }, []);

  // During SSR or before hydration, render without persistence
  if (!persister) {
    return <>{children}</>;
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
