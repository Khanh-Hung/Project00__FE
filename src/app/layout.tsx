import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/core/providers/AuthProvider";
import { AuthModal } from "@/components/auth/AuthModal";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Nyxoris Roleplay - Nền tảng Trò chuyện Nhân vật AI",
  description: "Trò chuyện, nhập vai và tương tác chân thực cùng các nhân vật AI đa dạng tính cách.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-screen overflow-hidden antialiased`}
    >
      <body className="h-screen overflow-hidden flex flex-col bg-[#18191c] text-zinc-100 font-sans">
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
