"use client";

import { useState, useEffect, useRef } from "react";
import { User, UserProfile, UpdateUserProfileRequest, UpdateProfileRequest } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { ImageCropperModal } from "@/components/ui/ImageCropperModal";
import {
  X,
  Edit3,
  Camera,
  Check,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface EditProfileModalProps {
  user: User;
  userProfile?: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (authReq: UpdateProfileRequest, profileReq: UpdateUserProfileRequest) => Promise<void>;
}

export function EditProfileModal({
  user,
  userProfile,
  isOpen,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState("");
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [rawAvatarImage, setRawAvatarImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  // Social Profile fields
  const [bio, setBio] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [interestsInput, setInterestsInput] = useState("");
  const [personalityTraitsInput, setPersonalityTraitsInput] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && isOpen) {
      setDisplayName(userProfile?.displayName || user.displayName || user.userName || "User");
      setUserName(user.userName || "");
      setAvatarUrl(userProfile?.avatarUrl || user.avatarUrl || "");
      setRawAvatarImage(userProfile?.avatarUrl || user.avatarUrl || null);
      setBio(userProfile?.bio || "");
      setStatusMessage(userProfile?.statusMessage || "");
      setInterestsInput(userProfile?.interests?.join(", ") || "Lập trình, Nghe nhạc, Nuôi mèo");
      setPersonalityTraitsInput(userProfile?.personalityTraits?.join(", ") || "Hướng nội, Ấm áp");
      setErrorMessage(null);
    }
  }, [user, userProfile, isOpen]);

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

      const parsedInterests = interestsInput
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);

      const parsedTraits = personalityTraitsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const authReq: UpdateProfileRequest = {
        displayName: displayName.trim(),
        avatarUrl: avatarUrl.trim(),
        userName: userName.trim() !== user.userName ? userName.trim() : undefined,
      };

      const profileReq: UpdateUserProfileRequest = {
        displayName: displayName.trim(),
        avatarUrl: avatarUrl.trim(),
        bio: bio.trim() || undefined,
        statusMessage: statusMessage.trim() || undefined,
        interests: parsedInterests,
        personalityTraits: parsedTraits,
      };

      await onSave(authReq, profileReq);
      onClose();
    } catch (err: any) {
      console.error("Save profile error:", err);
      setErrorMessage(err.message || "Cập nhật hồ sơ thất bại. Vui lòng thử lại!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-[#1c1d22] border border-[#2e3038] rounded-3xl shadow-2xl overflow-hidden text-zinc-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#292b33] bg-[#16171b]">
          <div className="flex items-center gap-2.5">
            <Edit3 className="h-5 w-5 text-zinc-200" />
            <h2 className="text-base sm:text-lg font-bold text-zinc-100">
              Chỉnh Sửa Hồ Sơ Cá Nhân
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-[#282a32] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 text-xs sm:text-sm text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#16171b] border border-[#292b33]">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Avatar
                src={avatarUrl}
                alt={displayName}
                size="xl"
                type="user"
                className="!h-24 !w-24 !rounded-full border-2 border-[#3b3d46] shadow-xl group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-xs text-zinc-300 hover:text-white font-semibold"
            >
              Đổi ảnh đại diện
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Basic Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Tên Hiển Thị <span className="text-zinc-400">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Hoàng Long"
                className="w-full rounded-xl border border-[#31333c] bg-[#141518] px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 focus:border-zinc-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Tên Người Dùng (@username)
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="username"
                className="w-full rounded-xl border border-[#31333c] bg-[#141518] px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 focus:border-zinc-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Status Message */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">
              Dòng Trạng Thái (Status Message)
            </label>
            <input
              type="text"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              placeholder="Đang nghe nhạc Lofi và viết code..."
              className="w-full rounded-xl border border-[#31333c] bg-[#141518] px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 focus:border-zinc-400 focus:outline-none"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">
              Tiểu Sử Bản Thân (Bio)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Giới thiệu đôi nét về bản thân, công việc, gu sống của bạn..."
              className="w-full rounded-2xl border border-[#31333c] bg-[#141518] p-3 text-xs sm:text-sm text-zinc-100 focus:border-zinc-400 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Interests & Personality */}
          <div className="p-4 rounded-2xl bg-[#16171b] border border-[#292b33] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
              <Sparkles className="h-4 w-4 text-zinc-400" />
              Sở Thích & Nét Tính Cách (Nhân vật AI sẽ đọc để chủ động bắt chuyện)
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">
                Sở Thích (Interests - Cách nhau bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                placeholder="Lập trình, Nuôi mèo, Hội họa, Du lịch..."
                className="w-full rounded-lg border border-[#31333c] bg-[#111215] px-3 py-2 text-xs text-zinc-100 focus:border-zinc-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">
                Nét Tính Cách (Personality Traits - Cách nhau bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={personalityTraitsInput}
                onChange={(e) => setPersonalityTraitsInput(e.target.value)}
                placeholder="Hướng nội, Ấm áp, Thích yên tĩnh..."
                className="w-full rounded-lg border border-[#31333c] bg-[#111215] px-3 py-2 text-xs text-zinc-100 focus:border-zinc-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#292b33] flex items-center justify-end gap-3 sticky bottom-0 bg-[#1c1d22]/95 backdrop-blur-sm">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#32353e] hover:bg-[#282a32] text-xs font-semibold text-zinc-300 transition-colors"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                  <span>Đang Lưu...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Lưu Hồ Sơ</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Cropper */}
        {isCropperOpen && rawAvatarImage && (
          <ImageCropperModal
            isOpen={isCropperOpen}
            imageSrc={rawAvatarImage}
            onSave={handleCropSave}
            onClose={() => setIsCropperOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
