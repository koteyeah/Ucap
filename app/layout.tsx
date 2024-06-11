import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UCap",
  description: "Check tintest design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <script async src='https://maps.googleapis.com/maps/api/js?key=AIzaSyANdk-7xD4KbN6tTR_3TODw0P1BUev42Cg&libraries=places' defer></script>

      <body className={inter.className} style={{overflow: 'hidden'}}>{children}</body>
    </html>
  );
}