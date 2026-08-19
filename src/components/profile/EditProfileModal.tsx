"use client";

import { useState, useEffect, useRef } from "react";
import { User, UpdateProfileRequest } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { ImageCropperModal } from "@/components/ui/ImageCropperModal";
import {
  X,
  Edit3,
  Camera,
  Check,
  Loader2,
  AlertCircle,
  Clock,
  Lock,
} from "lucide-react";

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (req: UpdateProfileRequest) => Promise<void>;
}

export function EditProfileModal({
  user,
  isOpen,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState("");
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [rawAvatarImage, setRawAvatarImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && isOpen) {
      setDisplayName(user.displayName || user.userName || "User");
      setUserName(user.userName || "");
      setAvatarUrl(user.avatarUrl || "");
      setRawAvatarImage(user.avatarUrl || null);
      setErrorMessage(null);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP, GIF)!");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Dung lượng ảnh tối đa là 10MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setRawAvatarImage(src);
      setIsCropperOpen(true);
      setErrorMessage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = (croppedDataUrl: string) => {
    setAvatarUrl(croppedDataUrl);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setErrorMessage("Tên hiển thị không được để trống.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);

      await onSave({
        displayName: displayName.trim(),
        avatarUrl: avatarUrl.trim(),
        userName: userName.trim() !== user.userName ? userName.trim() : undefined,
      });

      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Không thể cập nhật hồ sơ.");
    } finally {
      setIsSaving(false);
    }
  };

  const canChangeUserName = user.canChangeUserName ?? true;
  const nextChangeDate = user.nextUserNameChangeDate
    ? new Date(user.nextUserNameChangeDate).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#31333a] bg-[#212227] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2c2e35] px-6 py-5 sm:px-8 shrink-0 bg-[#212227]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2b2c34] text-zinc-200 border border-[#3b3d46]">
                <Edit3 className="h-4 w-4 text-pink-400" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-zinc-100">
                  Chỉnh sửa hồ sơ
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Cập nhật thông tin và ảnh đại diện của bạn
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-zinc-400 hover:bg-[#2b2c34] hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <form id="edit-profile-form" onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-3.5 text-xs font-medium text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Avatar Centered Section */}
            <div className="flex flex-col items-center justify-center pb-2">
              <div className="relative group">
                <Avatar
                  src={avatarUrl || user.avatarUrl}
                  alt={user.userName}
                  size="xl"
                  type="user"
                  className="!rounded-full !h-24 !w-24 border-2 border-[#3b3d46] shadow-xl"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                  title="Thay đổi ảnh đại diện"
                >
                  <Camera className="h-6 w-6" />
                  <span className="text-[10px] font-semibold mt-1">Đổi ảnh</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  Tải ảnh mới
                </button>
                {avatarUrl && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (rawAvatarImage || avatarUrl) {
                          setIsCropperOpen(true);
                        }
                      }}
                      className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      Cắt ảnh
                    </button>
                    <span className="text-zinc-600">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarUrl("");
                        setRawAvatarImage(null);
                      }}
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      Xóa
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Display Name Input */}
            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
                Tên hiển thị *
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="VD: Khánh Hưng, Mina, Hoàng Tử Gió..."
                className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#525562] focus:bg-[#1e2025] focus:outline-none transition-colors"
                required
              />
              <p className="text-[11px] text-zinc-400 mt-1">
                Tên gọi hiển thị khi giao tiếp, có thể đổi bất cứ lúc nào.
              </p>
            </div>

            {/* UserName Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-200">
                  Tên người dùng *
                </label>
                {!canChangeUserName && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                    <Lock className="h-2.5 w-2.5" />
                    <span>Chờ đến {nextChangeDate}</span>
                  </span>
                )}
              </div>

              <div className="relative">
                <span className="absolute left-4 top-2.5 text-sm font-semibold text-zinc-500">
                  @
                </span>
                <input
                  type="text"
                  disabled={!canChangeUserName}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="VD: khanhhung, shadow99..."
                  className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] pl-8 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#525562] focus:bg-[#1e2025] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  required
                />
              </div>

              <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3 text-zinc-500 shrink-0" />
                <span>
                  {canChangeUserName
                    ? "Tên định danh duy nhất (viết liền không dấu). Đổi tối đa 1 lần mỗi 14 ngày."
                    : `Bạn có thể đổi lại tên người dùng sau ngày ${nextChangeDate}.`}
                </span>
              </p>
            </div>
          </form>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 sm:px-8 border-t border-[#2c2e35] bg-[#1d1e23] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#3b3d46] bg-[#2b2c34] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-[#353740] hover:text-white transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              form="edit-profile-form"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-2 text-xs font-bold text-zinc-950 shadow-md hover:bg-white disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin text-zinc-900" />
              ) : (
                <Check className="h-4 w-4 text-zinc-900" />
              )}
              <span>{isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={rawAvatarImage || avatarUrl || null}
        onSave={handleCropSave}
        outputSize={512}
      />
    </>
  );
}
