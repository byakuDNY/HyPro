import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

export const metadata: Metadata = {
  title: "HyPro - Your Hype and Project Management Tool in One Place",
  description:
    "HyPro is a web-based project management tool that helps you manage your projects.",
  icons: [
    {
      media: "(prefers-color-scheme: dark)",
      url: "/favicon-dark.svg",
      href: "/favicon-dark.svg",
    },
    {
      media: "(prefers-color-scheme: light)",
      url: "/favicon-light.svg",
      href: "/favicon-light.svg",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
