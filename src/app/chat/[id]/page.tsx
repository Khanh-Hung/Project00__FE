"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatMessage, ChatSession, MessageRole } from "@/types";
import { fetchChatSession, sendChatMessage, createChatSession, rollbackChatMessage } from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/core/providers/AuthProvider";
import {
  ArrowLeft,
  Send,
  User as UserIcon,
  Loader2,
  Info,
  X,
  Plus,
  Sparkles,
  Palette,
  Check,
  RotateCcw,
  Copy,
  Play,
  FastForward,
  Undo2,
  Lock,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

const CATEGORY_MAP: Record<string, string> = {
  Companion: "Bạn đồng hành",
  Anime: "Anime",
  Fantasy: "Kỳ ảo",
  RPG: "Nhập vai",
  Assistant: "Trợ lý",
  Mentor: "Cố vấn",
  Yandere: "Yandere",
  Tsundere: "Tsundere",
  Romance: "Tình cảm",
  SciFi: "Khoa học viễn tưởng",
  Game: "Game",
};

function formatPersonalityForUser(prompt?: string, characterName?: string): string {
  if (!prompt) return "";
  const name = characterName || "Nhân vật";
  let text = prompt.trim();

  // Xóa tiền tố chỉ thị kỹ thuật nếu có: "Bạn là [Tên], " -> "[Tên] là "
  const prefixRegex = new RegExp(`^Bạn là\\s+(${name}|[\\p{L}\\s]+)[,.:;\\s]*`, "u");
  if (prefixRegex.test(text)) {
    text = text.replace(prefixRegex, `${name} là `);
  } else if (/^Bạn là\s+/i.test(text)) {
    text = text.replace(/^Bạn là\s+/i, `${name} là `);
  }

  // Tinh chỉnh các từ ngữ kỹ thuật prompt sang câu văn tự nhiên cho người đọc
  text = text
    .replace(/Quy tắc ứng xử\s*:\s*/gi, "")
    .replace(/Cách xưng hô\s*:\s*/gi, "Xưng hô: ")
    .replace(/người dùng/gi, "bạn")
    .replace(/\bban đầu bạn\b/gi, `Ban đầu ${name}`)
    .replace(/\bbạn sẽ\b/gi, `${name} sẽ`);

  return text.trim();
}

type ChatTheme =
  | "cyan"
  | "sky"
  | "indigo"
  | "purple"
  | "fuchsia"
  | "rose"
  | "ruby"
  | "orange"
  | "amber"
  | "emerald"
  | "teal"
  | "zinc";

interface ThemeConfig {
  id: ChatTheme;
  name: string;
  dotColor: string;
  badgeText: string;
  badgeIcon: string;
  actionBorder: string;
  actionStar: string;
  thoughtBorder: string;
  thoughtGradient: string;
  thoughtHeader: string;
  thoughtText: string;
  chipBorder: string;
  chipBg: string;
  chipText: string;
  chipHoverBorder: string;
  chipHoverBg: string;
  chipHoverText: string;
  onlinePing: string;
  onlineDot: string;
}

const THEMES: Record<ChatTheme, ThemeConfig> = {
  cyan: {
    id: "cyan",
    name: "Băng Lam",
    dotColor: "bg-cyan-400",
    badgeText: "text-cyan-300",
    badgeIcon: "text-cyan-400",
    actionBorder: "border-cyan-400/70",
    actionStar: "text-cyan-400",
    thoughtBorder: "border-cyan-500/30",
    thoughtGradient: "from-cyan-950/40 via-blue-950/20 to-black/30",
    thoughtHeader: "text-cyan-300",
    thoughtText: "text-cyan-100/90",
    chipBorder: "border-[#2f3844]",
    chipBg: "bg-[#1a2028]",
    chipText: "text-cyan-100/90",
    chipHoverBorder: "hover:border-cyan-400/60",
    chipHoverBg: "hover:bg-cyan-950/30",
    chipHoverText: "hover:text-cyan-200",
    onlinePing: "bg-cyan-400",
    onlineDot: "bg-cyan-500",
  },
  sky: {
    id: "sky",
    name: "Hải Dương",
    dotColor: "bg-sky-400",
    badgeText: "text-sky-300",
    badgeIcon: "text-sky-400",
    actionBorder: "border-sky-400/70",
    actionStar: "text-sky-400",
    thoughtBorder: "border-sky-500/30",
    thoughtGradient: "from-sky-950/40 via-blue-950/20 to-black/30",
    thoughtHeader: "text-sky-300",
    thoughtText: "text-sky-100/90",
    chipBorder: "border-[#2b3945]",
    chipBg: "bg-[#17222c]",
    chipText: "text-sky-100/90",
    chipHoverBorder: "hover:border-sky-400/60",
    chipHoverBg: "hover:bg-sky-950/30",
    chipHoverText: "hover:text-sky-200",
    onlinePing: "bg-sky-400",
    onlineDot: "bg-sky-500",
  },
  indigo: {
    id: "indigo",
    name: "Dạ Ngân",
    dotColor: "bg-indigo-400",
    badgeText: "text-indigo-300",
    badgeIcon: "text-indigo-400",
    actionBorder: "border-indigo-400/70",
    actionStar: "text-indigo-400",
    thoughtBorder: "border-indigo-500/30",
    thoughtGradient: "from-indigo-950/40 via-purple-950/20 to-black/30",
    thoughtHeader: "text-indigo-300",
    thoughtText: "text-indigo-100/90",
    chipBorder: "border-[#34354a]",
    chipBg: "bg-[#1c1d2c]",
    chipText: "text-indigo-100/90",
    chipHoverBorder: "hover:border-indigo-400/60",
    chipHoverBg: "hover:bg-indigo-950/30",
    chipHoverText: "hover:text-indigo-200",
    onlinePing: "bg-indigo-400",
    onlineDot: "bg-indigo-500",
  },
  purple: {
    id: "purple",
    name: "Tử Đằng",
    dotColor: "bg-purple-400",
    badgeText: "text-purple-300",
    badgeIcon: "text-purple-400",
    actionBorder: "border-purple-400/70",
    actionStar: "text-purple-400",
    thoughtBorder: "border-purple-500/30",
    thoughtGradient: "from-purple-950/40 via-indigo-950/20 to-black/30",
    thoughtHeader: "text-purple-300",
    thoughtText: "text-purple-100/90",
    chipBorder: "border-[#382d44]",
    chipBg: "bg-[#201828]",
    chipText: "text-purple-100/90",
    chipHoverBorder: "hover:border-purple-400/60",
    chipHoverBg: "hover:bg-purple-950/30",
    chipHoverText: "hover:text-purple-200",
    onlinePing: "bg-purple-400",
    onlineDot: "bg-purple-500",
  },
  fuchsia: {
    id: "fuchsia",
    name: "Anh Đào",
    dotColor: "bg-fuchsia-400",
    badgeText: "text-fuchsia-300",
    badgeIcon: "text-fuchsia-400",
    actionBorder: "border-fuchsia-400/70",
    actionStar: "text-fuchsia-400",
    thoughtBorder: "border-fuchsia-500/30",
    thoughtGradient: "from-fuchsia-950/40 via-pink-950/20 to-black/30",
    thoughtHeader: "text-fuchsia-300",
    thoughtText: "text-fuchsia-100/90",
    chipBorder: "border-[#3d2a3f]",
    chipBg: "bg-[#251527]",
    chipText: "text-fuchsia-100/90",
    chipHoverBorder: "hover:border-fuchsia-400/60",
    chipHoverBg: "hover:bg-fuchsia-950/30",
    chipHoverText: "hover:text-fuchsia-200",
    onlinePing: "bg-fuchsia-400",
    onlineDot: "bg-fuchsia-500",
  },
  rose: {
    id: "rose",
    name: "Hoa Hồng",
    dotColor: "bg-rose-400",
    badgeText: "text-rose-300",
    badgeIcon: "text-rose-400",
    actionBorder: "border-rose-400/70",
    actionStar: "text-rose-400",
    thoughtBorder: "border-rose-500/30",
    thoughtGradient: "from-rose-950/40 via-pink-950/20 to-black/30",
    thoughtHeader: "text-rose-300",
    thoughtText: "text-rose-100/90",
    chipBorder: "border-[#3e2c34]",
    chipBg: "bg-[#24171e]",
    chipText: "text-rose-100/90",
    chipHoverBorder: "hover:border-rose-400/60",
    chipHoverBg: "hover:bg-rose-950/30",
    chipHoverText: "hover:text-rose-200",
    onlinePing: "bg-rose-400",
    onlineDot: "bg-rose-500",
  },
  ruby: {
    id: "ruby",
    name: "Hồng Ngọc",
    dotColor: "bg-red-400",
    badgeText: "text-red-300",
    badgeIcon: "text-red-400",
    actionBorder: "border-red-400/70",
    actionStar: "text-red-400",
    thoughtBorder: "border-red-500/30",
    thoughtGradient: "from-red-950/40 via-rose-950/20 to-black/30",
    thoughtHeader: "text-red-300",
    thoughtText: "text-red-100/90",
    chipBorder: "border-[#402a2a]",
    chipBg: "bg-[#271616]",
    chipText: "text-red-100/90",
    chipHoverBorder: "hover:border-red-400/60",
    chipHoverBg: "hover:bg-red-950/30",
    chipHoverText: "hover:text-red-200",
    onlinePing: "bg-red-400",
    onlineDot: "bg-red-500",
  },
  orange: {
    id: "orange",
    name: "Hoàng Hôn",
    dotColor: "bg-orange-400",
    badgeText: "text-orange-300",
    badgeIcon: "text-orange-400",
    actionBorder: "border-orange-400/70",
    actionStar: "text-orange-400",
    thoughtBorder: "border-orange-500/30",
    thoughtGradient: "from-orange-950/40 via-amber-950/20 to-black/30",
    thoughtHeader: "text-orange-300",
    thoughtText: "text-orange-100/90",
    chipBorder: "border-[#3f3128]",
    chipBg: "bg-[#251a14]",
    chipText: "text-orange-100/90",
    chipHoverBorder: "hover:border-orange-400/60",
    chipHoverBg: "hover:bg-orange-950/30",
    chipHoverText: "hover:text-orange-200",
    onlinePing: "bg-orange-400",
    onlineDot: "bg-orange-500",
  },
  amber: {
    id: "amber",
    name: "Hoàng Kim",
    dotColor: "bg-amber-400",
    badgeText: "text-amber-300",
    badgeIcon: "text-amber-400",
    actionBorder: "border-amber-400/70",
    actionStar: "text-amber-400",
    thoughtBorder: "border-amber-500/30",
    thoughtGradient: "from-amber-950/40 via-yellow-950/20 to-black/30",
    thoughtHeader: "text-amber-300",
    thoughtText: "text-amber-100/90",
    chipBorder: "border-[#3e3428]",
    chipBg: "bg-[#221c17]",
    chipText: "text-amber-100/90",
    chipHoverBorder: "hover:border-amber-400/60",
    chipHoverBg: "hover:bg-amber-950/30",
    chipHoverText: "hover:text-amber-200",
    onlinePing: "bg-amber-400",
    onlineDot: "bg-amber-500",
  },
  emerald: {
    id: "emerald",
    name: "Ngọc Bích",
    dotColor: "bg-emerald-400",
    badgeText: "text-emerald-300",
    badgeIcon: "text-emerald-400",
    actionBorder: "border-emerald-400/70",
    actionStar: "text-emerald-400",
    thoughtBorder: "border-emerald-500/30",
    thoughtGradient: "from-emerald-950/40 via-teal-950/20 to-black/30",
    thoughtHeader: "text-emerald-300",
    thoughtText: "text-emerald-100/90",
    chipBorder: "border-[#2c3d35]",
    chipBg: "bg-[#18241f]",
    chipText: "text-emerald-100/90",
    chipHoverBorder: "hover:border-emerald-400/60",
    chipHoverBg: "hover:bg-emerald-950/30",
    chipHoverText: "hover:text-emerald-200",
    onlinePing: "bg-emerald-400",
    onlineDot: "bg-emerald-500",
  },
  teal: {
    id: "teal",
    name: "Lục Bảo",
    dotColor: "bg-teal-400",
    badgeText: "text-teal-300",
    badgeIcon: "text-teal-400",
    actionBorder: "border-teal-400/70",
    actionStar: "text-teal-400",
    thoughtBorder: "border-teal-500/30",
    thoughtGradient: "from-teal-950/40 via-emerald-950/20 to-black/30",
    thoughtHeader: "text-teal-300",
    thoughtText: "text-teal-100/90",
    chipBorder: "border-[#283b3a]",
    chipBg: "bg-[#142524]",
    chipText: "text-teal-100/90",
    chipHoverBorder: "hover:border-teal-400/60",
    chipHoverBg: "hover:bg-teal-950/30",
    chipHoverText: "hover:text-teal-200",
    onlinePing: "bg-teal-400",
    onlineDot: "bg-teal-500",
  },
  zinc: {
    id: "zinc",
    name: "Bạch Kim",
    dotColor: "bg-zinc-400",
    badgeText: "text-zinc-300",
    badgeIcon: "text-zinc-400",
    actionBorder: "border-zinc-500/60",
    actionStar: "text-zinc-400",
    thoughtBorder: "border-zinc-500/30",
    thoughtGradient: "from-zinc-900/50 via-zinc-950/30 to-black/30",
    thoughtHeader: "text-zinc-300",
    thoughtText: "text-zinc-200/90",
    chipBorder: "border-[#383a44]",
    chipBg: "bg-[#222329]",
    chipText: "text-zinc-300",
    chipHoverBorder: "hover:border-zinc-400",
    chipHoverBg: "hover:bg-[#2b2c34]",
    chipHoverText: "hover:text-white",
    onlinePing: "bg-zinc-400",
    onlineDot: "bg-zinc-500",
  },
};

export default function ChatPage() {
  const { user, isAuthenticated, isLoading: authLoading, openAuthModal } = useAuth();
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ChatTheme>("cyan");

  const themeRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[currentTheme] || THEMES.cyan;

  useEffect(() => {
    const savedTheme = localStorage.getItem("chat_roleplay_theme") as ChatTheme;
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const handleSelectTheme = (themeId: ChatTheme) => {
    setCurrentTheme(themeId);
    localStorage.setItem("chat_roleplay_theme", themeId);
    setShowThemePicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setShowThemePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const loadSession = async () => {
      try {
        setIsLoading(true);
        setNotFound(false);
        const data = await fetchChatSession(sessionId);
        setSession(data);
        setMessages(data.messages || []);
      } catch (err) {
        console.warn("Could not load chat session:", err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      loadSession();
    }
  }, [sessionId, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userText = inputMessage.trim();
    setInputMessage("");

    // Optimistic user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: MessageRole.User,
      content: userText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsSending(true);

    try {
      const response = await sendChatMessage(sessionId, userText);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        response.userMessage,
        response.assistantMessage,
      ]);
    } catch (err: any) {
      console.error("Error sending message", err);
      alert(err.message || "Không thể nhận phản hồi từ AI. Vui lòng thử lại!");
    } finally {
      setIsSending(false);
    }
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [rollbackTarget, setRollbackTarget] = useState<{ id: string; index: number } | null>(null);
  const [isRollingBack, setIsRollingBack] = useState(false);

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmRollback = async () => {
    if (!rollbackTarget || isRollingBack) return;
    try {
      setIsRollingBack(true);
      await rollbackChatMessage(sessionId, rollbackTarget.id);
      setMessages((prev) => prev.slice(0, rollbackTarget.index + 1));
      setRollbackTarget(null);
    } catch (err: any) {
      console.error("Error rolling back", err);
      alert(err.message || "Không thể quay về mốc này. Vui lòng thử lại!");
    } finally {
      setIsRollingBack(false);
    }
  };

  const handleContinueStory = async () => {
    if (isSending) return;
    const prompt = "*Lặng im quan sát, chờ xem phản ứng và diễn biến tiếp theo từ ngươi...*";
    setInputMessage("");

    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: MessageRole.User,
      content: prompt,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsSending(true);

    try {
      const response = await sendChatMessage(sessionId, prompt);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        response.userMessage,
        response.assistantMessage,
      ]);
    } catch (err: any) {
      console.error("Error continuing story", err);
      alert(err.message || "Không thể tiếp tục câu chuyện. Vui lòng thử lại!");
    } finally {
      setIsSending(false);
    }
  };

  const handleRegenerateLastResponse = async () => {
    if (isSending || messages.length === 0) return;

    // Find last user message
    const userMessages = messages.filter(
      (m) =>
        m.role === MessageRole.User ||
        (m.role as any) === 1 ||
        String(m.role).toLowerCase() === "user"
    );

    const lastUserText =
      userMessages.length > 0
        ? userMessages[userMessages.length - 1].content
        : `*Nhìn ${session?.characterName || "ngươi"} với ánh mắt tò mò, chờ đợi một phản ứng khác...*`;

    setIsSending(true);

    try {
      const response = await sendChatMessage(sessionId, lastUserText);
      // Replace the last assistant message with the new one
      setMessages((prev) => {
        const copy = [...prev];
        for (let i = copy.length - 1; i >= 0; i--) {
          const isAI =
            copy[i].role === MessageRole.Assistant ||
            (copy[i].role as any) === 2 ||
            String(copy[i].role).toLowerCase() === "assistant";
          if (isAI) {
            copy.splice(i, 1);
            break;
          }
        }
        return [...copy, response.assistantMessage];
      });
    } catch (err: any) {
      console.error("Error regenerating response", err);
      alert(err.message || "Không thể tạo lại phản hồi. Vui lòng thử lại!");
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateNewSession = async () => {
    if (!session?.characterId) return;
    try {
      setIsCreatingNew(true);
      const newSession = await createChatSession(
        session.characterId,
        `Trò chuyện cùng ${session.characterName}`
      );
      router.push(`/chat/${newSession.id}`);
    } catch (err) {
      console.error("Failed to start new chat session", err);
      alert("Không thể tạo cuộc trò chuyện mới. Vui lòng thử lại!");
    } finally {
      setIsCreatingNew(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setInputMessage(suggestionText);
  };

  const renderFormattedMessage = (content: string, isUser = false) => {
    // Check if the message contains thoughts or multiple paragraphs
    // Pattern matches thoughts like 💭 *(...)* or 💭 ... or standard *actions*
    const parts = content.split(/(💭\s*\*?[^*]+\*?|\*[^*]+\*)/g).filter(Boolean);

    return (
      <div className="space-y-2.5">
        {parts.map((part, index) => {
          const trimmed = part.trim();
          if (!trimmed) return null;

          const isThought = trimmed.startsWith("💭");
          const isAction = !isThought && trimmed.startsWith("*") && trimmed.endsWith("*");

          // 1. Inner Thoughts (Độc thoại nội tâm)
          if (isThought) {
            const thoughtText = trimmed.replace(/^💭\s*\*?/, "").replace(/\*?$/, "").trim();
            if (!thoughtText) return null;

            return (
              <div
                key={index}
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

          // 2. Physical Action / Micro-expression (Cử chỉ & Biểu cảm)
          if (isAction) {
            const actionText = trimmed.slice(1, -1).trim();
            if (!actionText) return null;

            return (
              <div
                key={index}
                className={`my-1.5 flex items-start gap-2.5 rounded-xl border-l-2 ${theme.actionBorder} bg-[#15191e]/90 px-3.5 py-2.5 shadow-inner`}
              >
                <span className={`${theme.actionStar} text-xs select-none mt-0.5`}>✦</span>
                <p className="italic text-zinc-300 font-normal leading-relaxed text-[13px]">
                  {actionText}
                </p>
              </div>
            );
          }

          // 3. Spoken Dialogue (Lời thoại trực tiếp)
          return (
            <div
              key={index}
              className="text-zinc-100 font-medium text-[14.5px] px-1 py-0.5 leading-relaxed"
            >
              {trimmed}
            </div>
          );
        })}
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#18191c] text-zinc-100">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />
        <p className="mt-4 text-sm text-zinc-400">Đang kiểm tra thông tin tài khoản...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#18191c] p-6 text-center text-zinc-100 selection:bg-[#353740] selection:text-white">
        <div className="mx-auto max-w-sm rounded-3xl border border-[#31333a] bg-[#212227] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#3b3d46] bg-[#292a33] text-zinc-200 shadow-inner">
            <Lock className="h-6 w-6 text-zinc-300" />
          </div>
          <h2 className="text-lg font-bold text-zinc-100">Yêu cầu đăng nhập</h2>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-normal">
            Bạn cần đăng nhập tài khoản để tham gia trò chuyện và bảo mật lịch sử nhập vai riêng tư của mình.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={openAuthModal}
              className="w-full rounded-2xl bg-zinc-100 py-3 text-xs font-bold text-zinc-950 hover:bg-white shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Đăng nhập ngay
            </button>
            <Link
              href="/"
              className="w-full rounded-2xl border border-[#31333a] bg-[#26272e] py-2.5 text-xs font-semibold text-zinc-300 hover:bg-[#2f3139] hover:text-white transition-all text-center"
            >
              Quay lại Trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#18191c] p-6 text-center text-zinc-100 selection:bg-[#353740] selection:text-white">
        <div className="mx-auto max-w-sm rounded-3xl border border-[#31333a] bg-[#212227] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#3b3d46] bg-[#292a33] text-zinc-200 shadow-inner">
            <X className="h-6 w-6 text-zinc-400" />
          </div>
          <h2 className="text-lg font-bold text-zinc-100">Cuộc trò chuyện không tồn tại</h2>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-normal">
            Phiên chat này không thuộc về tài khoản của bạn hoặc đã bị xóa.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href="/"
              className="w-full rounded-2xl bg-zinc-100 py-3 text-xs font-bold text-zinc-950 hover:bg-white shadow-md transition-all active:scale-95 text-center"
            >
              Quay lại Trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#18191c] text-zinc-100">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />
        <p className="mt-4 text-sm text-zinc-400">Đang tải phòng chat nhập vai...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#18191c] text-zinc-100 overflow-hidden selection:bg-[#353740] selection:text-white">
      {/* Chat Top Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#2c2e35] bg-[#1a1b1f]/95 px-4 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-xl p-2 text-zinc-400 hover:bg-[#282930] hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <Avatar
            src={session?.characterAvatar}
            alt={session?.characterName || "AI"}
            size="sm"
            type="character"
            className="!rounded-xl border border-[#3b3d46]"
          />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-zinc-100">{session?.characterName}</h2>
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${theme.onlinePing} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.onlineDot}`}></span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 truncate max-w-[250px] sm:max-w-md font-normal">
              {session?.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Theme Switcher */}
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-1.5 rounded-xl border border-[#3b3d46] bg-[#2b2c34] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-[#353740] hover:text-white transition-colors cursor-pointer"
              title="Đổi tông màu phòng chat"
            >
              <Palette className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Màu sắc</span>
            </button>

            {showThemePicker && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 overflow-hidden rounded-3xl border border-[#31333a] bg-[#212227]/98 p-2.5 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-[#2c2e35] mb-2">
                  <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                    Chọn Tông Màu
                  </span>
                  <span className="text-[10px] text-zinc-500">Tự lưu cấu hình</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 max-h-72 overflow-y-auto custom-scrollbar pr-0.5">
                  {Object.values(THEMES).map((t) => {
                    const active = currentTheme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleSelectTheme(t.id)}
                        className={`flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all cursor-pointer ${
                          active
                            ? "bg-[#2d303b] text-white font-semibold ring-1 ring-zinc-500/40 shadow-sm"
                            : "text-zinc-300 hover:bg-[#282930] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`h-2.5 w-2.5 rounded-full ${t.dotColor} shadow-sm shrink-0`} />
                          <span className="truncate">{t.name}</span>
                        </div>
                        {active && <Check className="h-3.5 w-3.5 text-zinc-200 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleCreateNewSession}
            disabled={isCreatingNew}
            className="flex items-center gap-1.5 rounded-xl border border-[#3b3d46] bg-[#2b2c34] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-[#353740] hover:text-white transition-colors cursor-pointer"
            title="Bắt đầu cuộc trò chuyện mới từ đầu"
          >
            {isCreatingNew ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">Hội thoại mới</span>
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1.5 rounded-xl border border-[#3b3d46] bg-[#2b2c34] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-[#353740] hover:text-white transition-colors cursor-pointer"
          >
            <Info className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Bối cảnh</span>
          </button>
        </div>
      </header>

      {/* Chat Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <div className="mx-auto max-w-3xl space-y-5">
          {/* Top Character & Scenario Context Banner (Bối cảnh phía trên đoạn chat) */}
          <div className="flex flex-col items-center justify-center text-center pt-2 pb-6 border-b border-[#2c2e35]/60 animate-in fade-in duration-300">
            <Avatar
              src={session?.characterAvatar}
              alt={session?.characterName || "AI"}
              size="lg"
              type="character"
              className="!rounded-3xl border border-[#3b3d46] shadow-xl mb-3"
            />
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-zinc-100">
                {session?.characterName}
              </h1>
                  {session?.characterCategory && (
                    <span className="rounded-lg bg-[#272832] px-2 py-0.5 text-[11px] font-semibold text-zinc-300 border border-[#373944]">
                      {CATEGORY_MAP[session.characterCategory] || session.characterCategory}
                    </span>
                  )}
            </div>
            <p className="text-xs text-zinc-400 font-medium max-w-lg mb-3">
              {session?.characterTitle || session?.title}
            </p>

            {/* Khung Bối cảnh nhập vai & Mối quan hệ */}
            {session?.characterPersonality && (
              <div className="w-full rounded-2xl border border-[#2e3038] bg-[#1d1e24]/90 p-4 text-left shadow-md backdrop-blur-sm">
                <div className="flex items-center gap-1.5 font-bold text-zinc-200 text-xs mb-1.5">
                  <Sparkles className={`h-3.5 w-3.5 ${theme.badgeIcon}`} />
                  <span className="uppercase tracking-wider">Bối Cảnh Nhập Vai & Mối Quan Hệ</span>
                </div>
                <p className="text-xs text-zinc-300/90 leading-relaxed font-normal whitespace-pre-wrap">
                  {formatPersonalityForUser(session.characterPersonality, session.characterName)}
                </p>
              </div>
            )}
          </div>

          {(() => {
            // Tìm vị trí tin nhắn AI mới nhất trong cuộc trò chuyện
            const lastAIMessageIndex = (() => {
              for (let i = messages.length - 1; i >= 0; i--) {
                const isAI =
                  messages[i].role === MessageRole.Assistant ||
                  (messages[i].role as any) === 2 ||
                  String(messages[i].role).toLowerCase() === "assistant";
                if (isAI) return i;
              }
              return -1;
            })();

            return messages.map((msg, index) => {
              const isUser =
                msg.role === MessageRole.User ||
                (msg.role as any) === 1 ||
                String(msg.role).toLowerCase() === "user";

              const isOpeningMessage = index === 0 && !isUser;
              const isLatestAI = !isUser && index === lastAIMessageIndex;

              return (
                <div
                  key={msg.id}
                  className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-[88%] sm:max-w-[80%] items-start gap-3 ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    {isUser ? (
                      <Avatar
                        src={user?.avatarUrl}
                        alt={user?.userName || "Bạn"}
                        size="sm"
                        type="user"
                        className="!rounded-full border border-[#3b3d46] shrink-0"
                      />
                    ) : (
                      <Avatar
                        src={session?.characterAvatar}
                        alt={session?.characterName || "AI"}
                        size="sm"
                        type="character"
                        className="!rounded-2xl border border-[#3b3d46] shrink-0"
                      />
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`min-w-[200px] sm:min-w-[240px] rounded-2xl px-4 py-3.5 shadow-lg transition-all border border-[#31333a] bg-[#212227] text-zinc-100 backdrop-blur-md ${
                        isUser ? "rounded-tr-none" : "rounded-tl-none"
                      }`}
                    >
                      {isOpeningMessage && (
                        <div className={`flex items-center gap-1.5 mb-2.5 pb-2 border-b border-[#2c2e35] text-[11px] font-bold ${theme.badgeText}`}>
                          <Sparkles className={`h-3.5 w-3.5 ${theme.badgeIcon}`} />
                          <span className="uppercase tracking-wider">Cốt Truyện Mở Đầu</span>
                        </div>
                      )}

                      <div>
                        {renderFormattedMessage(msg.content, isUser)}
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-4 pt-2 border-t border-[#2c2e35]/60 text-[10px] text-zinc-500">
                        <span className="shrink-0 font-mono tracking-tight text-zinc-400">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Nút Quay về mốc này (Rollback) cho mọi tin nhắn cũ trong quá khứ - nằm bên phải */}
                          {index < messages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => setRollbackTarget({ id: msg.id, index })}
                              disabled={isSending || isRollingBack}
                              className="flex items-center gap-1.5 rounded-lg bg-[#272832] px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:bg-[#323440] hover:text-amber-300 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                              title="Quay về mốc hội thoại này (Xóa các tin nhắn sau đó để rẽ nhánh mới)"
                            >
                              <Undo2 className="h-3 w-3 text-amber-400" />
                              <span>Quay về đây</span>
                            </button>
                          )}

                          {/* Luôn hiển thị Tiếp tục và Tạo mới trên tin nhắn AI mới nhất */}
                          {isLatestAI && (
                            <>
                              <button
                                type="button"
                                onClick={handleContinueStory}
                                disabled={isSending}
                                className="flex items-center gap-1.5 rounded-lg bg-[#272832] px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:bg-[#323440] hover:text-cyan-300 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                                title="Tiếp tục cốt truyện / AI tự hành động tiếp"
                              >
                                <FastForward className="h-3 w-3 text-cyan-400" />
                                <span>Tiếp tục</span>
                              </button>

                              <button
                                type="button"
                                onClick={handleRegenerateLastResponse}
                                disabled={isSending}
                                className="flex items-center gap-1.5 rounded-lg bg-[#272832] px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:bg-[#323440] hover:text-amber-300 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                                title="Tạo lại phản hồi khác cho lượt này"
                              >
                                <RotateCcw className="h-3 w-3 text-amber-400" />
                                <span>Tạo mới</span>
                              </button>
                            </>
                          )}

                          {/* Nút sao chép văn bản */}
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
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
            });
          })()}

          {/* Quick Action Suggestions for Starter */}
          {!isSending && messages.length <= 1 && (
            <div className="pt-2 sm:pl-12 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400">
                <Sparkles className={`h-3 w-3 ${theme.badgeIcon}`} />
                <span>Gợi ý hành động nhập vai:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  `*Cẩn trọng lùi lại một bước, quan sát xung quanh kết giới*`,
                  `*Lễ phép cúi chào, giải thích lý do ngươi vượt qua làn sương*`,
                  `*Khẽ mỉm cười, bình tĩnh đối diện ánh mắt của ${session?.characterName || "nàng"}*`,
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`rounded-2xl border ${theme.chipBorder} ${theme.chipBg} px-3.5 py-2 text-xs ${theme.chipText} ${theme.chipHoverBorder} ${theme.chipHoverBg} ${theme.chipHoverText} transition-all cursor-pointer shadow-sm active:scale-95 text-left leading-relaxed`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Typing Indicator */}
          {isSending && (
            <div className="flex w-full justify-start">
              <div className="flex max-w-[85%] items-start gap-3 flex-row">
                <Avatar
                  src={session?.characterAvatar}
                  alt={session?.characterName || "AI"}
                  size="sm"
                  type="character"
                  className="!rounded-2xl border border-[#3b3d46]"
                />
                <div className="rounded-2xl rounded-tl-none border border-[#31333a] bg-[#212227] px-4 py-3 shadow-md">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></span>
                    <span className="ml-2 text-xs italic text-zinc-400">{session?.characterName} đang suy nghĩ...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Bar */}
      <footer className="border-t border-[#23242a] bg-[#141518]/95 px-3 py-2.5 backdrop-blur-xl shrink-0">
        <div className="mx-auto max-w-3xl">
          <form
            onSubmit={handleSendMessage}
            className="group relative flex items-end gap-2 rounded-2xl border border-[#2e3037] bg-[#1d1e23] p-1.5 pl-3.5 shadow-md transition-all focus-within:border-[#4d505c] focus-within:bg-[#22242a]"
          >
            <textarea
              rows={1}
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Nhập tin nhắn hoặc *hành động* đến ${session?.characterName}...`}
              className="max-h-36 min-h-[26px] flex-1 resize-none bg-transparent py-1 px-0 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-0 leading-relaxed custom-scrollbar"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-150 mb-0.5 ${
                inputMessage.trim() && !isSending
                  ? "bg-zinc-100 text-zinc-950 font-bold shadow-sm hover:bg-white active:scale-95 cursor-pointer"
                  : "bg-[#28292f] text-zinc-600 cursor-not-allowed opacity-40"
              }`}
              title="Gửi (Enter)"
            >
              {isSending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-300" />
              ) : (
                <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </form>
          <div className="mt-1 flex items-center justify-between px-2 text-[10px] text-zinc-500">
            <span>
              Hành động nhập vai đặt trong dấu <span className="text-zinc-300 font-mono">*sao*</span>
            </span>
            <span className="hidden sm:inline text-zinc-500">Enter gửi • Shift+Enter xuống dòng</span>
          </div>
        </div>
      </footer>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-[#31333a] bg-[#212227] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#2c2e35] pb-3">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-zinc-400" />
                <h3 className="font-bold text-zinc-100 text-sm">Hồ Sơ & Bối Cảnh Nhân Vật</h3>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-[#282930] hover:text-zinc-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3.5 pb-4 border-b border-[#2c2e35]/60">
              <Avatar
                src={session?.characterAvatar}
                alt={session?.characterName || "AI"}
                size="lg"
                type="character"
                className="!rounded-2xl border border-[#3b3d46] shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-base font-bold text-zinc-100">{session?.characterName}</h4>
                  {session?.characterCategory && (
                    <span className="rounded-lg bg-[#2b2c34] px-2 py-0.5 text-[10px] font-semibold text-zinc-300 border border-[#3b3d46]">
                      {CATEGORY_MAP[session.characterCategory] || session.characterCategory}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 font-medium">{session?.characterTitle || session?.title}</p>
              </div>
            </div>

            {/* Nội dung bối cảnh & Tính cách */}
            <div className="mt-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Bối Cảnh Nhập Vai & Mối Quan Hệ</span>
              <div className="max-h-60 overflow-y-auto custom-scrollbar rounded-2xl border border-[#2e3038] bg-[#16171b] p-4 text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-normal">
                {formatPersonalityForUser(session?.characterPersonality, session?.characterName) || "Chưa có mô tả bối cảnh chi tiết."}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowInfo(false)}
                className="rounded-xl bg-zinc-100 px-5 py-2 text-xs font-bold text-zinc-950 hover:bg-white transition-all active:scale-95 cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rollback Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!rollbackTarget}
        onClose={() => setRollbackTarget(null)}
        onConfirm={handleConfirmRollback}
        title="Quay về mốc hội thoại này?"
        description="Toàn bộ diễn biến và tin nhắn sau mốc này sẽ được xóa để bạn có thể tiếp tục rẽ một nhánh cốt truyện mới."
        confirmText="Quay về mốc này"
        cancelText="Giữ nguyên"
        variant="warning"
        isLoading={isRollingBack}
      />
    </div>
  );
}
