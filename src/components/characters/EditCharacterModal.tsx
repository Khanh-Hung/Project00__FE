"use client";

import { useState, useRef, useEffect } from "react";
import { Character, UpdateCharacterRequest, RelationshipMilestone } from "@/types";
import { generateCharacterAvatar } from "@/lib/api";
import { ImageCropperModal } from "@/components/ui/ImageCropperModal";
import { getAffectionStage } from "@/components/chat/chat.constants";
import RelationshipMilestonesEditor from "./RelationshipMilestonesEditor";
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
  const [defaultAffectionScore, setDefaultAffectionScore] = useState<number>(0);
  const [defaultMood, setDefaultMood] = useState<string>("");
  const [customMilestones, setCustomMilestones] = useState<RelationshipMilestone[]>([]);
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
      setDefaultAffectionScore(character.defaultAffectionScore ?? 0);
      setDefaultMood(character.defaultMood || "");
      setCustomMilestones(character.customMilestones || []);
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
        defaultAffectionScore,
        defaultMood: defaultMood.trim() || undefined,
        customMilestones: customMilestones.length > 0 ? customMilestones : undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật nhân vật. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200">
        <div className="flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl border border-[#31333a] bg-[#1d1e23] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Fixed Header */}
          <div className="flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 border-b border-[#2c2e35] bg-[#1d1e23] shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Edit2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-100">Chỉnh sửa nhân vật</h2>
                <p className="text-xs text-zinc-400">Cập nhật thông tin và bối cảnh cho {character.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-zinc-400 hover:bg-[#282930] hover:text-zinc-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <form
            id="edit-character-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6"
          >
            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Row 1: Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Tên nhân vật *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Mina Hoshino, Aria, Kaelen..."
                className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#525562] focus:bg-[#1e2025] focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Row 2: Title & Category */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Danh xưng / Vai trò *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Nữ sinh thanh mai trúc mã, Nữ kiếm sĩ..."
                  className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#525562] focus:bg-[#1e2025] focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div className="relative" ref={categoryDropdownRef}>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Thể loại *</label>
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex w-full items-center justify-between rounded-2xl border border-[#31333a] bg-[#191a1e] px-4 py-2.5 text-sm text-zinc-100 focus:border-[#525562] focus:outline-none transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {(() => {
                      const sel = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
                      const Icon = sel.icon;
                      return (
                        <>
                          <Icon className={`h-4 w-4 ${sel.color}`} />
                          <span>{sel.label}</span>
                        </>
                      );
                    })()}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-zinc-400 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isCategoryOpen && (
                  <div className="absolute top-full left-0 right-0 z-30 mt-1.5 overflow-hidden rounded-2xl border border-[#31333a] bg-[#212227] shadow-xl animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-1.5 space-y-0.5 max-h-56 overflow-y-auto custom-scrollbar">
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = category === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setCategory(cat.id);
                              setIsCategoryOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-[#2d2f36] text-white"
                                : "text-zinc-400 hover:bg-[#282930] hover:text-zinc-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className={`h-3.5 w-3.5 ${cat.color}`} />
                              <span>{cat.label}</span>
                            </div>
                            {isSelected && <Check className="h-3.5 w-3.5 text-amber-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Row 3: Avatar Upload / Update Box */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Ảnh đại diện nhân vật
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
                    <div className="relative group flex items-center justify-center">
                      <img
                        src={avatarUrl}
                        alt="Avatar Preview"
                        className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-[#3b3d46] shadow-2xl ring-4 ring-black/30 bg-[#212227]"
                      />
                      {isGeneratingAvatar && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-xs">
                          <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleGenerateAvatarAi}
                        disabled={isGeneratingAvatar}
                        className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md hover:from-amber-300 hover:to-amber-200 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
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
                        Chỉnh sửa
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => !isGeneratingAvatar && handleGenerateAvatarAi()}
                      className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2 border-dashed border-[#3b3d46] bg-[#212227] text-zinc-400 hover:border-amber-400/60 hover:text-amber-300 cursor-pointer shadow-inner transition-all group"
                    >
                      {isGeneratingAvatar ? (
                        <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
                      ) : (
                        <Sparkles className="h-6 w-6 group-hover:scale-110 text-amber-400/80 group-hover:text-amber-300 transition-transform" />
                      )}
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={handleGenerateAvatarAi}
                        disabled={isGeneratingAvatar}
                        className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>AI Tự Vẽ Avatar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-2xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md"
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
                className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#525562] focus:bg-[#1e2025] focus:outline-none transition-colors leading-relaxed resize-none"
                required
              />
            </div>

            {/* Row 6: Tags */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Thẻ từ khóa (cách nhau bằng dấu phẩy)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#525562] focus:bg-[#1e2025] focus:outline-none transition-colors"
              />
            </div>

            {/* Row 7: Initial Affection & Relationship Level */}
            <div className="rounded-2xl border border-[#31333a] bg-[#191a1e] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-400" />
                  <span className="text-xs font-semibold text-zinc-200">
                    Cột mốc & Hảo cảm khởi đầu (Từ Cừu Hận Đến Tri Kỷ)
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-pink-400">
                  {defaultAffectionScore > 0 ? `+${defaultAffectionScore}` : defaultAffectionScore}% ({getAffectionStage(defaultAffectionScore).name})
                </span>
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
                {[
                  { score: -80, label: "💀 Kẻ Thù", desc: "-80%" },
                  { score: -40, label: "⚔️ Thù Địch", desc: "-40%" },
                  { score: 0, label: "👤 Người Lạ", desc: "0%" },
                  { score: 30, label: "🤝 Người Quen", desc: "+30%" },
                  { score: 55, label: "🌟 Bạn Thân", desc: "+55%" },
                  { score: 80, label: "💖 Tri Kỷ", desc: "+80%" },
                  { score: 95, label: "💍 Linh Hồn", desc: "+95%" },
                ].map((p) => {
                  const stage = getAffectionStage(p.score);
                  const currentSt = getAffectionStage(defaultAffectionScore);
                  const isSelected = currentSt.level === stage.level;

                  return (
                    <button
                      key={p.score}
                      type="button"
                      onClick={() => setDefaultAffectionScore(p.score)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-pink-950/40 border-pink-500/50 text-pink-200 ring-1 ring-pink-500/30"
                          : "bg-[#212229] border-[#31333d] text-zinc-400 hover:text-zinc-200 hover:bg-[#282a33]"
                      }`}
                    >
                      <span className="text-[11px] font-bold truncate">{p.label}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">{p.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Range Slider */}
              <div className="space-y-1 pt-1">
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={defaultAffectionScore}
                  onChange={(e) => setDefaultAffectionScore(parseInt(e.target.value, 10) || 0)}
                  className="w-full h-1.5 bg-[#2a2c38] rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 px-0.5">
                  <span>-100% (Cực Hận)</span>
                  <span>0% (Người Lạ)</span>
                  <span>+100% (Gắn Kết)</span>
                </div>
              </div>

              {/* Initial Mood */}
              <div className="pt-2 border-t border-[#292b34] space-y-1.5">
                <label className="block text-[11px] font-semibold text-zinc-400">
                  Tâm trạng khởi đầu của nhân vật (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={defaultMood}
                  onChange={(e) => setDefaultMood(e.target.value)}
                  placeholder="VD: Cực kỳ căm ghét & Sát khí, Khó chịu & Cay cú, Lạnh lùng & Đề phòng, Cởi mở, E thẹn..."
                  className="w-full rounded-xl border border-[#2d303b] bg-[#16171d] px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-[#525562] focus:outline-none transition-colors"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {[
                    "Cực kỳ căm ghét & Sát khí",
                    "Khó chịu & Cay cú",
                    "Lạnh lùng & Đề phòng",
                    "Cởi mở & Thân thiện",
                    "E thẹn & Ngại ngùng",
                    "Cung kính & Tận tụy",
                    "Ấm áp & Dịu dàng",
                  ].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDefaultMood(m)}
                      className="rounded-lg bg-[#242530] hover:bg-[#2e303d] px-2 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-200 border border-[#363847] transition-all cursor-pointer"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 7.5: Dynamic Relationship Milestones Editor */}
            <RelationshipMilestonesEditor
              milestones={customMilestones}
              onChange={setCustomMilestones}
            />

            {/* Row 8: Public / Private Switch */}
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
              className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-5 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-300 transition-colors cursor-pointer disabled:opacity-50 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>Lưu thay đổi</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={rawAvatarImage || avatarUrl}
        onSave={handleCropSave}
      />
    </>
  );
}
