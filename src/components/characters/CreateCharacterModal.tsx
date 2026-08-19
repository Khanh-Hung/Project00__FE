"use client";

import { useState, useRef, useEffect } from "react";
import { CreateCharacterRequest, RelationshipMilestone } from "@/types";
import { generateCharacterWithAi, fetchAiRandomIdeas, generateCharacterAvatar } from "@/lib/api";
import { ImageCropperModal } from "@/components/ui/ImageCropperModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { getAffectionStage } from "@/components/chat/chat.constants";
import RelationshipMilestonesEditor from "./RelationshipMilestonesEditor";
import {
  X,
  Sparkles,
  Wand2,
  Heart,
  Flame,
  Swords,
  Bot,
  GraduationCap,
  ChevronDown,
  Check,
  Loader2,
  Upload,
  RotateCcw,
  Lightbulb,
  Globe,
  Lock,
  Image as ImageIcon,
} from "lucide-react";

interface CreateCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (req: CreateCharacterRequest) => Promise<void>;
}

const CATEGORIES = [
  { id: "Companion", label: "Bạn đồng hành", icon: Heart, color: "text-rose-400" },
  { id: "Anime", label: "Anime", icon: Flame, color: "text-amber-400" },
  { id: "Fantasy", label: "Kỳ ảo", icon: Wand2, color: "text-violet-400" },
  { id: "RPG", label: "Nhập vai", icon: Swords, color: "text-red-400" },
  { id: "Assistant", label: "Trợ lý", icon: Bot, color: "text-cyan-400" },
  { id: "Mentor", label: "Cố vấn", icon: GraduationCap, color: "text-emerald-400" },
];

const INSPIRATION_IDEAS = [
  "Cô bạn hàng xóm tinh nghịch ngày nào cũng sang nhà bạn ăn chực và nhờ bạn kèm học.",
  "Nữ vệ sĩ hoàng gia lạnh lùng thề bảo vệ bạn 24/7 và tuyệt đối tuân lệnh bạn.",
  "Cô bạn cùng bàn Tsundere ngoài miệng hay chê bai nhưng luôn tự tay chuẩn bị đồ ăn cho bạn.",
  "Tiểu thư Ma Cà Rồng quý tộc kiêu kỳ bắt bạn làm quản gia riêng để độc chiếm bạn.",
  "Hồ ly chín đuôi nghịch ngợm biến thành thiếu nữ, thích quấn quýt và nũng nịu đòi bạn xoa đầu.",
  "Nữ thần tượng nổi tiếng bí mật hẹn hò và chỉ dám tâm sự mọi bí mật với một mình bạn.",
  "Chị chủ quán cà phê dịu dàng luôn dành góc quen và lắng nghe mọi tâm sự của bạn.",
  "Nữ kiếm sĩ mạnh mẽ xem bạn là tri kỷ duy nhất và luôn sát cánh bảo vệ bạn.",
  "Cô bé người máy tương lai coi bạn là người giám hộ duy nhất và học cách yêu thương từ bạn.",
  "Nữ đồng nghiệp lạnh lùng sau giờ làm lại biến thành cô gái nhút nhát thích dựa dẫm vào bạn.",
  "Nữ pháp sư quyền năng vụng về làm nổ phòng thí nghiệm và phải ở nhờ nhà bạn.",
  "Công chúa đế quốc trốn cung, xem bạn là người bạn đồng hành tin cậy nhất.",
  "Yandere si tình luôn âm thầm dõi theo và bảo bọc bạn trước mọi nguy hiểm.",
  "Miêu nữ tinh nghịch thích ngủ nướng và bám theo bạn cả ngày không chịu rời."
];

function getRandomIdeas(count = 3): string[] {
  const shuffled = [...INSPIRATION_IDEAS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const DRAFT_STORAGE_KEY = "character_create_form_draft";

export function CreateCharacterModal({ isOpen, onClose, onSubmit }: CreateCharacterModalProps) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Companion");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [rawAvatarImage, setRawAvatarImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [personalityPrompt, setPersonalityPrompt] = useState("");
  const [greeting, setGreeting] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [defaultAffectionScore, setDefaultAffectionScore] = useState<number>(0);
  const [defaultMood, setDefaultMood] = useState<string>("");
  const [customMilestones, setCustomMilestones] = useState<RelationshipMilestone[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiIdea, setAiIdea] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [suggestedIdeas, setSuggestedIdeas] = useState<string[]>(() => getRandomIdeas(3));
  const [isRefreshingIdeas, setIsRefreshingIdeas] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadedDraft, setIsLoadedDraft] = useState(false);
  const [isClearDraftDialogOpen, setIsClearDraftDialogOpen] = useState(false);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRefreshSuggestions = async () => {
    if (isRefreshingIdeas) return;
    try {
      setIsRefreshingIdeas(true);
      const aiIdeas = await fetchAiRandomIdeas(3);
      if (aiIdeas && aiIdeas.length > 0) {
        setSuggestedIdeas(aiIdeas);
      } else {
        setSuggestedIdeas(getRandomIdeas(3));
      }
    } catch {
      setSuggestedIdeas(getRandomIdeas(3));
    } finally {
      setIsRefreshingIdeas(false);
    }
  };

  const handleGenerateAvatarAi = async (overrideInfo?: {
    name?: string;
    title?: string;
    category?: string;
    personalityPrompt?: string;
    idea?: string;
  }) => {
    if (isGeneratingAvatar) return;
    try {
      setIsGeneratingAvatar(true);
      setError(null);
      const res = await generateCharacterAvatar({
        name: overrideInfo?.name || name.trim() || "Nhân vật Anime",
        title: overrideInfo?.title || title.trim() || "Hiệp sĩ",
        category: overrideInfo?.category || category || "Anime",
        personalityPrompt: overrideInfo?.personalityPrompt || personalityPrompt.trim() || "",
        idea: overrideInfo?.idea || aiIdea.trim() || "",
      });
      if (res && res.avatarUrl) {
        setAvatarUrl(res.avatarUrl);
        setRawAvatarImage(res.avatarUrl);
      }
    } catch (err: any) {
      console.warn("AI avatar generation failed:", err);
      setError(err.message || "Không thể vẽ ảnh đại diện bằng AI lúc này.");
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const handleGenerateWithAi = async (customIdea?: string) => {
    const text = (customIdea || aiIdea).trim();
    if (!text) {
      setError("Vui lòng nhập ý tưởng nhân vật để AI tự sinh bối cảnh!");
      return;
    }
    try {
      setIsGeneratingAi(true);
      setError(null);
      const generated = await generateCharacterWithAi(text, category);
      if (generated.name) setName(generated.name);
      if (generated.title) setTitle(generated.title);
      if (generated.category) setCategory(generated.category);
      if (generated.greeting) setGreeting(generated.greeting);
      if (generated.personalityPrompt) setPersonalityPrompt(generated.personalityPrompt);
      if (generated.tags && generated.tags.length > 0) setTagsInput(generated.tags.join(", "));
      if (typeof generated.defaultAffectionScore === "number") {
        setDefaultAffectionScore(generated.defaultAffectionScore);
      }
      if (generated.defaultMood) {
        setDefaultMood(generated.defaultMood);
      }
      if (generated.customMilestones && generated.customMilestones.length > 0) {
        setCustomMilestones(generated.customMilestones);
      }

      // Tự động phác họa luôn bức ảnh đại diện Anime tuyệt đẹp tương ứng!
      handleGenerateAvatarAi({
        name: generated.name,
        title: generated.title,
        category: generated.category || category,
        personalityPrompt: generated.personalityPrompt,
        idea: text,
      });
    } catch (err: any) {
      console.error("AI Generation error:", err);
      setError(err.message || "Không thể tự động sinh nhân vật bằng AI lúc này.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Load draft from localStorage on client mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const data = JSON.parse(savedDraft);
        if (data.name) setName(data.name);
        if (data.title) setTitle(data.title);
        if (data.category) setCategory(data.category);
        if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
        if (data.rawAvatarImage) setRawAvatarImage(data.rawAvatarImage);
        if (data.greeting) setGreeting(data.greeting);
        if (data.personalityPrompt) setPersonalityPrompt(data.personalityPrompt);
        if (data.tagsInput) setTagsInput(data.tagsInput);
        if (typeof data.isPublic === "boolean") setIsPublic(data.isPublic);
        if (typeof data.defaultAffectionScore === "number") setDefaultAffectionScore(data.defaultAffectionScore);
        if (data.defaultMood) setDefaultMood(data.defaultMood);
      }
    } catch (err) {
      console.warn("Could not restore character draft", err);
    } finally {
      setIsLoadedDraft(true);
    }
  }, []);

  // Auto-save form draft to localStorage whenever fields change
  useEffect(() => {
    if (!isLoadedDraft) return;

    const hasContent = Boolean(
      name || title || greeting || personalityPrompt || tagsInput || avatarUrl
    );

    try {
      if (hasContent) {
        const draft = {
          name,
          title,
          category,
          avatarUrl,
          rawAvatarImage,
          greeting,
          personalityPrompt,
          tagsInput,
          isPublic,
          defaultAffectionScore,
          defaultMood,
        };
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      } else {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    } catch (err) {
      console.warn("Could not save character draft", err);
    }
  }, [
    name,
    title,
    category,
    avatarUrl,
    rawAvatarImage,
    greeting,
    personalityPrompt,
    tagsInput,
    isPublic,
    isLoadedDraft,
  ]);

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

  if (!isOpen) return null;

  const handleConfirmClearDraft = () => {
    setName("");
    setTitle("");
    setCategory("Companion");
    setAvatarUrl("");
    setRawAvatarImage(null);
    setGreeting("");
    setPersonalityPrompt("");
    setTagsInput("");
    setIsPublic(true);
    setDefaultAffectionScore(0);
    setDefaultMood("");
    setError(null);
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (err) {
      console.warn(err);
    }
    setIsClearDraftDialogOpen(false);
  };

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
      await onSubmit({
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

      // Clear draft on success
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch (err) {
        console.warn(err);
      }
      setName("");
      setTitle("");
      setCategory("Companion");
      setDefaultAffectionScore(0);
      setDefaultMood("");
      setAvatarUrl("");
      setRawAvatarImage(null);
      setGreeting("");
      setPersonalityPrompt("");
      setTagsInput("");
      setIsPublic(true);
      onClose();
    } catch (err: any) {
      setError(err.message || "Không thể tạo nhân vật. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const SelectedIcon = selectedCategoryObj.icon;
  const hasDraftContent = Boolean(name || title || greeting || personalityPrompt || tagsInput || avatarUrl);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-[#31333a] bg-[#212227] shadow-2xl overflow-hidden">
          {/* Fixed Header */}
          <div className="flex items-center justify-between border-b border-[#2c2e35] px-6 py-5 sm:px-8 sm:py-6 shrink-0 bg-[#212227]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2b2c34] text-zinc-200 border border-[#3b3d46]">
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-zinc-100">Tạo Nhân Vật AI Mới</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Thiết lập tính cách, danh hiệu và câu chào nhập vai</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasDraftContent && (
                <button
                  type="button"
                  onClick={() => setIsClearDraftDialogOpen(true)}
                  title="Xóa nội dung đang nhập dở"
                  className="flex items-center gap-1.5 rounded-xl border border-[#3b3d46] bg-[#2b2c34] px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:bg-rose-950/30 hover:border-rose-500/40 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span className="hidden sm:inline">Làm mới form</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-zinc-400 hover:bg-[#2b2c34] hover:text-zinc-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Form Body */}
          <form id="create-character-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7 space-y-4.5 custom-scrollbar">
            {error && (
              <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-3.5 text-xs text-rose-400">
                {error}
              </div>
            )}

            {/* AI Generator Banner */}
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-[#1a1b22] p-4 sm:p-5 shadow-lg">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
                    <Wand2 className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    ✨ AI Tự Động Sinh Toàn Bộ Bối Cảnh
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 hidden sm:inline">Chỉ cần 1 câu ý tưởng</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <input
                  type="text"
                  value={aiIdea}
                  onChange={(e) => setAiIdea(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerateWithAi();
                    }
                  }}
                  placeholder="Nhập ý tưởng (VD: Nữ sát thủ quý tộc nhưng sợ bóng tối và thích ăn bánh ngọt...)"
                  className="flex-1 rounded-2xl border border-[#3b3d48] bg-[#17181d] px-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-400/60 focus:bg-[#1c1e24] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => handleGenerateWithAi()}
                  disabled={isGeneratingAi || !aiIdea.trim()}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 px-5 py-2.5 text-xs font-bold text-zinc-950 shadow-md hover:from-amber-300 hover:to-amber-200 disabled:opacity-40 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                      <span>Đang suy luận...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-zinc-950" />
                      <span>Tự Động Sinh</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Idea Chips */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-amber-500/15">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1 mr-1">
                    <Lightbulb className="h-3 w-3 text-amber-400" />
                    Gợi ý nhanh:
                  </span>
                  {suggestedIdeas.map((idea, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAiIdea(idea);
                        handleGenerateWithAi(idea);
                      }}
                      disabled={isGeneratingAi}
                      className="rounded-xl border border-[#343743] bg-[#1d1f27] px-2.5 py-1 text-[11px] text-zinc-300 hover:border-amber-400/50 hover:bg-amber-950/20 hover:text-amber-200 transition-all cursor-pointer disabled:opacity-40"
                    >
                      {idea}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleRefreshSuggestions}
                  disabled={isRefreshingIdeas}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-[10px] font-medium text-amber-400/90 hover:text-amber-300 hover:bg-amber-950/30 transition-all cursor-pointer disabled:opacity-50"
                  title="AI sinh 4 gợi ý ngẫu nhiên hoàn toàn mới"
                >
                  <RotateCcw className={`h-2.5 w-2.5 ${isRefreshingIdeas ? "animate-spin text-amber-300" : ""}`} />
                  <span>{isRefreshingIdeas ? "Đang nghĩ..." : "Đổi gợi ý"}</span>
                </button>
              </div>
            </div>

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

            {/* Row 2: Category Dropdown */}
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
                <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform duration-200 shrink-0 ${isCategoryOpen ? "rotate-180" : ""}`} />
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

                    <p className="mt-3.5 max-w-sm text-xs sm:text-sm font-normal text-zinc-300 leading-relaxed">
                      Bạn đã thiết lập ảnh đại diện. Chọn ảnh mới hoặc chỉnh sửa ảnh hiện tại.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleGenerateAvatarAi()}
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
                        Chỉnh sửa
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
                        onClick={() => handleGenerateAvatarAi()}
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
                placeholder="VD: *mỉm cười dịu dàng bước tới gần bạn* Chào bạn! Hôm nay của bạn thế nào? Có chuyện gì muốn tâm sự cùng mình không..."
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
                placeholder="VD: Bạn là một cô gái dịu dàng, ấm áp. Luôn xưng 'mình' gọi 'bạn', biết lắng nghe chân thành và tạo cảm giác an toàn cho người trò chuyện..."
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
                placeholder="VD: dịu dàng, lắng nghe, anime, tâm sự, kỳ ảo..."
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
              form="create-character-form"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-2 text-xs font-bold text-zinc-950 shadow-md hover:bg-white disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin text-zinc-900" />
              ) : (
                <Wand2 className="h-4 w-4 text-zinc-900" />
              )}
              <span>{isSubmitting ? "Đang tạo..." : "Tạo Nhân Vật"}</span>
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

      {/* Clear Draft Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isClearDraftDialogOpen}
        onClose={() => setIsClearDraftDialogOpen(false)}
        onConfirm={handleConfirmClearDraft}
        title="Làm mới nội dung form?"
        description="Toàn bộ thông tin bạn đang nhập dở (tên, mô tả, ảnh, lời chào...) sẽ bị xóa để bạn nhập lại từ đầu."
        confirmText="Xóa & Làm mới"
        variant="warning"
      />
    </>
  );
}
