import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPIDEY TRACKER // TACTICAL NETWORK & BRAND NEW DAY",
  description: "Official Spider-Man: Brand New Day worldwide tracking intelligence network, suit arsenal, tactical radar, and missions.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Chakra+Petch:wght@400;600;700&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#040c18] text-white m-0 p-0 overflow-hidden select-none font-mono">
        {children}
      </body>
    </html>
  );
}
