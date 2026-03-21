import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Хатка — Бронирование жилья в Томске",
  description: "Найдите идеальную хатку для вашего отдыха в Томске. Квартиры, дома, комнаты и отели.",
};

import { AuthProvider } from "@/components/auth-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased min-h-screen bg-[#F5F5F5] flex flex-col items-center">
        <AuthProvider>
          <Header />
          <main className="w-full flex justify-center py-10 px-4 md:px-0">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
