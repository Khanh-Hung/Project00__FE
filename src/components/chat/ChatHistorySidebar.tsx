"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Loader2,
  Compass,
  ChevronDown,
  ChevronRight,
  GitBranch,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ChatSessionListItem } from "@/types";
import { ThemeConfig } from "./chat.constants";

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  currentSessionId: string;
  recentSessions: ChatSessionListItem[];
  isLoading: boolean;
  isCreatingNew?: boolean;
  onCreateNewSession?: () => void;
  onSelectSession: (id: string) => void;
  theme: ThemeConfig;
}

interface CharacterGroup {
  characterId: string;
  characterName: string;
  characterAvatar: string;
  sessions: ChatSessionListItem[];
  hasActiveSession: boolean;
}

const formatRelativeTime = (isoString?: string | null) => {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSec < 60) return "vừa xong";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}p`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h`;
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  } catch {
    return "";
  }
};

const getSnippet = (item: ChatSessionListItem) => {
  if (item.lastMessageContent) {
    const cleaned = item.lastMessageContent.replace(/\*+/g, "").trim();
    if (cleaned) return cleaned;
  }
  return "Bắt đầu cuộc trò chuyện...";
};

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  isOpen,
  currentSessionId,
  recentSessions,
  isLoading,
  onSelectSession,
  theme,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCharacters, setExpandedCharacters] = useState<Record<string, boolean>>({});

  // Auto-expand group containing current session
  useEffect(() => {
    if (!currentSessionId || !recentSessions || recentSessions.length === 0) return;
    const activeSession = recentSessions.find((s) => s.id === currentSessionId);
    if (activeSession) {
      const key = activeSession.characterId || activeSession.characterName || activeSession.id;
      setExpandedCharacters((prev) => ({ ...prev, [key]: true }));
    }
  }, [currentSessionId, recentSessions]);

  const toggleGroup = (characterKey: string) => {
    setExpandedCharacters((prev) => ({
      ...prev,
      [characterKey]: !prev[characterKey],
    }));
  };

  // Filter & Group sessions by character
  const characterGroups = useMemo(() => {
    const filtered = recentSessions.filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (s.characterName || "").toLowerCase().includes(q) ||
        (s.title || "").toLowerCase().includes(q) ||
        (s.lastMessageContent || "").toLowerCase().includes(q)
      );
    });

    const groupMap = new Map<string, CharacterGroup>();

    for (const s of filtered) {
      const key = s.characterId || s.characterName || s.id;
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          characterId: key,
          characterName: s.characterName,
          characterAvatar: s.characterAvatar,
          sessions: [],
          hasActiveSession: false,
        });
      }
      const grp = groupMap.get(key)!;
      grp.sessions.push(s);
      if (s.id === currentSessionId) {
        grp.hasActiveSession = true;
      }
    }

    return Array.from(groupMap.values());
  }, [recentSessions, searchQuery, currentSessionId]);

  return (
    <aside
      className={`flex flex-col border-r border-[#26272e] bg-[#18191e] transition-all duration-300 ease-in-out shrink-0 z-20 overflow-hidden ${
        isOpen ? "w-72 sm:w-80" : "w-0 border-r-0"
      }`}
    >
      <div className="w-72 sm:w-80 flex flex-col h-full">
        {/* Left Sub-Header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#26272e] px-3.5 bg-[#1a1b20]">
          <div className="flex items-center gap-2">
            <MessageSquare className={`h-3.5 w-3.5 ${theme.badgeIcon}`} />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Hội Thoại</h3>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-xl border border-[#373944] bg-[#262832] px-2.5 py-1 text-xs font-semibold text-zinc-300 hover:bg-[#323440] hover:text-white transition-all shadow-xs"
            title="Khám phá thêm nhân vật mới"
          >
            <Compass className={`h-3.5 w-3.5 ${theme.badgeIcon}`} />
            <span>Khám phá</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-[#26272e]/60 bg-[#16171b]">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm nhân vật / tin nhắn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#2e3038] bg-[#1a1b20] py-2 pl-9 pr-3 text-xs text-zinc-200 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Character Groups List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1.5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-zinc-500 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
              <span className="text-xs">Đang tải danh sách...</span>
            </div>
          ) : characterGroups.length === 0 ? (
            <div className="py-10 text-center text-xs text-zinc-500 px-4">
              Chưa có hội thoại nào khác.
            </div>
          ) : (
            characterGroups.map((group) => {
              const isMulti = group.sessions.length > 1;
              const isExpanded = !!expandedCharacters[group.characterId];

              // Case A: Character with only 1 session (Single item card)
              if (!isMulti) {
                const s = group.sessions[0];
                const isActive = s.id === currentSessionId;
                const timeStr = formatRelativeTime(s.lastMessageTime || s.createdAt);
                const snippet = getSnippet(s);

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSelectSession(s.id)}
                    className={`w-full flex items-center gap-3 rounded-2xl p-2.5 text-left transition-all cursor-pointer ${
                      isActive
                        ? `bg-[#282933] ${theme.thoughtBorder} text-white shadow-xs`
                        : "hover:bg-[#202127] text-zinc-400 hover:text-zinc-200 border border-transparent"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar
                        src={s.characterAvatar}
                        alt={s.characterName}
                        size="sm"
                        type="character"
                        className={`!rounded-xl border shrink-0 transition-all ${
                          isActive ? "border-[#4b4e5c]" : "border-[#3b3d46]"
                        }`}
                      />
                      {isActive && (
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ${theme.onlineDot} ring-2 ring-[#18191e]`}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className={`text-xs truncate ${
                            isActive
                              ? "text-zinc-100 font-bold"
                              : "text-zinc-300 font-semibold"
                          }`}
                        >
                          {s.characterName}
                        </span>
                        {timeStr && (
                          <span
                            className={`text-[10px] shrink-0 font-normal ${
                              isActive ? theme.badgeText : "text-zinc-500"
                            }`}
                          >
                            {timeStr}
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-[11px] truncate font-normal leading-tight ${
                          isActive ? "text-zinc-300" : "text-zinc-500"
                        }`}
                      >
                        {snippet}
                      </p>
                    </div>
                  </button>
                );
              }

              // Case B: Character with MULTIPLE sessions (Sleek Compact Accordion Header)
              return (
                <div key={group.characterId} className="space-y-1">
                  {/* Parent Compact Header (1 Dòng Gọn Gàng) */}
                  <div
                    onClick={() => toggleGroup(group.characterId)}
                    className={`w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-left transition-all cursor-pointer select-none ${
                      group.hasActiveSession
                        ? "bg-[#23242d] border border-[#383a48] text-white"
                        : "hover:bg-[#202127] text-zinc-400 hover:text-zinc-200 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar
                        src={group.characterAvatar}
                        alt={group.characterName}
                        size="sm"
                        type="character"
                        className="!rounded-lg border border-[#3b3d46] h-7 w-7 shrink-0"
                      />
                      <span className="text-xs font-bold text-zinc-200 truncate">
                        {group.characterName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="rounded-md bg-[#2b2c36] px-1.5 py-0.5 text-[10px] font-bold text-zinc-400 border border-[#3b3d48]">
                        {group.sessions.length} nhánh
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
                      )}
                    </div>
                  </div>

                  {/* Child Branches (Sub-tree) */}
                  {isExpanded && (
                    <div className="ml-5 pl-3 border-l-2 border-[#2c2e3a] space-y-1 pt-0.5 pb-1 animate-in fade-in-50 duration-200">
                      {group.sessions.map((s, idx) => {
                        const isActive = s.id === currentSessionId;
                        const timeStr = formatRelativeTime(s.lastMessageTime || s.createdAt);
                        const snippet = getSnippet(s);

                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => onSelectSession(s.id)}
                            className={`group w-full flex items-start gap-2.5 rounded-xl p-2 text-left transition-all cursor-pointer ${
                              isActive
                                ? `bg-[#282933] ${theme.thoughtBorder} text-white shadow-xs`
                                : "hover:bg-[#202127] text-zinc-400 hover:text-zinc-200 border border-transparent"
                            }`}
                          >
                            <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                              <GitBranch
                                className={`h-3.5 w-3.5 transition-colors ${
                                  isActive ? theme.badgeIcon : "text-zinc-500 group-hover:text-zinc-400"
                                }`}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span
                                  className={`text-[11px] font-bold truncate ${
                                    isActive
                                      ? "text-zinc-100"
                                      : "text-zinc-300 group-hover:text-white"
                                  }`}
                                >
                                  Nhánh #{group.sessions.length - idx}
                                </span>
                                {timeStr && (
                                  <span
                                    className={`text-[10px] shrink-0 font-normal ${
                                      isActive ? theme.badgeText : "text-zinc-500"
                                    }`}
                                  >
                                    {timeStr}
                                  </span>
                                )}
                              </div>

                              <p
                                className={`text-[10.5px] truncate font-normal leading-tight ${
                                  isActive ? "text-zinc-300 font-medium" : "text-zinc-500"
                                }`}
                              >
                                {snippet}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
};
