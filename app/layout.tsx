import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saman Esmaellpour - Portfolio",
  description: "Full Stack Developer",
  alternates: {
    canonical: "https://es-saman.ir",
    languages: {
      "fa": "https://es-saman.ir/fa",
      "en": "https://es-saman.ir/en",
      "x-default": "https://es-saman.ir",
    },
  },
  openGraph: {
    title: "Saman Esmaellpour - Portfolio",
    description: "Full Stack Developer",
    // images: ["https://cdn.qepal.com/qepal/qecircabs.webp"],
    url: "https://es-saman.ir",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saman Esmaellpour - Portfolio",
    description: "Full Stack Developer",
    // images: ["https://cdn.qepal.com/qepal/qecircabs.webp"],
    // site: "@qepalcom",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Iconify - for icon-[...] classes used throughout the project */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@iconify/tailwind/dist/tailwind.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
