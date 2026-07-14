import type { Metadata } from "next";

import "@/app/globals.css";
import { DemoStoreProvider } from "@/providers/demo-store-provider";

export const metadata: Metadata = {
  title: "PRD Forge",
  description: "Turn product ideas into clear, actionable requirements."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <a
          href="#main-content"
          className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <DemoStoreProvider>{children}</DemoStoreProvider>
      </body>
    </html>
  );
}
