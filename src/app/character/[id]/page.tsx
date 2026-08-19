"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Character } from "@/types";
import { fetchCharacterById, getOrCreateChatSession } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/core/providers/AuthProvider";
import {
  ArrowLeft,
  MessageSquare,
  Share2,
  Sparkles,
  Loader2,
  Tag,
  Calendar,
  Check,
  User,
} from "lucide-react";
import Link from "next/link";

const CATEGORY_MAP: Record<string, string> = {
  Companion: "Bạn đồng hành",
  Anime: "Anime",
  Fantasy: "Kỳ ảo",
  RPG: "Nhập vai",
  Assistant: "Trợ lý",
  Mentor: "Cố vấn",
};

export default function CharacterProfilePage() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;

  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadChar = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCharacterById(characterId);
        setCharacter(data);
      } catch (err) {
        console.error("Failed to load character details", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (characterId) {
      loadChar();
    }
  }, [characterId]);

  const handleStartChat = async () => {
    if (!character) return;
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    try {
      setIsStartingChat(true);
      const session = await getOrCreateChatSession(character.id, `Trò chuyện cùng ${character.name}`);
      router.push(`/chat/${session.id}`);
    } catch (err) {
      console.error("Failed to start chat session", err);
      alert("Không thể khởi tạo phòng chat. Vui lòng thử lại!");
      setIsStartingChat(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#18191c] text-zinc-100">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />
        <p className="mt-4 text-sm text-zinc-400">Đang tải hồ sơ nhân vật...</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-[#18191c] text-zinc-100 flex flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl font-bold text-zinc-200">Không tìm thấy nhân vật</h2>
          <p className="mt-2 text-sm text-zinc-400">Nhân vật này có thể đã bị xóa hoặc không tồn tại.</p>
          <Link
            href="/"
            className="mt-6 flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại Trang chủ</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#18191c] text-zinc-100 overflow-hidden selection:bg-[#353740] selection:text-white">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại danh sách</span>
        </Link>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#31333a] bg-[#212227] p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {/* Avatar */}
            <Avatar
              src={character.avatarUrl}
              alt={character.name}
              size="xl"
              type="character"
              className="border border-[#3b3d46] shadow-xl"
            />

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-[#2b2c34] px-2.5 py-1 text-xs font-semibold text-zinc-300 border border-[#3b3d46]">
                    {CATEGORY_MAP[character.category] || character.category}
                  </span>
                  {character.creatorName && (
                    <span className="flex items-center gap-1.5 rounded-lg bg-[#2b2c34] px-2.5 py-1 text-xs font-medium text-amber-300 border border-amber-500/20">
                      <User className="h-3 w-3 text-amber-400" />
                      <span>
                        Tạo bởi{" "}
                        <strong className="text-zinc-100 font-semibold">{character.creatorName}</strong>
                        {character.creatorUserName && (
                          <span className="text-zinc-400 ml-1 text-[11px]">
                            (@{character.creatorUserName})
                          </span>
                        )}
                      </span>
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{new Date(character.createdAt).toLocaleDateString("vi-VN")}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-100">
                {character.name}
              </h1>
              <p className="mt-1 text-sm sm:text-base text-zinc-400 font-medium">
                {character.title}
              </p>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                {character.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 rounded-full bg-[#2b2c34] px-2.5 py-0.5 text-xs text-zinc-300 border border-[#3b3d46]"
                  >
                    <Tag className="h-3 w-3 text-zinc-400" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>

              {/* Actions Bar */}
              <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <button
                  onClick={handleStartChat}
                  className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-6 py-3 text-sm font-bold text-zinc-950 shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Bắt đầu Trò chuyện</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 rounded-2xl border border-[#3b3d46] bg-[#2b2c34] px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-[#353740] hover:text-white transition-all active:scale-95 cursor-pointer"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4 text-zinc-400" />}
                  <span>{copied ? "Đã sao chép link!" : "Chia sẻ"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs / Sections */}
        <div className="mt-8 space-y-6">
          {/* Greeting Box */}
          {character.greeting && (
            <div className="rounded-2xl border border-[#31333a] bg-[#212227] p-6 backdrop-blur-sm">
              <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-zinc-400" />
                <span>Lời Chào Mở Đầu</span>
              </h2>
              <p className="text-sm italic text-zinc-200 leading-relaxed bg-[#191a1e] p-4 rounded-xl border border-[#2c2e35]">
                "{character.greeting}"
              </p>
            </div>
          )}

          {/* Personality / Backstory */}
          <div className="rounded-2xl border border-[#31333a] bg-[#212227] p-6 backdrop-blur-sm">
            <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-zinc-400" />
              <span>Tính Cách & Bối Cảnh</span>
            </h2>
            <div className="whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed bg-[#191a1e] p-5 rounded-xl border border-[#2c2e35]">
              {character.personalityPrompt}
            </div>
          </div>
        </div>
      </main>
      </div>

      {/* Starting Chat Loading Overlay */}
      {isStartingChat && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin text-zinc-300" />
          <p className="mt-4 text-sm font-semibold text-zinc-200">Đang khởi tạo phòng chat nhập vai...</p>
        </div>
      )}
    </div>
  );
}
