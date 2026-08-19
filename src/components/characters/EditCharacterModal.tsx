"use client";

import { useState, useRef, useEffect } from "react";
import { Character, UpdateCharacterRequest } from "@/types";
import { generateCharacterAvatar } from "@/lib/api";
import { ImageCropperModal } from "@/components/ui/ImageCropperModal";
import {
  X,
  Edit2,
  Sparkles,
  Heart,
  Flame,
  Wand2,
  Swords,
  Bot,
  GraduationCap,
  ChevronDown,
  Check,
  Loader2,
  Upload,
  Globe,
  Lock,
} from "lucide-react";

interface EditCharacterModalProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (characterId: string, req: UpdateCharacterRequest) => Promise<void>;
}

const CATEGORIES = [
  { id: "Companion", label: "Bạn đồng hành", icon: Heart, color: "text-rose-400" },
  { id: "Anime", label: "Anime", icon: Flame, color: "text-amber-400" },
  { id: "Fantasy", label: "Kỳ ảo", icon: Wand2, color: "text-violet-400" },
  { id: "RPG", label: "Nhập vai", icon: Swords, color: "text-red-400" },
  { id: "Assistant", label: "Trợ lý", icon: Bot, color: "text-cyan-400" },
  { id: "Mentor", label: "Cố vấn", icon: GraduationCap, color: "text-emerald-400" },
];

export function EditCharacterModal({
  character,
  isOpen,
  onClose,
  onSubmit,
}: EditCharacterModalProps) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Companion");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [rawAvatarImage, setRawAvatarImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [personalityPrompt, setPersonalityPrompt] = useState("");
  const [greeting, setGreeting] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateAvatarAi = async () => {
    if (isGeneratingAvatar) return;
    try {
      setIsGeneratingAvatar(true);
      setError(null);
      const res = await generateCharacterAvatar({
        name: name.trim() || character?.name,
        title: title.trim() || character?.title,
        category: category || character?.category,
        personalityPrompt: personalityPrompt.trim() || character?.personalityPrompt,
      });

      if (res?.avatarUrl) {
        setAvatarUrl(res.avatarUrl);
        setRawAvatarImage(res.avatarUrl);
      }
    } catch {
      setError("Không thể vẽ ảnh đại diện tự động. Vui lòng thử lại!");
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  // Sync form state when character changes or modal opens
  useEffect(() => {
    if (character && isOpen) {
      setName(character.name || "");
      setTitle(character.title || "");
      setCategory(character.category || "Companion");
      setAvatarUrl(character.avatarUrl || "");
      setRawAvatarImage(character.avatarUrl || null);
      setPersonalityPrompt(character.personalityPrompt || "");
      setGreeting(character.greeting || "");
      setTagsInput(character.tags?.join(", ") || "");
      setIsPublic(character.isPublic ?? true);
      setError(null);
    }
  }, [character, isOpen]);

  // Handle outside click for category dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen || !character) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP, GIF)!");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Dung lượng ảnh tối đa là 10MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setRawAvatarImage(src);
      setIsCropperOpen(true);
      setError(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = (croppedDataUrl: string) => {
    setAvatarUrl(croppedDataUrl);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim() || !personalityPrompt.trim() || !greeting.trim() || !category) {
      setError("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const avatar = avatarUrl.trim();

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(character.id, {
        name: name.trim(),
        title: title.trim(),
        category,
        avatarUrl: avatar,
        personalityPrompt: personalityPrompt.trim(),
        greeting: greeting.trim(),
        tags,
        isPublic,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật nhân vật. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const SelectedIcon = selectedCategoryObj.icon;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-[#31333a] bg-[#212227] shadow-2xl overflow-hidden">
          {/* Fixed Header */}
          <div className="flex items-center justify-between border-b border-[#2c2e35] px-6 py-5 sm:px-8 sm:py-6 shrink-0 bg-[#212227]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2b2c34] text-zinc-200 border border-[#3b3d46]">
                <Edit2 className="h-4 w-4 text-pink-400" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-zinc-100">
                  Chỉnh Sửa: <span className="text-white">{character.name}</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">Cập nhật danh hiệu, tính cách, lời chào và ảnh đại diện</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-zinc-400 hover:bg-[#2b2c34] hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <form
            id="edit-character-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7 space-y-4.5 custom-scrollbar"
          >
            {error && (
              <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-3.5 text-xs text-rose-400">
                {error}
              </div>
            )}

            {/* Row 1: Name & Title */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Tên nhân vật *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Lina, Hiệp Sĩ Bóng Đêm, Elena..."
                  className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#525562] focus:bg-[#1e2025] focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Danh hiệu / Vai trò *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Bạn đồng hành dịu dàng, Phù thủy cổ đại..."
                  className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#525562] focus:bg-[#1e2025] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Row 2: Custom Category Dropdown */}
            <div className="relative" ref={categoryDropdownRef}>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Thể loại *</label>
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full flex items-center justify-between rounded-2xl border border-[#31333a] bg-[#191a1e] px-4 py-2.5 text-sm text-zinc-100 hover:border-[#464954] hover:bg-[#1e2025] transition-all cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <SelectedIcon className={`h-4 w-4 shrink-0 ${selectedCategoryObj.color}`} />
                  <span className="font-semibold">{selectedCategoryObj.label}</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 transition-transform duration-200 shrink-0 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isCategoryOpen && (
                <div className="absolute left-0 right-0 mt-1.5 overflow-hidden rounded-2xl border border-[#31333a] bg-[#212227] p-1.5 shadow-2xl backdrop-blur-xl z-20 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-0.5 max-h-48 overflow-y-auto custom-scrollbar">
                    {CATEGORIES.map((cat) => {
                      const active = category === cat.id;
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setCategory(cat.id);
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                            active
                              ? "bg-[#2f313a] text-zinc-100 border border-[#3f424c]"
                              : "text-zinc-300 hover:bg-[#282930] hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`h-4 w-4 ${cat.color}`} />
                            <span>{cat.label}</span>
                          </div>
                          {active && <Check className="h-3.5 w-3.5 text-zinc-100 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Row 3: Centered Avatar Upload / Update Box */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Ảnh đại diện nhân vật (Tùy chọn)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#31333a] bg-[#191a1e]/90 p-6 sm:p-7 text-center transition-all">
                {avatarUrl ? (
                  <>
                    <div className="relative group">
                      <img
                        src={avatarUrl}
                        alt="Avatar Preview"
                        className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-[#3b3d46] shadow-2xl ring-4 ring-black/30"
                      />
                    </div>

                    <p className="mt-3.5 max-w-sm text-xs sm:text-sm font-normal text-zinc-300 leading-relaxed">
                      Bạn đã thiết lập ảnh đại diện. Chọn ảnh mới hoặc chỉnh sửa ảnh hiện tại.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleGenerateAvatarAi}
                        disabled={isGeneratingAvatar}
                        className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md hover:from-amber-300 hover:to-amber-200 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        title="AI sẽ dựa vào tên và tính cách để vẽ lại một Avatar Anime khác"
                      >
                        {isGeneratingAvatar ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-950" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5 text-zinc-950" />
                        )}
                        <span>{isGeneratingAvatar ? "Đang vẽ ảnh..." : "AI Vẽ Lại Avatar"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-2xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
                      >
                        Chọn ảnh từ máy
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (rawAvatarImage || avatarUrl) {
                            setIsCropperOpen(true);
                          }
                        }}
                        className="rounded-2xl border border-[#3b3d46] bg-[#2b2c34] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-[#353740] hover:text-white active:scale-95 transition-all cursor-pointer"
                      >
                        Chỉnh sửa ảnh
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarUrl("");
                          setRawAvatarImage(null);
                        }}
                        className="rounded-2xl border border-transparent px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all cursor-pointer"
                      >
                        Xóa ảnh
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => !isGeneratingAvatar && handleGenerateAvatarAi()}
                      className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2 border-dashed border-[#3b3d46] bg-[#212227] text-zinc-400 hover:border-amber-400/60 hover:text-amber-300 cursor-pointer shadow-inner transition-all group"
                      title="Bấm để AI tự động phác họa Avatar"
                    >
                      {isGeneratingAvatar ? (
                        <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
                      ) : (
                        <Sparkles className="h-6 w-6 group-hover:scale-110 text-amber-400/80 group-hover:text-amber-300 transition-transform" />
                      )}
                    </div>

                    <p className="mt-3 max-w-sm text-xs sm:text-sm font-normal text-zinc-400 leading-relaxed">
                      Chưa có ảnh đại diện. Bạn có thể để <span className="text-amber-300 font-semibold">AI tự phác họa hình ảnh</span> hoặc chọn ảnh từ máy tính.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleGenerateAvatarAi}
                        disabled={isGeneratingAvatar}
                        className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md hover:from-amber-300 hover:to-amber-200 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        title="AI sẽ tự động phác họa bức tranh chân dung phù hợp với nhân vật"
                      >
                        {isGeneratingAvatar ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-950" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5 text-zinc-950" />
                        )}
                        <span>{isGeneratingAvatar ? "Đang vẽ ảnh..." : "AI Tự Vẽ Avatar"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-2xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
                      >
                        Chọn ảnh từ máy
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Row 4: Greeting */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Lời chào mở đầu *</label>
              <textarea
                rows={3}
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                placeholder="VD: *mỉm cười dịu dàng bước tới gần bạn* Chào bạn! Hôm nay của bạn thế nào?..."
                className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#525562] focus:bg-[#1e2025] focus:outline-none transition-colors leading-relaxed resize-none"
                required
              />
            </div>

            {/* Row 5: Personality Prompt */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Tính cách & Bối cảnh nhân vật *
              </label>
              <textarea
                rows={4}
                value={personalityPrompt}
                onChange={(e) => setPersonalityPrompt(e.target.value)}
                placeholder="VD: Bạn là một cô gái dịu dàng, ấm áp. Luôn xưng 'mình' gọi 'bạn', biết lắng nghe chân thành..."
                className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#525562] focus:bg-[#1e2025] focus:outline-none transition-colors leading-relaxed resize-none"
                required
              />
            </div>

            {/* Row 6: Tags */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Thẻ từ khóa (cách nhau bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="VD: dịu dàng, lắng nghe, anime, tâm sự, kỳ ảo..."
                className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#525562] focus:bg-[#1e2025] focus:outline-none transition-colors"
              />
            </div>

            {/* Row 7: Public / Private Switch */}
            <div className="flex items-center justify-between rounded-2xl border border-[#31333a] bg-[#191a1e] p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                    isPublic
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-200">
                    {isPublic
                      ? "Công khai (Mọi người đều có thể khám phá & trò chuyện)"
                      : "Riêng tư (Chỉ một mình bạn có thể thấy và trò chuyện)"}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {isPublic
                      ? "Nhân vật sẽ xuất hiện trên trang chủ và cộng đồng"
                      : "Nhân vật chỉ lưu trữ và hiển thị trong Studio của riêng bạn"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPublic ? "bg-emerald-500" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isPublic ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </form>

          {/* Fixed Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 sm:px-8 sm:py-5 border-t border-[#2c2e35] bg-[#1d1e23] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#3b3d46] bg-[#2b2c34] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-[#353740] hover:text-white transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              form="edit-character-form"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-2 text-xs font-bold text-zinc-950 shadow-md hover:bg-white disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin text-zinc-900" />
              ) : (
                <Check className="h-4 w-4 text-zinc-900" />
              )}
              <span>{isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
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
