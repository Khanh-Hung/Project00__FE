"use client";

import { useEffect, useState } from "react";
import { Character } from "@/types";
import { fetchCharacters, getOrCreateChatSession } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Avatar } from "@/components/ui/Avatar";
import { useRouter } from "next/navigation";
import {
  Flame,
  Trophy,
  Crown,
  MessageSquare,
  Loader2,
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

export default function TrendingPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("Tuần này");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [isStartingChat, setIsStartingChat] = useState(false);

  const loadTrending = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCharacters(categoryFilter !== "Tất cả" ? categoryFilter : undefined);
      setCharacters(data);
    } catch (err) {
      console.error("Failed to load trending characters", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrending();
  }, [categoryFilter]);

  const handleStartChat = async (char: Character) => {
    try {
      setIsStartingChat(true);
      const session = await getOrCreateChatSession(char.id, `Trò chuyện cùng ${char.name}`);
      router.push(`/chat/${session.id}`);
    } catch (err) {
      console.error("Failed to start chat", err);
      alert("Không thể khởi tạo phòng chat. Vui lòng thử lại!");
      setIsStartingChat(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#18191c] text-zinc-100 overflow-hidden selection:bg-[#353740] selection:text-white">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-2xl border border-[#31333a] bg-gradient-to-r from-[#282930] via-[#212227] to-[#212227] p-5 sm:p-6 mb-6 shadow-xl">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#2b2c34] border border-[#3b3d46] px-3 py-1 text-xs font-semibold text-zinc-200 mb-3.5">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>Bảng Xếp Hạng Cộng Đồng</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-100">
              Nhân Vật AI Thịnh Hành
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 leading-normal font-normal max-w-4xl">
              Khám phá những nhân vật AI được cộng đồng yêu thích, tương tác nhiều nhất và có cốt truyện nhập vai sâu sắc nhất.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c2e35] pb-6 mb-8">
          <div className="flex items-center gap-2">
            {["Hôm nay", "Tuần này", "Mọi thời đại"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  timeFilter === t
                    ? "bg-zinc-100 text-zinc-950 shadow-md"
                    : "bg-[#212227] text-zinc-400 hover:bg-[#282930] hover:text-zinc-200 border border-[#31333a]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "Tất cả", label: "Tất cả" },
              { id: "Companion", label: "Bạn đồng hành" },
              { id: "Anime", label: "Anime" },
              { id: "Fantasy", label: "Kỳ ảo" },
              { id: "RPG", label: "Nhập vai" },
              { id: "Assistant", label: "Trợ lý" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === cat.id
                    ? "bg-[#2f313a] text-zinc-100 border border-[#4f5260]"
                    : "bg-[#212227] text-zinc-400 hover:text-zinc-200 border border-[#31333a]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard List */}
        {isLoading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            <p className="mt-3 text-xs text-zinc-400">Đang tải bảng xếp hạng...</p>
          </div>
        ) : characters.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#31333a] bg-[#212227]/40 p-10 text-center">
            <Trophy className="h-10 w-10 text-zinc-500 mb-3" />
            <h3 className="text-sm font-semibold text-zinc-200">Chưa có nhân vật nổi bật</h3>
            <p className="mt-1 text-xs text-zinc-400">Hãy tạo nhân vật mới để vinh danh trên bảng xếp hạng!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {characters.map((char, index) => {
              const rank = index + 1;
              const isTop1 = rank === 1;
              const isTop2 = rank === 2;
              const isTop3 = rank === 3;

              return (
                <div
                  key={char.id}
                  className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-xl ${
                    isTop1
                      ? "border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-[#212227] to-[#212227] hover:border-amber-500/60"
                      : isTop2
                      ? "border-zinc-400/40 bg-[#212227] hover:border-zinc-300"
                      : isTop3
                      ? "border-amber-700/40 bg-[#212227] hover:border-amber-600"
                      : "border-[#31333a] bg-[#212227] hover:border-[#4a4d58] hover:bg-[#27282f]"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                    {/* Rank Badge */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-sm">
                      {isTop1 ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/20">
                          <Crown className="h-5 w-5" />
                        </div>
                      ) : isTop2 ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-400/20 text-zinc-200 border border-zinc-400/40">
                          #2
                        </div>
                      ) : isTop3 ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-800/20 text-amber-400 border border-amber-800/40">
                          #3
                        </div>
                      ) : (
                        <span className="text-zinc-500 font-bold">#{rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <Link
                      href={`/character/${char.id}`}
                      className="transition-transform group-hover:scale-105 shrink-0"
                    >
                      <Avatar
                        src={char.avatarUrl}
                        alt={char.name}
                        size="lg"
                        type="character"
                        className="!rounded-2xl border border-[#3b3d46]"
                      />
                    </Link>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/character/${char.id}`}
                          className="font-bold text-base text-zinc-100 hover:text-white transition-colors truncate"
                        >
                          {char.name}
                        </Link>
                        <span className="rounded-md bg-[#2b2c34] px-2 py-0.5 text-[11px] font-medium text-zinc-300 border border-[#3b3d46]">
                          {CATEGORY_MAP[char.category] || char.category}
                        </span>
                      </div>

                      <p className="mt-0.5 text-xs text-zinc-400 truncate">{char.title}</p>
                      {char.greeting && (
                        <p className="mt-1 text-xs text-zinc-400 italic line-clamp-1">
                          "{char.greeting}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2.5 shrink-0 pt-3 sm:pt-0 border-t border-[#2c2e35] sm:border-t-0">
                    <Link
                      href={`/character/${char.id}`}
                      className="rounded-xl border border-[#3b3d46] bg-[#2b2c34] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:bg-[#353740] hover:text-white transition-colors"
                    >
                      Hồ sơ
                    </Link>

                    <button
                      onClick={() => handleStartChat(char)}
                      className="flex items-center gap-1.5 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Chat ngay</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
