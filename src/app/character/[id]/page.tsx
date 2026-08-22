"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Character, WorldGenre } from "@/types";
import { fetchCharacterById, getOrCreateChatSession, proactiveReachout } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/core/providers/AuthProvider";
import { WORLD_GENRE_OPTIONS } from "@/lib/constants";
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
  Globe,
  Brain,
} from "lucide-react";
import Link from "next/link";



export default function CharacterProfilePage() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;

  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isProactiveLoading, setIsProactiveLoading] = useState(false);
  const [proactiveResult, setProactiveResult] = useState<{ matchReason: string; openingMessage: string } | null>(null);
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

  const handleProactiveReachout = async () => {
    if (!character || !user?.id) {
      if (!isAuthenticated) openAuthModal();
      return;
    }

    try {
      setIsProactiveLoading(true);
      const res = await proactiveReachout({
        characterId: character.id,
        userId: user.id,
      });

      setProactiveResult({
        matchReason: res.matchReason,
        openingMessage: res.openingMessage,
      });

      setTimeout(() => {
        router.push(`/chat/${res.sessionId}`);
      }, 2500);
    } catch (err: any) {
      console.error("Proactive reachout failed:", err);
      alert(err.message || "Không thể kích hoạt kết nối làm quen lúc này.");
      setIsProactiveLoading(false);
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

  const worldGenreInfo = WORLD_GENRE_OPTIONS.find(
    (g) => g.id === (character.worldGenre !== undefined ? Number(character.worldGenre) : WorldGenre.MundaneSliceOfLife)
  );

  return (
    <div className="h-full flex flex-col bg-[#18191c] text-zinc-100 overflow-hidden selection:bg-[#353740] selection:text-white">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại danh sách</span>
          </Link>

          {/* Hero Profile Card */}
          <div className="relative overflow-hidden rounded-3xl border border-[#31333a] bg-[#212227] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              {/* Avatar */}
              <Avatar
                src={character.avatarUrl}
                alt={character.name}
                size="xl"
                type="character"
                className="!h-28 !w-28 sm:!h-36 sm:!w-36 border-2 border-[#3b3d46] shadow-xl shrink-0"
              />

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {worldGenreInfo && (
                      <span className="flex items-center gap-1 rounded-lg bg-[#2b2c34] px-2.5 py-1 text-xs font-semibold text-zinc-300 border border-[#3b3d46]">
                        <span>{worldGenreInfo.emoji}</span>
                        <span>{worldGenreInfo.label}</span>
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
                <div className="mt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
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

                {/* Two-Way Actions Bar */}
                <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  {/* Direction 1: User starts chat */}
                  <button
                    onClick={handleStartChat}
                    className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-5 py-3 text-xs sm:text-sm font-bold text-zinc-950 shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Nhắn Tin Làm Quen</span>
                  </button>

                  {/* Direction 2: Character proactively reaches out */}
                  <button
                    onClick={handleProactiveReachout}
                    disabled={isProactiveLoading}
                    className="flex items-center gap-2 rounded-2xl border border-[#3b3d46] bg-[#2b2c34] hover:bg-[#353740] hover:text-white px-5 py-3 text-xs sm:text-sm font-bold text-zinc-200 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isProactiveLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-zinc-300" />
                        <span>Đang Lướt Profile Bạn...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-zinc-300" />
                        <span>Để Nhân Vật Chủ Động Bắt Chuyện</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 rounded-2xl border border-[#3b3d46] bg-[#2b2c34] px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-300 hover:bg-[#353740] hover:text-white transition-all active:scale-95 cursor-pointer"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4 text-zinc-400" />}
                    <span>{copied ? "Đã sao chép!" : "Chia sẻ"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Proactive Match Notice Banner if triggered */}
          {proactiveResult && (
            <div className="p-5 rounded-2xl bg-[#212227] border border-zinc-500/30 animate-in fade-in slide-in-from-top-3">
              <div className="flex items-center gap-2.5 text-xs font-bold text-zinc-200 mb-2">
                <Sparkles className="h-4 w-4 text-zinc-300" />
                <span>{character.name} đã lướt xem trang cá nhân của bạn và tìm thấy điểm chung:</span>
              </div>
              <p className="text-xs text-zinc-300 font-semibold mb-2 bg-[#17181c] p-2.5 rounded-xl border border-[#31333a]">
                🎯 "{proactiveResult.matchReason}"
              </p>
              <p className="text-xs italic text-zinc-300 leading-relaxed">
                "{proactiveResult.openingMessage}"
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-300" />
                <span>Đang chuyển bạn vào phòng chat cùng {character.name}...</span>
              </div>
            </div>
          )}



          {/* Personality / Life Story */}
          <div className="rounded-2xl border border-[#31333a] bg-[#212227] p-6 backdrop-blur-sm">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-zinc-400" />
              <span>Tiểu Sử & Cuộc Sống Thường Nhật</span>
            </h2>
            <div className="whitespace-pre-wrap text-xs sm:text-sm text-zinc-300 leading-relaxed bg-[#191a1e] p-5 rounded-xl border border-[#2c2e35]">
              {character.personalityPrompt}
            </div>
          </div>

          {/* 7 Dimensions Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* World Setting */}
            {character.worldName || character.worldDescription ? (
              <div className="p-5 rounded-2xl border border-[#31333a] bg-[#212227] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                  <Globe className="h-4 w-4 text-zinc-400" />
                  Vũ Trụ & Bối Cảnh Thực Tại
                </div>
                {character.worldName && (
                  <div className="text-xs font-semibold text-zinc-200">
                    Vùng đất: <span className="text-zinc-100">{character.worldName}</span>
                  </div>
                )}
                {character.worldDescription && (
                  <p className="text-xs text-zinc-400 leading-relaxed">{character.worldDescription}</p>
                )}
              </div>
            ) : null}

            {/* Psychology & Boundaries */}
            {character.blueprint?.psychology?.desires || character.blueprint?.rules?.boundaries ? (
              <div className="p-5 rounded-2xl border border-[#31333a] bg-[#212227] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                  <Brain className="h-4 w-4 text-zinc-400" />
                  Khát Vọng & Lòng Tự Trọng
                </div>
                {character.blueprint.psychology?.desires && (
                  <div className="text-xs text-zinc-300">
                    <span className="text-zinc-400 font-semibold">Khát vọng:</span> {character.blueprint.psychology.desires}
                  </div>
                )}
                {character.blueprint.rules?.boundaries && (
                  <div className="text-xs text-zinc-300">
                    <span className="text-zinc-400 font-semibold">Ranh giới:</span> {character.blueprint.rules.boundaries.join("; ")}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </main>
      </div>

      {/* Starting Chat Loading Overlay */}
      {isStartingChat && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin text-zinc-300" />
          <p className="mt-4 text-sm font-semibold text-zinc-200">Đang khởi tạo phòng chat...</p>
        </div>
      )}
    </div>
  );
}
