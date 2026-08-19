"use client";

import React from "react";
import { User as UserIcon, Heart } from "lucide-react";
import { ChatSession, Character } from "@/types";
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
  const matchedCustom = character?.customMilestones?.find(
    (m) => affectionScore >= m.minScore && affectionScore <= m.maxScore
  );
  const milestoneDisplayName = matchedCustom ? matchedCustom.name : currentStage.name;

  return (
    <aside
      className={`flex flex-col h-full min-h-0 border-l border-[#26272e] bg-[#18191e] transition-all duration-300 ease-in-out shrink-0 z-20 overflow-hidden ${
        isOpen ? "w-80 sm:w-96" : "w-0 border-l-0"
      }`}
    >
      <div className="w-80 sm:w-96 flex flex-col h-full min-h-0">
        {/* Fixed Right Sub-Header */}
        <div className="flex h-12 shrink-0 items-center justify-between px-4 border-b border-[#26272e] bg-[#1a1b20]">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-pink-400" />
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Hồ Sơ Nhân Vật</h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-medium">Chi tiết</span>
        </div>

        {/* Smooth Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-4">
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

            {/* Mood status */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 pt-1 border-t border-[#2c2e35]/60">
              <span className="text-zinc-500 text-[11px]">Tâm trạng:</span>
              <span className="font-semibold text-pink-300 bg-pink-950/40 px-2 py-0.5 rounded-lg border border-pink-800/30 text-[11px]">
                {session?.currentMood || currentStage.currentMood}
              </span>
            </div>

            <button
              type="button"
              onClick={onOpenAffectionModal}
              className="w-full rounded-xl bg-[#2b2c36] hover:bg-[#343642] py-2 text-center text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer border border-[#3b3d4a]"
            >
              Xem chi tiết cột mốc & đặc quyền →
            </button>
          </div>

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
        </div>
      </div>
    </aside>
  );
};
