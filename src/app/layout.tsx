import type { Metadata } from "next";
import Script from "next/script";
import ThemeProvider from "@/components/Theme/Provider";
import I18Provider from "@/components/I18nProvider";

import "./globals.css";

const HEAD_SCRIPTS = process.env.HEAD_SCRIPTS as string;

export const metadata: Metadata = {
  title: "Deep Research",
  description: "Deep Rssearch with Google Gemini Models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="auto" suppressHydrationWarning>
      <head>
        {HEAD_SCRIPTS ? <Script id="headscript">{HEAD_SCRIPTS}</Script> : null}
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18Provider>{children}</I18Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
