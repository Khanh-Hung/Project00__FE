"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatMessage, ChatSession, MessageRole } from "@/types";
import { fetchChatSession, sendChatMessage } from "@/lib/api";
import { ArrowLeft, Send, Sparkles, User, Bot, Loader2, Info, X } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const loadSession = async () => {
      try {
        setIsLoading(true);
        const data = await fetchChatSession(sessionId);
        setSession(data);
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Failed to load chat session", err);
        alert("Không tìm thấy phiên chat này!");
        router.push("/");
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderFormattedMessage = (content: string) => {
    const parts = content.split(/(\*[^*]+\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        const actionText = part.slice(1, -1);
        return (
          <span
            key={index}
            className="my-0.5 inline-block rounded-md bg-purple-500/15 px-1.5 py-0.5 text-[13px] font-medium italic text-purple-300 border border-purple-500/20"
          >
            *{actionText}*
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100">
        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
        <p className="mt-4 text-sm text-zinc-400">Đang tải phòng chat nhập vai...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100 overflow-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* Chat Top Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800 shadow-md">
            <img
              src={session?.characterAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${session?.characterName}`}
              alt={session?.characterName}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-zinc-100">{session?.characterName}</h2>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 truncate max-w-[250px] sm:max-w-md">
              {session?.title}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          <Info className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Bối cảnh</span>
        </button>
      </header>

      {/* Chat Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="rounded-2xl border border-purple-500/20 bg-purple-950/20 p-4 text-center text-xs text-purple-300">
            <Sparkles className="mx-auto h-5 w-5 mb-1.5 text-purple-400" />
            <p className="font-semibold">Bạn đang trò chuyện với {session?.characterName}</p>
            <p className="text-zinc-400 mt-0.5">Nhập vai tự do, mọi hành động diễn tả trong dấu *sao* sẽ được AI nắm bắt!</p>
          </div>

          {messages.map((msg) => {
            const isUser = msg.role === MessageRole.User;
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-bold shadow-md ${
                    isUser
                      ? "border-indigo-600 bg-indigo-700 text-white"
                      : "border-purple-600 bg-purple-900 text-purple-200"
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={`relative max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                    isUser
                      ? "rounded-tr-none bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "rounded-tl-none border border-zinc-800 bg-zinc-900/90 text-zinc-100 backdrop-blur-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    {isUser ? msg.content : renderFormattedMessage(msg.content)}
                  </div>
                  <div
                    className={`mt-1 text-[10px] ${
                      isUser ? "text-indigo-200 text-right" : "text-zinc-500 text-left"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-purple-600 bg-purple-900 text-purple-200 text-xs shadow-md">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-none border border-zinc-800 bg-zinc-900/90 px-4 py-3 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400"></span>
                  <span className="ml-2 text-xs italic text-zinc-400">{session?.characterName} đang soạn câu trả lời...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Bar */}
      <footer className="border-t border-zinc-800 bg-zinc-900/90 p-4 backdrop-blur-md">
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 flex flex-wrap gap-2 overflow-x-auto pb-1">
            {["*mỉm cười vẫy tay chào*", "Bạn cảm thấy thế nào hôm nay?", "Kể cho mình nghe về bạn đi!"].map(
              (suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputMessage(suggestion)}
                  className="rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1 text-xs text-zinc-400 hover:border-purple-500/50 hover:bg-zinc-800 hover:text-purple-300 transition-all"
                >
                  {suggestion}
                </button>
              )
            )}
          </div>

          <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                rows={2}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Gửi tin nhắn hoặc hành động *nhập vai* đến ${session?.characterName}...`}
                className="w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 transition-all active:scale-95"
            >
              {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </form>
          <p className="mt-1.5 text-center text-[11px] text-zinc-500">
            Nhấn <kbd className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-400">Enter</kbd> để gửi, <kbd className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-400">Shift + Enter</kbd> để xuống dòng
          </p>
        </div>
      </footer>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-zinc-100">Thông tin Nhân vật</h3>
              <button
                onClick={() => setShowInfo(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <img
                src={session?.characterAvatar}
                alt={session?.characterName}
                className="h-14 w-14 rounded-2xl border border-zinc-700 object-cover"
              />
              <div>
                <h4 className="font-bold text-purple-300">{session?.characterName}</h4>
                <p className="text-xs text-zinc-400">{session?.title}</p>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowInfo(false)}
                className="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
