"use client";

import { useEffect, useState } from "react";
import { ChatSessionListItem } from "@/types";
import { fetchRecentSessions, deleteChatSession } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Avatar } from "@/components/ui/Avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/core/providers/AuthProvider";
import { useRouter } from "next/navigation";
import {
  History,
  MessageSquare,
  Trash2,
  Search,
  Loader2,
  Sparkles,
  ArrowRight,
  Clock,
  X,
  Lock,
  LogIn,
} from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading, openAuthModal } = useAuth();
  const [sessions, setSessions] = useState<ChatSessionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Custom Modal Dialog States
  const [sessionToDelete, setSessionToDelete] = useState<ChatSessionListItem | null>(null);
  const [isCleanDialogOpen, setIsCleanDialogOpen] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

  const loadSessions = async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);
      const data = await fetchRecentSessions();
      setSessions(data);
    } catch (err) {
      console.error("Failed to load chat history", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const handleConfirmDeleteSingle = async () => {
    if (!sessionToDelete) return;
    try {
      setDeletingId(sessionToDelete.id);
      await deleteChatSession(sessionToDelete.id);
      setSessions((prev) => prev.filter((s) => s.id !== sessionToDelete.id));
      setSessionToDelete(null);
    } catch (err) {
      console.error("Failed to delete session", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleConfirmCleanEmpty = async () => {
    const emptySessions = sessions.filter((s) => s.messageCount === 0);
    if (emptySessions.length === 0) {
      setIsCleanDialogOpen(false);
      return;
    }

    try {
      setIsCleaning(true);
      for (const s of emptySessions) {
        await deleteChatSession(s.id).catch(() => {});
      }
      setSessions((prev) => prev.filter((s) => s.messageCount > 0));
      setIsCleanDialogOpen(false);
    } catch (err) {
      console.error("Failed to clean empty sessions", err);
    } finally {
      setIsCleaning(false);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const matchName = s.characterName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTitle = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLastMsg = (s.lastMessageContent || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchName || matchTitle || matchLastMsg;
  });

  const emptySessionsCount = sessions.filter((s) => s.messageCount === 0).length;

  if (!isAuthLoading && !isAuthenticated) {
    return (
      <div className="h-full flex flex-col bg-[#18191c] text-zinc-100 overflow-hidden selection:bg-[#353740] selection:text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl border border-[#31333a] bg-[#212227] p-8 text-center shadow-xl">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#2b2c34] border border-[#3b3d46] flex items-center justify-center text-zinc-200 mb-5">
              <Lock className="w-6 h-6 text-zinc-300" />
            </div>
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Lịch sử Trò chuyện</h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 mb-6 leading-relaxed">
              Vui lòng đăng nhập để lưu trữ và xem lại lịch sử các cuộc trò chuyện nhập vai của bạn.
            </p>
            <button
              onClick={openAuthModal}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 py-2.5 px-4 text-xs sm:text-sm font-bold shadow-md shadow-white/5 transition-all cursor-pointer active:scale-98"
            >
              <LogIn className="w-4 h-4 text-zinc-950" />
              <span>Đăng nhập ngay</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#18191c] text-zinc-100 overflow-hidden selection:bg-[#353740] selection:text-white">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Page Title & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c2e35] pb-6 mb-8">
            <div>
              <div className="flex items-center gap-2.5">
                <History className="h-6 w-6 text-zinc-300" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
                  Lịch sử Trò chuyện
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-normal">
                Quản lý và tiếp tục các cuộc hội thoại nhập vai dang dở của bạn
              </p>
            </div>

            <div className="flex items-center gap-3">
              {emptySessionsCount > 0 && (
                <button
                  onClick={() => setIsCleanDialogOpen(true)}
                  disabled={isCleaning}
                  className="flex items-center gap-1.5 rounded-2xl border border-[#3b3d46] bg-[#2b2c34] px-3.5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-rose-950/30 hover:border-rose-500/40 hover:text-rose-300 transition-colors cursor-pointer whitespace-nowrap"
                  title="Xóa các cuộc trò chuyện chưa có tin nhắn nào"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Dọn {emptySessionsCount} phiên trống</span>
                </button>
              )}

              <div className="relative flex items-center w-full sm:w-64">
                <Search className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full rounded-2xl border border-[#31333a] bg-[#212227] py-2.5 pl-10 pr-9 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#525562] focus:bg-[#26272e] focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 rounded-md p-1 text-zinc-400 hover:text-zinc-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          {isLoading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
              <p className="mt-3 text-xs text-zinc-400">Đang tải lịch sử trò chuyện...</p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#31333a] bg-[#212227]/40 p-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2b2c34] text-zinc-400 mb-3">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200">
                {searchQuery ? "Không tìm thấy kết quả" : "Chưa có cuộc trò chuyện nào"}
              </h3>
              <p className="mt-1 text-xs text-zinc-400 max-w-sm">
                {searchQuery
                  ? `Không có phiên chat nào khớp với từ khóa "${searchQuery}".`
                  : "Hãy chọn một nhân vật AI ở trang Khám phá để bắt đầu cuộc trò chuyện đầu tiên!"}
              </p>
              <Link
                href="/"
                className="mt-4 flex items-center gap-1.5 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-white transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                <span>Khám phá Nhân vật ngay</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => router.push(`/chat/${session.id}`)}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#31333a] bg-[#212227] p-4 sm:p-5 backdrop-blur-sm transition-all duration-200 hover:border-[#4a4d58] hover:bg-[#27282f] cursor-pointer shadow-sm hover:shadow-xl"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <Avatar
                      src={session.characterAvatar}
                      alt={session.characterName}
                      size="md"
                      type="character"
                      className="!rounded-2xl border border-[#3b3d46]"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-zinc-100 group-hover:text-white transition-colors truncate">
                          {session.characterName}
                        </h3>
                        <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(session.lastMessageTime || session.createdAt).toLocaleDateString("vi-VN", {
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <p className="mt-0.5 text-xs text-zinc-400 font-medium truncate">
                        {session.title}
                      </p>

                      <p className="mt-1 text-xs text-zinc-400 line-clamp-1 italic">
                        {session.lastMessageContent
                          ? `"${session.lastMessageContent}"`
                          : "Chưa có tin nhắn nào"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t border-[#2c2e35] sm:border-t-0">
                    <span className="rounded-md bg-[#2b2c34] border border-[#3b3d46] px-2 py-0.5 text-[11px] text-zinc-300 font-medium mr-2">
                      {session.messageCount} tin nhắn
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSessionToDelete(session);
                      }}
                      disabled={deletingId === session.id}
                      title="Xóa phiên trò chuyện"
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#31333a] bg-[#212227] text-zinc-400 hover:border-rose-500/40 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                    >
                      {deletingId === session.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      onClick={() => router.push(`/chat/${session.id}`)}
                      className="flex items-center gap-1 rounded-xl bg-zinc-100 px-3.5 py-1.5 text-xs font-bold text-zinc-950 hover:bg-white active:scale-95 transition-all"
                    >
                      <span>Tiếp tục</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Delete Single Session Dialog */}
      <ConfirmDialog
        isOpen={Boolean(sessionToDelete)}
        onClose={() => setSessionToDelete(null)}
        onConfirm={handleConfirmDeleteSingle}
        title="Xóa cuộc trò chuyện?"
        description={
          <span>
            Xóa toàn bộ tin nhắn cùng{" "}
            <strong className="text-zinc-200">{sessionToDelete?.characterName}</strong>?
          </span>
        }
        confirmText="Xác nhận xóa"
        variant="danger"
        isLoading={Boolean(deletingId)}
      />

      {/* Clean Empty Sessions Dialog */}
      <ConfirmDialog
        isOpen={isCleanDialogOpen}
        onClose={() => setIsCleanDialogOpen(false)}
        onConfirm={handleConfirmCleanEmpty}
        title="Dọn dẹp phiên trống?"
        description={
          <span>
            Xóa <strong className="text-zinc-200">{emptySessionsCount} cuộc trò chuyện</strong> chưa có tin nhắn?
          </span>
        }
        confirmText={`Xóa ${emptySessionsCount} phiên`}
        variant="danger"
        isLoading={isCleaning}
      />
    </div>
  );
}
