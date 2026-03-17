import type { Metadata } from "next";
import "./globals.css";
import {
  seoConfig,
  organizationSchema,
  websiteSchema,
} from "../config/seo.config";

export const metadata: Metadata = seoConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="antialiased bg-white text-gray-900 selection:bg-orange-100 selection:text-orange-900">
        {children}
      </body>
    </html>
  );
}
