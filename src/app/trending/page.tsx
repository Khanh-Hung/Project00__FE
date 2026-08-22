"use client";

import { useEffect, useState, useRef } from "react";
import { Character, WorldGenre } from "@/types";
import { fetchCharacters, getOrCreateChatSession } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Avatar } from "@/components/ui/Avatar";
import { getWorldGenreMeta, WORLD_GENRE_OPTIONS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import {
  Flame,
  Trophy,
  Crown,
  MessageSquare,
  Loader2,
  LayoutGrid,
  ChevronDown,
  Clock,
  Calendar,
  Sparkles,
  Zap,
  Infinity as InfinityIcon,
} from "lucide-react";
import Link from "next/link";

type TimeRange = "WEEK" | "MONTH" | "YEAR" | "ALL";

const TIME_RANGE_OPTIONS: { id: TimeRange; label: string }[] = [
  { id: "WEEK", label: "Tuần" },
  { id: "MONTH", label: "Tháng" },
  { id: "YEAR", label: "Năm" },
  { id: "ALL", label: "Tất cả" },
];

export default function TrendingPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenreId, setSelectedGenreId] = useState<number | "ALL">("ALL");
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("ALL");
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsGenreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadTrending = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCharacters();
      setCharacters(data);
    } catch (err) {
      console.error("Failed to load trending characters", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrending();
  }, []);

  const handleStartChat = async (char: Character) => {
    try {
      setIsStartingChat(true);
      const session = await getOrCreateChatSession(char.id, `Trò chuyện cùng ${char.name}`);
      router.push(`/chat/${session.id}`);
    } catch (err) {
      console.error("Failed to start chat session", err);
      alert("Không thể khởi tạo phiên trò chuyện. Vui lòng thử lại!");
      setIsStartingChat(false);
    }
  };

  const filteredCharacters = characters.filter((c) => {
    const charGenre = c.worldGenre !== undefined ? Number(c.worldGenre) : WorldGenre.MundaneSliceOfLife;
    const matchGenre = selectedGenreId === "ALL" || charGenre === selectedGenreId;

    let matchTime = true;
    if (selectedTimeRange !== "ALL" && c.createdAt) {
      const created = new Date(c.createdAt).getTime();
      const now = Date.now();
      if (selectedTimeRange === "WEEK") {
        matchTime = now - created <= 7 * 24 * 60 * 60 * 1000;
      } else if (selectedTimeRange === "MONTH") {
        matchTime = now - created <= 30 * 24 * 60 * 60 * 1000;
      } else if (selectedTimeRange === "YEAR") {
        matchTime = now - created <= 365 * 24 * 60 * 60 * 1000;
      }
    }

    return matchGenre && matchTime;
  });

  const selectedGenreObj =
    selectedGenreId === "ALL" ? null : WORLD_GENRE_OPTIONS.find((g) => g.id === selectedGenreId);

  const selectedTimeObj = TIME_RANGE_OPTIONS.find((t) => t.id === selectedTimeRange);

  return (
    <div className="h-full flex flex-col bg-[#18191c] text-zinc-100 overflow-hidden selection:bg-[#353740] selection:text-white">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
          {/* Header Section */}
          <div className="border-b border-[#2c2e35] pb-6">
            <div className="flex items-center gap-2.5">
              <Flame className="h-6 w-6 text-amber-400" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
                Bảng Xếp Hạng & Thịnh Hành
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Khám phá những nhân vật AI được cộng đồng yêu thích và tương tác nhiều nhất
            </p>
          </div>

          {/* Controls Toolbar: Segmented Time Tabs (Left) & Genre Dropdown (Right) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-2">
            {/* Segmented Time Range Tabs */}
            <div className="inline-flex p-1 rounded-2xl bg-[#212227] border border-[#31333a] shadow-inner">
              {TIME_RANGE_OPTIONS.map((t) => {
                const isActive = selectedTimeRange === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTimeRange(t.id)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-zinc-100 text-zinc-950 font-bold shadow-md shadow-white/5"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-[#2b2c34]"
                    }`}
                  >
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* World Genre Dropdown Filter */}
            <div className="relative shrink-0" ref={filterDropdownRef}>
              <button
                type="button"
                onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                className="w-48 sm:w-52 flex items-center justify-between gap-2 rounded-2xl border border-[#31333a] bg-[#212227] px-3.5 py-2 text-xs sm:text-sm font-semibold text-zinc-200 hover:bg-[#2b2c34] transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-2 min-w-0 truncate">
                  {selectedGenreObj ? (
                    <>
                      <span className="shrink-0">{selectedGenreObj.emoji}</span>
                      <span className="truncate">{selectedGenreObj.label}</span>
                    </>
                  ) : (
                    <>
                      <LayoutGrid className="h-4 w-4 text-zinc-300 shrink-0" />
                      <span className="truncate">Tất cả thể loại</span>
                    </>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0" />
              </button>

              {isGenreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#31333a] bg-[#212227] shadow-2xl z-30 p-1.5 animate-in fade-in slide-in-from-top-2">
                  <div className="max-h-80 overflow-y-auto pr-1 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGenreId("ALL");
                        setIsGenreDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        selectedGenreId === "ALL"
                          ? "bg-zinc-100 text-zinc-950 font-bold"
                          : "text-zinc-300 hover:bg-[#2b2c34] hover:text-white"
                      }`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                      <span>Tất cả thể loại</span>
                    </button>

                    {WORLD_GENRE_OPTIONS.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          setSelectedGenreId(g.id);
                          setIsGenreDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          selectedGenreId === g.id
                            ? "bg-zinc-100 text-zinc-950 font-bold"
                            : "text-zinc-300 hover:bg-[#2b2c34] hover:text-white"
                        }`}
                      >
                        <span>{g.emoji}</span>
                        <span>{g.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
              <p className="mt-3 text-xs text-zinc-400">Đang tải bảng xếp hạng...</p>
            </div>
          ) : filteredCharacters.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#31333a] bg-[#212227]/40 p-8 text-center">
              <Trophy className="h-10 w-10 text-zinc-500 mb-3" />
              <h3 className="text-sm font-semibold text-zinc-200">Không có nhân vật nào</h3>
              <p className="mt-1 text-xs text-zinc-400">
                Hãy thử chọn thể loại thế giới khác để khám phá thêm!
              </p>
            </div>
          ) : (
            <div className="space-y-3 min-h-[400px]">
              {filteredCharacters.map((char, index) => {
                const rank = index + 1;
                const genreMeta = getWorldGenreMeta(char.worldGenre);

                return (
                  <div
                    key={char.id}
                    className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#31333a] bg-[#212227] p-4 sm:p-5 backdrop-blur-sm transition-all duration-200 hover:border-[#4a4d58] hover:bg-[#27282f] shadow-sm hover:shadow-xl"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Rank Number */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center font-extrabold text-base">
                        {rank === 1 ? (
                          <div className="flex items-center justify-center text-amber-400">
                            <Crown className="h-5 w-5 fill-amber-400/20 text-amber-400" />
                          </div>
                        ) : rank === 2 ? (
                          <span className="text-zinc-200 font-black text-sm">#2</span>
                        ) : rank === 3 ? (
                          <span className="text-amber-500 font-black text-sm">#3</span>
                        ) : (
                          <span className="text-zinc-500 font-bold text-sm">#{rank}</span>
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
                            title={char.name}
                            className="font-bold text-base text-zinc-100 hover:text-white transition-colors truncate"
                          >
                            {char.name}
                          </Link>
                          <span
                            title={genreMeta.desc ? `${genreMeta.label}: ${genreMeta.desc}` : genreMeta.label}
                            className="rounded-md bg-[#2b2c34] px-2 py-0.5 text-[10px] font-medium text-zinc-300 border border-[#3b3d46] flex items-center gap-1 cursor-help shrink-0"
                          >
                            <span>{genreMeta.emoji}</span>
                            <span>{genreMeta.label}</span>
                          </span>
                        </div>

                        <p title={char.title} className="mt-0.5 text-xs text-zinc-400 truncate cursor-help">
                          {char.title}
                        </p>
                        {char.personalityPrompt && (
                          <p
                            title={char.personalityPrompt}
                            className="mt-1 text-xs text-zinc-400 line-clamp-1 cursor-help"
                          >
                            {char.personalityPrompt}
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
                        <span>Trò chuyện</span>
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
