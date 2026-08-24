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
  ShieldAlert,
  Clock,
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
  isImagining?: boolean;
  sceneImageUrl?: string;
  sceneImageStatus?: "idle" | "queued" | "pending" | "processing" | "completed" | "failed" | "timeout";
  sceneImageFailureReason?: string;
  onCopy: (id: string, text: string) => void;
  onRollback: (id: string, index: number) => void;
  onFetchSuggestions: () => void;
  onContinueStory: () => void;
  onRegenerate: () => void;
  onImagineScene?: (turnId: string) => void;
  onRegenerateScene?: (turnId: string) => void;
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
  isImagining = false,
  sceneImageUrl,
  sceneImageStatus = "idle",
  sceneImageFailureReason,
  onCopy,
  onRollback,
  onFetchSuggestions,
  onContinueStory,
  onRegenerate,
  onImagineScene,
  onRegenerateScene,
}) => {
  const effectiveTurnId = msg.turnId || msg.id;
  const isGeneratingThisTurn =
    isImagining ||
    sceneImageStatus === "queued" ||
    sceneImageStatus === "pending" ||
    sceneImageStatus === "processing";

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
            size="md"
            type="character"
            className="!rounded-2xl border border-[#3b3d46] shrink-0 mt-0.5 shadow-md"
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
          className={`relative rounded-3xl p-4 sm:p-5 text-sm shadow-md leading-relaxed transition-all ${
            isUser
              ? "bg-[#2b2d35] text-white rounded-tr-xs border border-[#3b3d46]"
              : "bg-[#212227] text-zinc-200 rounded-tl-xs border border-[#31333a]"
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

          {/* 1. In-Flight Image Generation (Queued / Pending / Processing) */}
          {isGeneratingThisTurn && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-purple-500/30 bg-[#16141f]/90 p-4 shadow-xl relative animate-pulse">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-purple-400 shrink-0" />
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-semibold text-purple-200">
                    {sceneImageStatus === "queued" ? "Đang xếp hàng tạo ảnh..." : "Đang phác họa khoảnh khắc..."}
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate">
                    ComfyUI đang tái hiện bối cảnh nhân vật...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Completed Scene Illustration Image */}
          {!isGeneratingThisTurn && sceneImageUrl && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-[#3b3d46] bg-[#121316] shadow-xl group relative">
              <img
                src={sceneImageUrl}
                alt="Minh họa khoảnh khắc"
                className="w-full h-auto max-h-[420px] object-cover transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {onRegenerateScene && effectiveTurnId && (
                  <button
                    type="button"
                    onClick={() => onRegenerateScene(effectiveTurnId)}
                    disabled={isSending || isGeneratingThisTurn}
                    className="rounded-lg bg-black/75 hover:bg-black/90 backdrop-blur-xs px-2.5 py-1 text-[11px] text-zinc-200 font-semibold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                    title="Vẽ lại khoảnh khắc này với snapshot cố định"
                  >
                    <RotateCcw className="h-3 w-3 text-amber-400" />
                    <span>Vẽ lại</span>
                  </button>
                )}
              </div>
              <div className="absolute bottom-2 right-2 rounded-lg bg-black/70 backdrop-blur-xs px-2.5 py-1 text-[10px] text-zinc-200 font-semibold flex items-center gap-1.5 shadow-md">
                <Sparkles className="h-3 w-3 text-purple-400" />
                <span>Khoảnh khắc AI</span>
              </div>
            </div>
          )}

          {/* 3. Failed Scene Generation */}
          {!isGeneratingThisTurn && !sceneImageUrl && sceneImageStatus === "failed" && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-red-500/30 bg-red-950/20 p-3 shadow-md">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
                  <span className="text-xs text-red-300 font-medium truncate">
                    {sceneImageFailureReason || "Không thể tạo ảnh cho khoảnh khắc này."}
                  </span>
                </div>
                {onImagineScene && effectiveTurnId && (
                  <button
                    type="button"
                    onClick={() => onImagineScene(effectiveTurnId)}
                    disabled={isSending || isGeneratingThisTurn}
                    className="shrink-0 rounded-lg bg-red-900/40 hover:bg-red-900/60 border border-red-500/40 px-2.5 py-1 text-[11px] font-semibold text-red-200 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    Thử lại
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 4. Polling Timeout / Latency Warning */}
          {!isGeneratingThisTurn && !sceneImageUrl && sceneImageStatus === "timeout" && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-amber-500/30 bg-amber-950/20 p-3 shadow-md">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="text-xs text-amber-300 font-medium truncate">
                    {sceneImageFailureReason || "Hết thời gian chờ phản hồi từ máy chủ."}
                  </span>
                </div>
                {onImagineScene && effectiveTurnId && (
                  <button
                    type="button"
                    onClick={() => onImagineScene(effectiveTurnId)}
                    disabled={isSending || isGeneratingThisTurn}
                    className="shrink-0 rounded-lg bg-amber-900/40 hover:bg-amber-900/60 border border-amber-500/40 px-2.5 py-1 text-[11px] font-semibold text-amber-200 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    Thử lại
                  </button>
                )}
              </div>
            </div>
          )}

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

              {!isUser && !isOpeningMessage && onImagineScene && effectiveTurnId && !sceneImageUrl && !isGeneratingThisTurn && (
                <button
                  type="button"
                  onClick={() => onImagineScene(effectiveTurnId)}
                  disabled={isSending || isGeneratingThisTurn}
                  className="flex items-center gap-1.5 rounded-lg bg-[#272832] px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:bg-[#323440] hover:text-purple-300 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                  title="AI vẽ lại khoảnh khắc nhân vật trong câu thoại này"
                >
                  <Sparkles className="h-3 w-3 text-purple-400" />
                  <span>Vẽ cảnh</span>
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
