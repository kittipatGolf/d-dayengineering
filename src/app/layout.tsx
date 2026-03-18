import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutChrome } from "@/components/layout-chrome";
import { AuthProvider } from "@/lib/auth/auth-context";
import { CartProvider } from "@/lib/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ดีย์แปดประตูม้วน | DEE8 SHUTTER DOOR",
  description: "บริษัท ดีย์แปด ประตูม้วน จำกัด — จำหน่าย ติดตั้ง ซ่อมประตูม้วน และอะไหล่ครบวงจร",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <LayoutChrome>{children}</LayoutChrome>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
