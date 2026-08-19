"use client";

import React from "react";
import {
  Sparkles,
  Undo2,
  Lightbulb,
  FastForward,
  RotateCcw,
  Check,
  Copy,
  Loader2,
  Eye,
  Hand,
  HeartPulse,
  Footprints,
  Moon,
  Package,
  Wand2,
  Swords,
  Volume2,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ChatMessage, ChatSession } from "@/types";
import { ThemeConfig } from "./chat.constants";

interface ChatMessageItemProps {
  msg: ChatMessage;
  index: number;
  isUser: boolean;
  isOpeningMessage: boolean;
  isLatestAI: boolean;
  canRollback: boolean;
  theme: ThemeConfig;
  session: ChatSession | null;
  userAvatarUrl?: string;
  userName?: string;
  copiedId: string | null;
  isSending: boolean;
  isRollingBack: boolean;
  isLoadingSuggestions: boolean;
  onCopy: (id: string, text: string) => void;
  onRollback: (id: string, index: number) => void;
  onFetchSuggestions: () => void;
  onContinueStory: () => void;
  onRegenerate: () => void;
}

export const getActionMeta = (actionText: string, colorClass: string) => {
  const tagMatch = actionText.match(/^\[([a-zA-Z0-9_-]+)\]/);
  const tag = tagMatch ? tagMatch[1].toLowerCase() : null;

  if (tag === "gaze") {
    return { icon: <Eye className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Ánh mắt" };
  }
  if (tag === "touch") {
    return { icon: <Hand className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Cử chỉ" };
  }
  if (tag === "emotion") {
    return { icon: <HeartPulse className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Cảm xúc" };
  }
  if (tag === "move") {
    return { icon: <Footprints className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Di chuyển" };
  }
  if (tag === "scene") {
    return { icon: <Moon className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Bối cảnh" };
  }
  if (tag === "item") {
    return { icon: <Package className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Vật phẩm" };
  }
  if (tag === "magic") {
    return { icon: <Wand2 className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Ma thuật" };
  }
  if (tag === "combat") {
    return { icon: <Swords className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Chiến đấu" };
  }
  if (tag === "whisper") {
    return { icon: <Volume2 className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Thì thầm" };
  }
  if (tag === "action") {
    return { icon: <Sparkles className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Hành động" };
  }

  const lower = actionText.toLowerCase();
  if (/nhìn|ngắm|mắt|ánh mắt|chớp mắt|cau mày|nhướng mày|liếc|mỉm cười|cười|nhếch mép|khuôn mặt|gương mặt|quan sát|dõi theo|hướng mắt|ngước nhìn|chăm chú/.test(lower)) {
    return { icon: <Eye className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Ánh mắt" };
  }
  if (/tay|bàn tay|ngón tay|chạm|nắm|vuốt|xoa|kéo|ôm|siết|đan|áp|buông|vỗ|choàng|khoác|đỡ|với lấy/.test(lower)) {
    return { icon: <Hand className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Cử chỉ" };
  }
  if (/tim|nhịp tim|lồng ngực|thở|hơi thở|thở dài|đỏ mặt|run rẩy|ngại ngùng|ấm áp|lạnh lẽo|ngập ngừng|xao xuyến/.test(lower)) {
    return { icon: <HeartPulse className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Cảm xúc" };
  }
  if (/bước|đi|tiến|lùi|chạy|quay người|đứng dậy|ngồi xuống|dời|tiếp cận|lướt|rời đi|tiến lại/.test(lower)) {
    return { icon: <Footprints className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Di chuyển" };
  }
  if (/gió|mưa|ánh trăng|trăng|bóng tối|không gian|khung cảnh|bầu trời|sương mù|bóng đêm|căn phòng|yên ắng|tĩnh mịch|thời tiết/.test(lower)) {
    return { icon: <Moon className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Bối cảnh" };
  }
  if (/trà|rượu|quà|bức thư|chìa khóa|vật phẩm|cuốn sách|cốc|ly|chén|áo khoác|khăn|giao cho|đưa cho|mở hộp/.test(lower)) {
    return { icon: <Package className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Vật phẩm" };
  }
  if (/phép|ma pháp|ma thuật|trượng|linh lực|tỏa sáng|bùng cháy|phát sáng|hào quang|kết giới/.test(lower)) {
    return { icon: <Wand2 className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Ma thuật" };
  }
  if (/kiếm|dao|vũ khí|tấn công|đỡ|vung|chém|bắn|phòng thủ|rút kiếm/.test(lower)) {
    return { icon: <Swords className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Chiến đấu" };
  }
  if (/thì thầm|khẽ nói|nói nhỏ|thốt lên|khúc khích|tiếng cười|thì thào/.test(lower)) {
    return { icon: <Volume2 className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Thì thầm" };
  }
  return { icon: <Sparkles className={`h-3.5 w-3.5 ${colorClass} shrink-0`} />, label: "Hành động" };
};

export const formatMessageContent = (content: string, theme: ThemeConfig) => {
  const parts = content.split(/(💭\s*\*?[^*]+\*?|\*[^*]+\*)/g).filter(Boolean);

  return (
    <div className="space-y-2.5">
      {parts.map((part, pIdx) => {
        const trimmed = part.trim();
        if (!trimmed) return null;

        const isThought = trimmed.startsWith("💭");
        const isAction = !isThought && trimmed.startsWith("*") && trimmed.endsWith("*");

        if (isThought) {
          const thoughtText = trimmed.replace(/^💭\s*\*?/, "").replace(/\*?$/, "").trim();
          if (!thoughtText) return null;

          return (
            <div
              key={pIdx}
              className={`my-2 rounded-2xl border ${theme.thoughtBorder} bg-gradient-to-br ${theme.thoughtGradient} p-3 shadow-inner backdrop-blur-sm`}
            >
              <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${theme.thoughtHeader} mb-1`}>
                <span className="text-sm">💭</span>
                <span className="tracking-wide">Tâm tư thầm kín</span>
              </div>
              <p className={`italic ${theme.thoughtText} text-[13px] leading-relaxed font-normal pl-1`}>
                "{thoughtText}"
              </p>
            </div>
          );
        }

        if (isAction) {
          const rawActionText = trimmed.slice(1, -1).trim();
          if (!rawActionText) return null;

          const actionMeta = getActionMeta(rawActionText, theme.actionStar);
          const displayText = rawActionText.replace(/^\[[a-zA-Z0-9_-]+\]\s*/, "").trim();

          return (
            <div
              key={pIdx}
              className={`my-2 rounded-2xl border-l-2 ${theme.actionBorder} bg-[#15191e]/90 p-3 shadow-inner backdrop-blur-sm`}
            >
              <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${theme.thoughtHeader} mb-1`}>
                {actionMeta.icon}
                <span className="tracking-wide">{actionMeta.label}</span>
              </div>
              <p className="italic text-zinc-300 font-normal leading-relaxed text-[13px] pl-0.5">
                "{displayText}"
              </p>
            </div>
          );
        }

        return (
          <div
            key={pIdx}
            className="text-zinc-100 font-medium text-[14.5px] px-1 py-0.5 leading-relaxed"
          >
            {trimmed}
          </div>
        );
      })}
    </div>
  );
};

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  msg,
  index,
  isUser,
  isOpeningMessage,
  isLatestAI,
  canRollback,
  theme,
  session,
  userAvatarUrl,
  userName,
  copiedId,
  isSending,
  isRollingBack,
  isLoadingSuggestions,
  onCopy,
  onRollback,
  onFetchSuggestions,
  onContinueStory,
  onRegenerate,
}) => {
  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      } animate-in fade-in slide-in-from-bottom-1 duration-200`}
    >
      <div
        className={`flex max-w-[88%] sm:max-w-[80%] items-start gap-3 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {!isUser && (
          <Avatar
            src={session?.characterAvatar}
            alt={session?.characterName || "AI"}
            size="sm"
            type="character"
            className="!rounded-2xl border border-[#3b3d46] shrink-0"
          />
        )}
        {isUser && (
          <Avatar
            src={userAvatarUrl}
            alt={userName || "Bạn"}
            size="sm"
            type="user"
            className="!rounded-full border border-[#3b3d46] shrink-0"
          />
        )}

        <div
          className={`min-w-[200px] sm:min-w-[240px] rounded-2xl px-4 py-3.5 shadow-lg transition-all border border-[#31333a] bg-[#212227] text-zinc-100 backdrop-blur-md ${
            isUser ? "rounded-tr-none" : "rounded-tl-none"
          }`}
        >
          {isOpeningMessage && (
            <div
              className={`flex items-center gap-1.5 mb-2.5 pb-2 border-b border-[#2c2e35] text-[11px] font-bold ${theme.badgeText}`}
            >
              <Sparkles className={`h-3.5 w-3.5 ${theme.badgeIcon}`} />
              <span className="uppercase tracking-wider">Cốt Truyện Mở Đầu</span>
            </div>
          )}

          <div>{formatMessageContent(msg.content, theme)}</div>

          <div className="mt-3 flex items-center justify-between gap-4 pt-2 border-t border-[#2c2e35]/60 text-[10px] text-zinc-500">
            <span className="shrink-0 font-mono tracking-tight text-zinc-400">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            <div className="flex items-center gap-2 shrink-0">
              {canRollback && (
                <button
                  type="button"
                  onClick={() => onRollback(msg.id, index)}
                  disabled={isSending || isRollingBack}
                  className="flex items-center gap-1.5 rounded-lg bg-[#272832] px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:bg-[#323440] hover:text-amber-300 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                  title="Quay về mốc hội thoại này (Xóa tin nhắn phía sau để rẽ nhánh mới)"
                >
                  <Undo2 className="h-3 w-3 text-amber-400" />
                  <span>Quay về đây</span>
                </button>
              )}

              {isLatestAI && (
                <>
                  <button
                    type="button"
                    onClick={onFetchSuggestions}
                    disabled={isSending || isLoadingSuggestions}
                    className="flex items-center gap-1.5 rounded-lg bg-[#272832] px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:bg-[#323440] hover:text-amber-300 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                    title="AI gợi ý 3 hướng phản hồi tiếp theo"
                  >
                    {isLoadingSuggestions ? (
                      <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
                    ) : (
                      <Lightbulb className="h-3 w-3 text-amber-400" />
                    )}
                    <span>Gợi ý</span>
                  </button>

                  <button
                    type="button"
                    onClick={onContinueStory}
                    disabled={isSending}
                    className="flex items-center gap-1.5 rounded-lg bg-[#272832] px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:bg-[#323440] hover:text-cyan-300 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                    title="Tiếp tục cốt truyện / AI tự hành động tiếp"
                  >
                    <FastForward className="h-3 w-3 text-cyan-400" />
                    <span>Tiếp tục</span>
                  </button>

                  <button
                    type="button"
                    onClick={onRegenerate}
                    disabled={isSending}
                    className="flex items-center gap-1.5 rounded-lg bg-[#272832] px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:bg-[#323440] hover:text-amber-300 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                    title="Tạo lại phản hồi khác cho lượt này"
                  >
                    <RotateCcw className="h-3 w-3 text-amber-400" />
                    <span>Tạo mới</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => onCopy(msg.id, msg.content)}
                className="flex items-center gap-1 rounded-lg p-1.5 text-zinc-400 hover:bg-[#272832] hover:text-zinc-200 transition-colors cursor-pointer"
                title="Sao chép văn bản"
              >
                {copiedId === msg.id ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
