"use client";

import React from "react";
import { X, Heart, Trophy, ShieldCheck, Lock, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ChatSession, Character } from "@/types";
import { AffectionStage, AFFECTION_STAGES, ThemeConfig, THEMES } from "./chat.constants";

interface AffectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: ChatSession | null;
  currentStage: AffectionStage;
  affectionScore: number;
  theme?: ThemeConfig;
  character?: Character | null;
}

export const AffectionModal: React.FC<AffectionModalProps> = ({
  isOpen,
  onClose,
  session,
  currentStage,
  affectionScore,
  theme,
  character,
}) => {
  if (!isOpen) return null;

  const themeConfig = theme || THEMES.cyan;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-[#31333a] bg-[#1a1b22] shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Fixed Modal Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#2a2c36] px-6 bg-[#16171d]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#282933] border border-[#393c4a] text-zinc-300">
              <Heart className={`h-4 w-4 fill-current ${themeConfig.badgeText}`} />
            </div>
            <div>
              <h3 className="font-bold text-zinc-100 text-sm">Hồ Sơ Tình Cảm & Mối Quan Hệ</h3>
              <p className="text-[11px] text-zinc-400 font-normal">
                Tiến trình cảm xúc giữa bạn và {session?.characterName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:bg-[#282932] hover:text-zinc-100 transition-all cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Scrollable Modal Body (1 Thanh Cuộn Duy Nhất) */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 space-y-5">
          {/* Current Stage Hero Banner */}
          <div className="rounded-2xl border border-[#2d303b] bg-gradient-to-b from-[#21232d] to-[#191a21] p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-4 pb-4 border-b border-[#292b36]">
              <div className="relative shrink-0">
                <Avatar
                  src={session?.characterAvatar}
                  alt={session?.characterName || "AI"}
                  size="lg"
                  type="character"
                  className={`!rounded-2xl border-2 ${themeConfig.thoughtBorder} shadow-md h-14 w-14`}
                />
                <span
                  className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full ${themeConfig.dotColor} text-[9px] font-black text-zinc-950 shadow-xs`}
                >
                  {currentStage.level}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="text-base font-extrabold text-white truncate">
                    {session?.characterName}
                  </h4>
                  <span
                    className={`rounded-xl px-2.5 py-0.5 text-[10px] font-bold border ${currentStage.badgeBg} ${currentStage.badgeBorder} ${currentStage.color}`}
                  >
                    Cấp {currentStage.level}: {currentStage.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                  <span className="text-zinc-400 text-[11px]">Tâm trạng hiện tại:</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-lg border text-[11px] ${themeConfig.chipBg} ${themeConfig.chipBorder} ${themeConfig.chipText}`}
                  >
                    {session?.currentMood || currentStage.currentMood}
                  </span>
                </div>
              </div>
            </div>

            {/* Big Progress Bar */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300">Tiến trình quan hệ & hảo cảm</span>
                <span className={`font-mono font-bold text-sm ${themeConfig.badgeText}`}>
                  {affectionScore > 0 ? `+${affectionScore}` : affectionScore} <span className="text-zinc-500 text-xs font-normal">/ 100</span>
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/50 p-0.5 border border-[#333644]">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${currentStage.barGradient} transition-all duration-700 shadow-sm`}
                  style={{ width: `${Math.max(4, Math.min(100, (affectionScore + 100) / 2))}%` }}
                />
              </div>
              <p className="text-xs text-zinc-400 italic pt-1 leading-relaxed">
                "{currentStage.description}"
              </p>
            </div>
          </div>

          {/* Stage Milestones List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>
                  {character?.customMilestones && character.customMilestones.length > 0
                    ? `Cột Mốc Quan Hệ Độc Quyền (${character.customMilestones.length} mốc)`
                    : "7 Cột Mốc Mối Quan Hệ (Từ Cừu Hận Đến Tri Kỷ)"}
                </span>
              </span>
              <span className="text-[11px] text-zinc-500">Tiến triển 2 chiều theo hành động</span>
            </div>

            <div className="space-y-2.5">
              {character?.customMilestones && character.customMilestones.length > 0
                ? character.customMilestones.map((st, idx) => {
                    const isCurrent =
                      affectionScore >= st.minScore && affectionScore <= st.maxScore;
                    const isUnlocked = affectionScore >= st.minScore;

                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl border p-3.5 transition-all ${
                          isCurrent
                            ? `border ${themeConfig.thoughtBorder} bg-[#23242e] shadow-md ring-1 ${themeConfig.thoughtBorder}`
                            : isUnlocked
                            ? "border-[#2f313d] bg-[#1c1d25]"
                            : "border-[#252630] bg-[#16171d]/60 opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Heart
                              className={`h-4 w-4 ${
                                isCurrent
                                  ? `fill-current ${themeConfig.badgeIcon} animate-pulse`
                                  : isUnlocked
                                  ? "fill-zinc-500/30 text-zinc-400"
                                  : "text-zinc-600"
                              }`}
                            />
                            <span
                              className={`text-xs font-bold ${
                                isCurrent
                                  ? `${themeConfig.badgeText} text-sm font-extrabold`
                                  : isUnlocked
                                  ? "text-zinc-200"
                                  : "text-zinc-500"
                              }`}
                            >
                              Mốc #{idx + 1}: {st.name}
                            </span>
                            <span className="text-[11px] text-zinc-500 font-mono">
                              ({st.minScore > 0 ? `+${st.minScore}` : st.minScore}% đến {st.maxScore > 0 ? `+${st.maxScore}` : st.maxScore}%)
                            </span>
                            {isCurrent && (
                              <span
                                className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold border ${themeConfig.chipBg} ${themeConfig.chipBorder} ${themeConfig.badgeText}`}
                              >
                                HIỆN TẠI
                              </span>
                            )}
                          </div>

                          {isUnlocked ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-lg border border-emerald-700/40">
                              <ShieldCheck className="h-3 w-3" />
                              <span>Đã mở khóa</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded-lg border border-zinc-800">
                              <Lock className="h-3 w-3" />
                              <span>Chưa đạt</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-zinc-300 italic leading-relaxed pt-1">
                          "{st.description}"
                        </p>
                      </div>
                    );
                  })
                : AFFECTION_STAGES.map((st) => {
                    const isCurrent = currentStage.level === st.level;
                    const isUnlocked = affectionScore >= st.minScore;

                    return (
                      <div
                        key={st.level}
                        className={`rounded-2xl border p-3.5 transition-all ${
                          isCurrent
                            ? `border ${themeConfig.thoughtBorder} bg-[#23242e] shadow-md ring-1 ${themeConfig.thoughtBorder}`
                            : isUnlocked
                            ? "border-[#2f313d] bg-[#1c1d25]"
                            : "border-[#252630] bg-[#16171d]/60 opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Heart
                              className={`h-4 w-4 ${
                                isCurrent
                                  ? `fill-current ${themeConfig.badgeIcon} animate-pulse`
                                  : isUnlocked
                                  ? "fill-zinc-500/30 text-zinc-400"
                                  : "text-zinc-600"
                              }`}
                            />
                            <span
                              className={`text-xs font-bold ${
                                isCurrent
                                  ? `${themeConfig.badgeText} text-sm font-extrabold`
                                  : isUnlocked
                                  ? "text-zinc-200"
                                  : "text-zinc-500"
                              }`}
                            >
                              Cấp {st.level}: {st.name}
                            </span>
                            <span className="text-[11px] text-zinc-500 font-mono">
                              ({st.minScore > 0 ? `+${st.minScore}` : st.minScore}% đến {st.maxScore > 0 ? `+${st.maxScore}` : st.maxScore}%)
                            </span>
                            {isCurrent && (
                              <span
                                className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold border ${themeConfig.chipBg} ${themeConfig.chipBorder} ${themeConfig.badgeText}`}
                              >
                                HIỆN TẠI
                              </span>
                            )}
                          </div>

                          {isUnlocked ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-lg border border-emerald-700/40">
                              <ShieldCheck className="h-3 w-3" />
                              <span>Đã mở khóa</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded-lg border border-zinc-800">
                              <Lock className="h-3 w-3" />
                              <span>Chưa đạt</span>
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {st.perks.map((perk, pIdx) => (
                            <span
                              key={pIdx}
                              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                                isCurrent
                                  ? `${themeConfig.chipBg} ${themeConfig.chipBorder} ${themeConfig.chipText}`
                                  : isUnlocked
                                  ? "bg-[#252733] text-zinc-300 border-[#363847]"
                                  : "bg-black/20 text-zinc-600 border-zinc-800/80"
                              }`}
                            >
                              <Sparkles
                                className={`h-3 w-3 ${isCurrent ? themeConfig.badgeIcon : "text-zinc-500"}`}
                              />
                              <span>{perk}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>

        {/* Fixed Modal Footer */}
        <div className="flex h-16 shrink-0 items-center justify-between border-t border-[#2a2c36] px-6 bg-[#16171d]">
          <span className="text-xs text-zinc-500">
            Tương tác thường xuyên để thăng cấp tình cảm
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-zinc-100 px-5 py-2 text-xs font-bold text-zinc-950 hover:bg-white transition-all active:scale-95 cursor-pointer shadow-md"
          >
            Tiếp tục trò chuyện
          </button>
        </div>
      </div>
    </div>
  );
};
