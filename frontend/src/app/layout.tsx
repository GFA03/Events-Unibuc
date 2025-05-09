import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import {Header} from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "University Events App",
    description: "Find and register for university events and workshops.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-gray-600 text-gray-900`}>
        <AppProviders>
            <Header />
            <main className="min-h-screen">
                {children}
            </main>
        </AppProviders>
        </body>
        </html>
    );
}