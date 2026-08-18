"use client";

import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/core/providers/AuthProvider";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Calendar,
  Sparkles,
  Shield,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout, openAuthModal } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openAuthModal();
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router, openAuthModal]);

  if (isLoading || !user) {
    return (
      <div className="h-full flex flex-col bg-[#18191c] text-zinc-100 overflow-hidden">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent"></span>
            <span>Đang tải thông tin cá nhân...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#18191c] text-zinc-100 overflow-hidden selection:bg-[#353740] selection:text-white">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại Trang chủ</span>
          </Link>

          {/* Profile Header Card */}
          <div className="relative overflow-hidden rounded-3xl border border-[#31333a] bg-[#212227] p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <Avatar
                src={user.avatarUrl}
                alt={user.userName}
                size="xl"
                type="user"
                className="!rounded-full !h-24 !w-24 border border-[#3b3d46] shadow-xl shrink-0"
              />

              {/* User Meta */}
              <div className="flex-1 text-center sm:text-left">
                <div className="mb-1.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
                    {user.userName}
                  </h1>
                </div>

                <p className="text-xs sm:text-sm text-zinc-400 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                  <Mail className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{user.email}</span>
                </p>

                <p className="text-xs text-zinc-400 mt-2 flex items-center justify-center sm:justify-start gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                  <span>
                    Tham gia: {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </div>

              {/* Logout button */}
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="flex items-center gap-1.5 rounded-xl border border-[#3b3d46] bg-[#2b2c34] px-4 py-2 text-xs font-semibold text-zinc-300 hover:border-rose-500/40 hover:bg-rose-950/40 hover:text-rose-300 transition-all cursor-pointer shrink-0"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>

          {/* Account Details Box - Full Width */}
          <div className="w-full rounded-2xl border border-[#31333a] bg-[#212227] p-6 sm:p-8 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-2.5 border-b border-[#2c2e35] pb-4 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2b2c34] text-zinc-300 border border-[#3b3d46]">
                <User className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-zinc-100">
                  Thông tin Tài khoản
                </h2>
                <p className="text-xs text-zinc-400">Chi tiết thông tin đăng nhập và tình trạng tài khoản của bạn</p>
              </div>
            </div>

            <div className="divide-y divide-[#2c2e35] text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-1 sm:gap-4">
                <span className="text-zinc-400 font-medium">Tên người dùng / Biệt danh</span>
                <span className="font-semibold text-zinc-100">{user.userName}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-1 sm:gap-4">
                <span className="text-zinc-400 font-medium">Địa chỉ Email</span>
                <span className="text-zinc-200 font-mono">{user.email}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-1 sm:gap-4">
                <span className="text-zinc-400 font-medium">Gói dịch vụ</span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#2b2c34] px-2.5 py-1 text-xs font-semibold text-zinc-200 border border-[#3b3d46] w-fit">
                  <Sparkles className="h-3 w-3 text-zinc-400" />
                  <span>Miễn phí</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-1 sm:gap-4">
                <span className="text-zinc-400 font-medium">Trạng thái xác thực</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Shield className="h-4 w-4" />
                  <span>Đã kích hoạt an toàn</span>
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
