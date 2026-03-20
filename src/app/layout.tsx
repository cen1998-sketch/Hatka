import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Хатка — Бронирование жилья в Томске",
  description: "Найдите идеальную хатку для вашего отдыха в Томске. Квартиры, дома, комнаты и отели.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased min-h-screen bg-[#F5F5F5] flex flex-col items-center">
        <header className="w-full flex justify-center border-b border-gray-100/50 bg-white/40 backdrop-blur-md sticky top-0 z-50">
          <Header />
        </header>
        <main className="w-full flex justify-center py-10 px-4 md:px-0">
          {children}
        </main>
      </body>
    </html>
  );
}
