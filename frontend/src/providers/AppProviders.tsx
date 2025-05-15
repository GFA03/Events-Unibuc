'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import {EventsProvider} from "@/contexts/EventsContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
    // Initialize React Query client (ensure only one instance)
    console.log("Initializing React Query client...");
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5, // 5 minutes
                retry: 1, // Retry failed requests once
                refetchOnWindowFocus: false, // Optional: disable refetch on window focus
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <EventsProvider>
                    {children}
                    <Toaster position="top-right" /> {/* Position for toast notifications */}
                </EventsProvider>
            </AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} /> {/* Dev tools for React Query */}
        </QueryClientProvider>
    );
}