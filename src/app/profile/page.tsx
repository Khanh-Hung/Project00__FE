"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/core/providers/AuthProvider";
import { fetchUserProfile, updateUserProfile, updateAuthProfile } from "@/lib/api";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { UserProfile, UpdateProfileRequest, UpdateUserProfileRequest } from "@/types";
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
  Tag,
  Smile,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout, openAuthModal, updateUser } = useAuth();
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openAuthModal();
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router, openAuthModal]);

  useEffect(() => {
    const loadSocialProfile = async () => {
      if (user?.id) {
        try {
          setIsProfileLoading(true);
          const data = await fetchUserProfile(user.id);
          setUserProfile(data);
        } catch (err) {
          console.warn("Could not load user profile:", err);
        } finally {
          setIsProfileLoading(false);
        }
      }
    };

    if (user?.id) {
      loadSocialProfile();
    }
  }, [user?.id]);

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

  const handleSaveProfile = async (authReq: UpdateProfileRequest, profileReq: UpdateUserProfileRequest) => {
    try {
      // 1. Update Auth user
      const updatedUser = await updateAuthProfile(authReq);
      updateUser(updatedUser);

      // 2. Update Social Profile
      if (user.id) {
        const updatedSocial = await updateUserProfile(user.id, profileReq);
        setUserProfile(updatedSocial);
      }

      setSuccessToast("Cập nhật hồ sơ mạng xã hội thành công!");
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#18191c] text-zinc-100 overflow-hidden selection:bg-[#353740] selection:text-white">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại Trang chủ</span>
          </Link>

          {/* Toast Notification */}
          {successToast && (
            <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs font-medium text-emerald-400 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {/* Profile Hero Card */}
          <div className="relative overflow-hidden rounded-3xl border border-[#31333a] bg-[#212227] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
              {/* Avatar & User Meta */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <Avatar
                  src={userProfile?.avatarUrl || user.avatarUrl}
                  alt={user.userName}
                  size="xl"
                  type="user"
                  className="!rounded-full !h-20 !w-20 sm:!h-24 sm:!w-24 border-2 border-[#3b3d46] shadow-xl shrink-0"
                />

                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
                      {userProfile?.displayName || user.displayName || user.userName || "User"}
                    </h1>
                    <span className="text-xs text-zinc-400 font-medium">@{user.userName}</span>
                  </div>

                  {/* Status Message */}
                  {userProfile?.statusMessage && (
                    <p className="text-xs italic text-zinc-200 bg-[#2b2c34] px-3 py-1 rounded-full border border-[#3b3d46] w-fit mb-3">
                      💭 "{userProfile.statusMessage}"
                    </p>
                  )}

                  {/* Bio */}
                  {userProfile?.bio ? (
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl mb-3">
                      {userProfile.bio}
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-500 italic mb-3">
                      Chưa có tiểu sử bản thân. Hãy thêm bio để các nhân vật AI lướt xem và bắt chuyện nhé!
                    </p>
                  )}

                  {/* Interests & Personality Tags */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-2">
                    {userProfile?.interests?.map((interest, idx) => (
                      <span
                        key={`int-${idx}`}
                        className="inline-flex items-center gap-1 rounded-full bg-[#2b2c34] border border-[#3b3d46] px-2.5 py-0.5 text-[11px] font-medium text-zinc-300"
                      >
                        <Tag className="h-2.5 w-2.5 text-zinc-400" />
                        #{interest}
                      </span>
                    ))}
                    {userProfile?.personalityTraits?.map((trait, idx) => (
                      <span
                        key={`tr-${idx}`}
                        className="inline-flex items-center gap-1 rounded-full bg-[#2b2c34] border border-[#3b3d46] px-2.5 py-0.5 text-[11px] font-medium text-zinc-300"
                      >
                        <Smile className="h-2.5 w-2.5 text-zinc-400" />
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions: Edit & Logout */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Chỉnh sửa</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-[#3b3d46] bg-[#2b2c34] px-4 py-2 text-xs font-semibold text-zinc-300 hover:border-rose-500/40 hover:bg-rose-950/40 hover:text-rose-300 transition-all cursor-pointer shrink-0"
                  title="Đăng xuất"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Social Network Explainer Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#212227] border border-[#31333a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#2b2c34] border border-[#3b3d46] flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-zinc-300" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-zinc-100">
                  Mạng Xã Hội Tương Tác 2 Chiều Sống Động
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Khi bạn lướt xem nhân vật, họ cũng có thể lướt xem trang cá nhân của bạn, tìm thấy sở thích chung và <strong>chủ động gửi tin nhắn làm quen trước</strong>!
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold whitespace-nowrap transition-colors"
            >
              Khám phá nhân vật →
            </Link>
          </div>
        </main>
      </div>

      {/* Edit Profile Modal Popup */}
      <EditProfileModal
        user={user}
        userProfile={userProfile}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
