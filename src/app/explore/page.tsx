"use client";

import { useEffect, useState, useRef } from "react";
import { Character, WorldGenre } from "@/types";
import { fetchCharacters, getOrCreateChatSession } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { CharacterCard, CharacterCardSkeleton } from "@/components/characters/CharacterCard";
import { WORLD_GENRE_OPTIONS, getWorldGenreMeta } from "@/lib/constants";
import { useRouter } from "next/navigation";
import {
  Search,
  Loader2,
  Sparkles,
  X,
  LayoutGrid,
  Grid3X3,
  ChevronDown,
  Globe,
} from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenreId, setSelectedGenreId] = useState<number | "ALL">("ALL");
  const [gridCols, setGridCols] = useState<4 | 6>(4);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("nyxoris_explore_cols");
    if (saved) {
      const parsed = Number(saved);
      if (parsed === 4 || parsed === 6) {
        setGridCols(parsed);
      }
    }
  }, []);

  const handleSetGridCols = (cols: 4 | 6) => {
    setGridCols(cols);
    try {
      localStorage.setItem("nyxoris_explore_cols", String(cols));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsGenreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadCharacters = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCharacters();
      setCharacters(data);
    } catch (err) {
      console.error("Failed to load characters", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  const handleSelectCharacter = async (char: Character) => {
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
    const matchName = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTitle = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTags = c.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchSearch = matchName || matchTitle || matchTags;

    const charGenre = c.worldGenre !== undefined ? Number(c.worldGenre) : WorldGenre.MundaneSliceOfLife;
    const matchGenre = selectedGenreId === "ALL" || charGenre === selectedGenreId;

    return matchSearch && matchGenre;
  });

  const selectedGenreObj =
    selectedGenreId === "ALL" ? null : WORLD_GENRE_OPTIONS.find((g) => g.id === selectedGenreId);

  const gridColsClass =
    gridCols === 6
      ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className="h-full flex flex-col bg-[#18191c] text-zinc-100 overflow-hidden selection:bg-[#353740] selection:text-white">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-[#31333a] bg-[#212227] p-6 sm:p-8 shadow-xl backdrop-blur-xl">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2b2c34] border border-[#3b3d46] text-xs font-semibold text-zinc-300">
                <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
                <span>Thế Giới Nhân Vật AI</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
                Khám Phá Những Nhân Vật AI Độc Đáo
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Trò chuyện, nhập vai và kết nối cùng những người bạn ảo mang đậm cá tính riêng.
              </p>
            </div>
          </div>

          {/* Search and Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên, danh hiệu hoặc thẻ từ khóa..."
                className="w-full rounded-2xl border border-[#31333a] bg-[#212227] py-2.5 pl-10 pr-8 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-400 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {/* Single Grid Density Toggle Button */}
              <button
                type="button"
                onClick={() => handleSetGridCols(gridCols === 4 ? 6 : 4)}
                className="h-10 w-10 hidden sm:flex items-center justify-center rounded-2xl border border-[#31333a] bg-[#212227] text-zinc-300 hover:text-white hover:bg-[#2b2c34] hover:border-[#4a4d58] transition-all duration-300 cursor-pointer shadow-sm active:scale-90 select-none group"
                title={
                  gridCols === 4
                    ? "Chuyển sang chế độ 6 thẻ / hàng (Thu nhỏ)"
                    : "Chuyển sang chế độ 4 thẻ / hàng (Tiêu chuẩn)"
                }
              >
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {gridCols === 4 ? (
                    <LayoutGrid className="h-4 w-4 text-zinc-300 transition-all duration-300" />
                  ) : (
                    <Grid3X3 className="h-4 w-4 text-zinc-100 transition-all duration-300" />
                  )}
                </div>
              </button>

              {/* World Genre Dropdown Filter */}
              <div className="relative" ref={filterDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                  className="w-48 sm:w-52 flex items-center justify-between gap-2 rounded-2xl border border-[#31333a] bg-[#212227] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-200 hover:bg-[#2b2c34] transition-colors cursor-pointer select-none"
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
                          <span className="truncate">{g.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Character Grid */}
          {isLoading ? (
            <div className={`grid gap-4 ${gridColsClass} min-h-[450px]`}>
              {Array.from({ length: gridCols === 6 ? 12 : 8 }).map((_, i) => (
                <CharacterCardSkeleton key={i} dense={gridCols === 6} />
              ))}
            </div>
          ) : filteredCharacters.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#31333a] bg-[#212227]/40 p-10 text-center">
              <Sparkles className="h-10 w-10 text-zinc-500 mb-3" />
              <h3 className="text-base font-bold text-zinc-200">Không tìm thấy nhân vật nào</h3>
              <p className="mt-1 text-xs text-zinc-400 max-w-sm">
                Hãy thử đổi từ khóa tìm kiếm hoặc chọn thể loại thế giới khác!
              </p>
            </div>
          ) : (
            <div className={`grid gap-4 ${gridColsClass} min-h-[450px]`}>
              {filteredCharacters.map((char) => (
                <CharacterCard
                  key={char.id}
                  character={char}
                  onSelect={handleSelectCharacter}
                  dense={gridCols === 6}
                />
              ))}
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
