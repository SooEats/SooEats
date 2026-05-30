import type { Metadata } from "next";
import { Alfa_Slab_One, Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/lib/cart-context";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { CateringChatBubble } from "@/components/chat/catering-chat-bubble";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const alfaSlabOne = Alfa_Slab_One({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["400"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "SOOEATS - Healthy Has Never Tasted This Good",
  description: "Fresh, healthy, and delicious high-protein meals crafted with care. Explore our menu, catering services, meal plans, and nutrition information.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${alfaSlabOne.variable} antialiased`}
      >
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <CartSidebar />
          <CateringChatBubble />
        </CartProvider>
      </body>
    </html>
  );
}
