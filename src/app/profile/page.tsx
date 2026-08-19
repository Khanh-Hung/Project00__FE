"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/core/providers/AuthProvider";
import { updateUserProfile } from "@/lib/api";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Calendar,
  Sparkles,
  Shield,
  LogOut,
  ArrowLeft,
  Edit3,
  CheckCircle2,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout, openAuthModal, updateUser } = useAuth();
  const router = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

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

  const handleSaveProfile = async (req: any) => {
    const updatedUser = await updateUserProfile(req);
    updateUser(updatedUser);
    setSuccessToast("Cập nhật thông tin hồ sơ thành công!");
    setTimeout(() => setSuccessToast(null), 3500);
  };

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

          {/* Toast Notification */}
          {successToast && (
            <div className="mb-6 flex items-center gap-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs font-medium text-emerald-400 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {/* Profile Hero Card */}
          <div className="relative overflow-hidden rounded-3xl border border-[#31333a] bg-[#212227] p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
              {/* Avatar & User Meta */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left">
                <Avatar
                  src={user.avatarUrl}
                  alt={user.userName}
                  size="xl"
                  type="user"
                  className="!rounded-full !h-20 !w-20 sm:!h-24 sm:!w-24 border-2 border-[#3b3d46] shadow-xl shrink-0"
                />

                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-2">
                    {user.displayName || user.userName || "User"}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-zinc-500" />
                      <span>{user.email}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                      <span>
                        Tham gia:{" "}
                        {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#2b2c34] px-2 py-0.5 text-[11px] font-medium text-zinc-300 border border-[#3b3d46]">
                      <Sparkles className="h-3 w-3 text-zinc-400" />
                      <span>Gói: Miễn phí</span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                      <Shield className="h-3 w-3" />
                      <span>Đã kích hoạt an toàn</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions: Logout */}
              <div className="flex items-center">
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-[#3b3d46] bg-[#2b2c34] px-4 py-2 text-xs font-semibold text-zinc-300 hover:border-rose-500/40 hover:bg-rose-950/40 hover:text-rose-300 transition-all cursor-pointer shrink-0"
                  title="Đăng xuất"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>

          {/* Account Information Details Card */}
          <div className="w-full rounded-3xl border border-[#31333a] bg-[#212227] p-6 sm:p-8 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between border-b border-[#2c2e35] pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2b2c34] text-zinc-300 border border-[#3b3d46]">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-zinc-100">
                    Thông tin tài khoản
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Chi tiết định danh và trạng thái tài khoản trên hệ thống
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3.5 py-1.5 text-xs font-bold text-zinc-950 shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Chỉnh sửa</span>
              </button>
            </div>

            <div className="divide-y divide-[#2c2e35] text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-1 sm:gap-4">
                <span className="text-zinc-400 font-medium">Tên hiển thị</span>
                <span className="text-zinc-100 font-medium">
                  {user.displayName || user.userName}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-1 sm:gap-4">
                <span className="text-zinc-400 font-medium">Tên người dùng</span>
                <span className="text-zinc-100 font-medium">@{user.userName}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-1 sm:gap-4">
                <span className="text-zinc-400 font-medium">Địa chỉ Email</span>
                <span className="text-zinc-100 font-medium">{user.email}</span>
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

      {/* Edit Profile Modal Popup */}
      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
