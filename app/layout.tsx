import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saman Esmaeilpour",
  description: "Personal Portfolio Website",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body>
        {children}
      </body>
    </html>
  );
}