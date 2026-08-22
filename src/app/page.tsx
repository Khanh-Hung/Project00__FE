"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import {
  Compass,
  Flame,
  Palette,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Zap,
  Shield,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="h-full flex flex-col bg-[#18191c] text-zinc-100 overflow-hidden selection:bg-[#353740] selection:text-white">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 space-y-20">
          {/* Main Hero Section */}
          <div className="relative overflow-hidden rounded-3xl border border-[#31333a] bg-gradient-to-b from-[#212227] to-[#1a1b1f] p-8 sm:p-14 shadow-2xl text-center flex flex-col items-center">
            {/* Background Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2b2c34] border border-[#3b3d46] text-xs font-semibold text-zinc-300 mb-6 shadow-inner">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Nền Tảng AI Nhập Vai Tương Tác Đa Chiều</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-100 tracking-tight max-w-3xl leading-tight">
              Chào Mừng Đến Với{" "}
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Nyxoris
              </span>
            </h1>

            <p className="mt-6 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
              Trải nghiệm thế giới nhân vật AI sống động với cá tính riêng biệt. Trò chuyện, kết nối và tự do sáng tạo câu chuyện của chính bạn.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/explore"
                className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-6 py-3.5 text-sm font-bold text-zinc-950 transition-all duration-200 hover:bg-white hover:shadow-lg hover:shadow-white/10 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Compass className="h-4 w-4" />
                <span>Khám Phá Nhân Vật</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>

              <Link
                href="/trending"
                className="flex items-center gap-2 rounded-2xl border border-[#3b3d46] bg-[#212227] px-6 py-3.5 text-sm font-semibold text-zinc-200 transition-all duration-200 hover:bg-[#2b2c34] hover:text-white active:scale-95 cursor-pointer"
              >
                <Flame className="h-4 w-4 text-amber-400" />
                <span>Bảng Xếp Hạng</span>
              </Link>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/explore"
              className="group rounded-3xl border border-[#31333a] bg-[#212227] p-6 hover:border-[#4a4d58] hover:bg-[#27282f] transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
                Trò Chuyện & Nhập Vai
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Khám phá hàng loạt nhân vật AI được thiết lập cốt truyện, tính cách và giọng điệu độc đáo.
              </p>
            </Link>

            <Link
              href="/studio"
              className="group rounded-3xl border border-[#31333a] bg-[#212227] p-6 hover:border-[#4a4d58] hover:bg-[#27282f] transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-400/10 text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Palette className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
                Studio Sáng Tạo
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Tự tay tạo ra nhân vật AI với phong cách thế giới, ngoại hình và quy tắc đối thoại riêng biệt.
              </p>
            </Link>

            <Link
              href="/trending"
              className="group rounded-3xl border border-[#31333a] bg-[#212227] p-6 hover:border-[#4a4d58] hover:bg-[#27282f] transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-400/10 text-rose-400 mb-4 group-hover:scale-110 transition-transform">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
                Thịnh Hành & Xếp Hạng
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Theo dõi các nhân vật nổi bật nhất theo tuần, tháng và toàn bộ các vũ trụ thể loại.
              </p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
