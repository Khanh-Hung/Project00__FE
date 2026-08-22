"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  User as UserIcon,
  Heart,
  Brain,
  Sparkles,
  RefreshCw,
  Info,
  Bookmark,
  Lock,
  Calendar,
  Star,
} from "lucide-react";
import { ChatSession, Character, CharacterMemory, MemoryType } from "@/types";
import { fetchCharacterMemories } from "@/lib/api";
import { AffectionStage, CATEGORY_MAP, formatPersonalityForUser } from "./chat.constants";

interface CharacterProfileSidebarProps {
  isOpen: boolean;
  session: ChatSession | null;
  currentStage: AffectionStage;
  affectionScore: number;
  onOpenAffectionModal: () => void;
  character?: Character | null;
}

export const CharacterProfileSidebar: React.FC<CharacterProfileSidebarProps> = ({
  isOpen,
  session,
  currentStage,
  affectionScore,
  onOpenAffectionModal,
  character,
}) => {
  const [activeTab, setActiveTab] = useState<"profile" | "memories">("profile");
  const [memories, setMemories] = useState<CharacterMemory[]>([]);
  const [isLoadingMemories, setIsLoadingMemories] = useState(false);

  const matchedCustom = character?.customMilestones?.find(
    (m) => affectionScore >= m.minScore && affectionScore <= m.maxScore
  );
  const milestoneDisplayName = matchedCustom ? matchedCustom.name : currentStage.name;

  const characterId = character?.id || session?.characterId;

  const loadMemories = useCallback(async () => {
    if (!characterId) return;
    try {
      setIsLoadingMemories(true);
      const data = await fetchCharacterMemories(characterId);
      setMemories(data || []);
    } catch (err) {
      console.warn("Failed to load character memories", err);
    } finally {
      setIsLoadingMemories(false);
    }
  }, [characterId]);

  // Load memories when character changes or sidebar opens
  useEffect(() => {
    if (isOpen && characterId) {
      loadMemories();
    }
  }, [isOpen, characterId, loadMemories]);

  // Helper for Memory Type Badge styling
  const getMemoryTypeInfo = (type: MemoryType | string | number) => {
    const typeNum = typeof type === "string" ? parseInt(type, 10) : type;
    switch (typeNum) {
      case MemoryType.UserFact:
      case 1:
        return {
          label: "Thông tin cá nhân",
          icon: Info,
          badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        };
      case MemoryType.UserPreference:
      case 2:
        return {
          label: "Sở thích & Thói quen",
          icon: Heart,
          badgeBg: "bg-pink-500/10 text-pink-400 border-pink-500/20",
        };
      case MemoryType.RelationshipEvent:
      case 3:
        return {
          label: "Kỷ niệm quan trọng",
          icon: Sparkles,
          badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        };
      case MemoryType.Secret:
      case 4:
        return {
          label: "Bí mật riêng tư",
          icon: Lock,
          badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        };
      default:
        return {
          label: "Ghi nhớ chung",
          icon: Bookmark,
          badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Vừa xong";
      if (diffMins < 60) return `${diffMins} phút trước`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} giờ trước`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} ngày trước`;
    } catch {
      return "Gần đây";
    }
  };

  return (
    <aside
      className={`flex flex-col h-full min-h-0 border-l border-[#26272e] bg-[#18191e] transition-all duration-300 ease-in-out shrink-0 z-20 overflow-hidden ${
        isOpen ? "w-80 sm:w-96" : "w-0 border-l-0"
      }`}
    >
      <div className="w-80 sm:w-96 flex flex-col h-full min-h-0">
        {/* Fixed Right Sub-Header with Dual Tabs */}
        <div className="flex h-13 shrink-0 items-center justify-between px-3 border-b border-[#26272e] bg-[#1a1b20]">
          <div className="flex items-center gap-1 bg-[#141518] p-1 rounded-xl border border-[#2b2c36]">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#252630] text-zinc-100 shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <UserIcon className="h-3.5 w-3.5 text-pink-400" />
              <span>Hồ Sơ</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("memories");
                loadMemories();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
                activeTab === "memories"
                  ? "bg-[#252630] text-zinc-100 shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Brain className="h-3.5 w-3.5 text-cyan-400" />
              <span>Ký Ức</span>
              {memories.length > 0 && (
                <span className="ml-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 px-1.5 py-0.2 text-[9px] font-extrabold text-cyan-300">
                  {memories.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === "memories" && (
            <button
              type="button"
              onClick={loadMemories}
              disabled={isLoadingMemories}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:bg-[#282932] hover:text-zinc-100 transition-all cursor-pointer disabled:opacity-50"
              title="Làm mới ký ức"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingMemories ? "animate-spin text-cyan-400" : ""}`} />
            </button>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {activeTab === "profile" ? (
            <>
              {/* Hero Character Portrait */}
              <div className="relative overflow-hidden rounded-2xl border border-[#363844] shadow-xl group">
                <img
                  src={session?.characterAvatar || "/placeholder-avatar.png"}
                  alt={session?.characterName}
                  className="w-full aspect-[4/3] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-black text-white">{session?.characterName}</h3>
                    {session?.characterCategory && (
                      <span className="rounded-lg bg-white/20 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/30">
                        {CATEGORY_MAP[session.characterCategory] || session.characterCategory}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-300 font-medium line-clamp-1">
                    {session?.characterTitle || session?.title}
                  </p>
                </div>
              </div>

              {/* Affection & Heart Level Card */}
              <div className="rounded-2xl border border-[#2e3038] bg-[#20222a] p-4 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className={`h-4 w-4 ${currentStage.heartColor}`} />
                    <span className={`text-xs font-bold ${currentStage.color}`}>
                      {milestoneDisplayName}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    {affectionScore > 0 ? `+${affectionScore}` : affectionScore} / 100
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-black/60">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${currentStage.barGradient} transition-all duration-500`}
                    style={{ width: `${Math.max(4, Math.min(100, (affectionScore + 100) / 2))}%` }}
                  />
                </div>

                {/* Mood status & Intensity */}
                <div className="flex items-center justify-between text-xs text-zinc-300 pt-1 border-t border-[#2c2e35]/60">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500 text-[11px]">Tâm trạng:</span>
                    <span className="font-semibold text-pink-300 bg-pink-950/40 px-2 py-0.5 rounded-lg border border-pink-800/30 text-[11px]">
                      {session?.currentMood || currentStage.currentMood}
                    </span>
                  </div>
                  {session?.moodIntensity !== undefined && (
                    <span className="text-[10px] font-mono text-zinc-400">
                      Cường độ: {session.moodIntensity}%
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onOpenAffectionModal}
                  className="w-full rounded-xl bg-[#2b2c36] hover:bg-[#343642] py-2 text-center text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer border border-[#3b3d4a]"
                >
                  Xem chi tiết cột mốc & đặc quyền →
                </button>
              </div>

              {/* Unlocked Relationship Events Card */}
              {session?.unlockedEvents && session.unlockedEvents.length > 0 && (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-4 space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                      Bước Ngoặt Quan Hệ Đã Mở Khóa ({session.unlockedEvents.length})
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {session.unlockedEvents.map((ev, idx) => (
                      <div key={idx} className="rounded-xl border border-amber-500/20 bg-[#1b1c23] p-2.5 text-xs space-y-0.5">
                        <div className="font-bold text-amber-300 text-[11px]">✨ {ev.eventKey}</div>
                        <div className="text-zinc-300 text-[11px]">{ev.context}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personality & Lore Card */}
              <div className="rounded-2xl border border-[#2e3038] bg-[#20222a] p-4 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Bối Cảnh & Mối Quan Hệ
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-normal whitespace-pre-wrap">
                  {formatPersonalityForUser(
                    session?.characterPersonality,
                    session?.characterName
                  ) || "Chưa có mô tả bối cảnh chi tiết."}
                </p>
              </div>
            </>
          ) : (
            /* MEMORIES TAB VIEW */
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Ký Ức Dài Hạn (Long-Term Memory)</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Những sự thật & kỷ niệm {character?.name || session?.characterName} đã ghi nhớ về bạn
                  </p>
                </div>
              </div>

              {isLoadingMemories && memories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <div className="h-8 w-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
                  <p className="text-xs text-zinc-400 font-medium">Đang đồng bộ ký ức từ não bộ AI...</p>
                </div>
              ) : memories.length === 0 ? (
                <div className="rounded-2xl border border-[#2c2e36] bg-[#1d1e24] p-6 text-center space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto">
                    <Brain className="h-6 w-6" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-200">Chưa có ký ức nào</h5>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      Hãy tiếp tục trò chuyện và chia sẻ sở thích, câu chuyện đời thường để {character?.name || "nhân vật"} ghi nhớ về bạn nhé! ✨
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {memories.map((mem) => {
                    const typeInfo = getMemoryTypeInfo(mem.type);
                    const TypeIcon = typeInfo.icon;
                    return (
                      <div
                        key={mem.id}
                        className="rounded-2xl border border-[#2f313c] bg-[#1e2027] p-3.5 space-y-2 hover:border-[#3f4150] transition-all shadow-xs group"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${typeInfo.badgeBg}`}
                          >
                            <TypeIcon className="h-3 w-3" />
                            <span>{typeInfo.label}</span>
                          </span>

                          <div className="flex items-center gap-0.5" title={`Tầm quan trọng: ${mem.importance}/5`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-2.5 w-2.5 ${
                                  i < mem.importance
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-zinc-700"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-zinc-200 font-medium leading-relaxed">
                          "{mem.content}"
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1.5 border-t border-[#2a2c36]/60">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatTimeAgo(mem.createdAt)}</span>
                          </span>
                          <span className="font-mono text-zinc-400">
                            Độ tin cậy: {Math.round(mem.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
