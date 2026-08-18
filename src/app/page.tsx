"use client";

import { useEffect, useState, useRef } from "react";
import { Character, CreateCharacterRequest } from "@/types";
import { fetchCharacters, createCharacter, getOrCreateChatSession } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { CharacterCard } from "@/components/characters/CharacterCard";
import { CreateCharacterModal } from "@/components/characters/CreateCharacterModal";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Loader2,
  Sparkles,
  X,
  Heart,
  Flame,
  Wand2,
  Swords,
  Bot,
  GraduationCap,
  LayoutGrid,
  SlidersHorizontal,
  ChevronDown,
  Check,
  RotateCcw,
} from "lucide-react";

const CATEGORIES = [
  { id: "Tất cả", label: "Tất cả", icon: LayoutGrid, color: "text-sky-400" },
  { id: "Companion", label: "Bạn đồng hành", icon: Heart, color: "text-rose-400" },
  { id: "Anime", label: "Anime", icon: Flame, color: "text-amber-400" },
  { id: "Fantasy", label: "Kỳ ảo", icon: Wand2, color: "text-violet-400" },
  { id: "RPG", label: "Nhập vai", icon: Swords, color: "text-red-400" },
  { id: "Assistant", label: "Trợ lý", icon: Bot, color: "text-cyan-400" },
  { id: "Mentor", label: "Cố vấn", icon: GraduationCap, color: "text-emerald-400" },
];

export default function HomePage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadCharacters = async (cat?: string) => {
    try {
      setIsLoading(true);
      const queryCat = cat && cat !== "Tất cả" ? cat : undefined;
      const data = await fetchCharacters(queryCat);
      setCharacters(data);
    } catch (err) {
      console.error("Failed to load characters", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCharacters(selectedCategory);
  }, [selectedCategory]);

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

  const handleCreateCharacter = async (req: CreateCharacterRequest) => {
    await createCharacter(req);
    await loadCharacters(selectedCategory);
  };

  const filteredCharacters = characters.filter((c) => {
    const matchName = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTitle = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = c.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTags = c.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchName || matchTitle || matchCategory || matchTags;
  });

  return (
    <div className="h-full flex flex-col bg-[#18191c] text-zinc-100 overflow-hidden selection:bg-[#353740] selection:text-white">
      <Header onOpenCreate={() => setIsCreateModalOpen(true)} />

      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* Hero & Discovery Section */}
        <section className="relative border-b border-[#2c2e35] bg-gradient-to-b from-[#212228]/70 via-[#18191c] to-[#18191c] pt-12 pb-10 sm:pt-16 sm:pb-12">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 sm:text-4xl lg:text-5xl">
              Trò chuyện cùng Nhân vật AI
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base leading-relaxed font-normal">
              Không gian nhập vai tự do với các nhân vật đa dạng tính cách và cảm xúc.
            </p>

            {/* Search & Filter Dropdown Bar */}
            <div className="mx-auto mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-2xl">
              {/* Search Bar */}
              <div className="relative flex-1 w-full flex items-center">
                <Search className="absolute left-4 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm nhân vật, tính cách, thể loại..."
                  className="w-full rounded-2xl border border-[#31333a] bg-[#212227] py-3 pl-11 pr-10 text-sm text-zinc-100 placeholder-zinc-500 shadow-sm transition-all focus:border-[#525562] focus:bg-[#26272e] focus:outline-none focus:ring-1 focus:ring-[#525562]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 rounded-md p-1 text-zinc-400 hover:text-zinc-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filter Dropdown */}
              <div className="relative shrink-0 w-full sm:w-auto" ref={filterDropdownRef}>
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className={`flex-1 sm:flex-initial flex items-center justify-between gap-2.5 rounded-2xl border py-3 px-4 text-sm font-medium transition-all cursor-pointer shadow-sm active:scale-98 select-none ${
                      selectedCategory !== "Tất cả"
                        ? "border-[#4f5260] bg-[#2d2f38] text-zinc-100 font-semibold shadow-md"
                        : "border-[#31333a] bg-[#212227] text-zinc-300 hover:border-[#434650] hover:bg-[#27282f] hover:text-white"
                    }`}
                  >
                    <SlidersHorizontal className={`h-4 w-4 shrink-0 ${selectedCategory !== "Tất cả" ? "text-zinc-200" : "text-zinc-400"}`} />
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-zinc-400 font-normal">Lọc:</span>
                      <span className="font-semibold truncate max-w-[120px]">
                        {selectedCategory}
                      </span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 shrink-0 ${isCategoryDropdownOpen ? "rotate-180" : ""} ${selectedCategory !== "Tất cả" ? "text-zinc-200" : "text-zinc-400"}`} />
                  </button>

                  {/* Nút xóa bộ lọc nhanh khi đang chọn khác 'Tất cả' */}
                  {selectedCategory !== "Tất cả" && (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("Tất cả")}
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#31333a] bg-[#212227] text-zinc-400 hover:border-[#4f5260] hover:bg-[#2d2f38] hover:text-zinc-100 transition-all cursor-pointer shadow-sm shrink-0"
                      title="Xóa bộ lọc"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Dropdown Menu */}
                {isCategoryDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-[#31333a] bg-[#212227] p-1.5 shadow-2xl backdrop-blur-xl z-30 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-[#2c2e35] mb-1">
                      <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        Danh mục thể loại
                      </p>
                      {selectedCategory !== "Tất cả" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory("Tất cả");
                            setIsCategoryDropdownOpen(false);
                          }}
                          className="text-[11px] font-medium text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                        >
                          Đặt lại
                        </button>
                      )}
                    </div>

                    <div className="space-y-0.5 max-h-64 overflow-y-auto custom-scrollbar">
                      {CATEGORIES.map((cat) => {
                        const active = selectedCategory === cat.id;
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                              active
                                ? "bg-[#2f313a] text-zinc-100 font-bold border border-[#3f424c] shadow-sm"
                                : "text-zinc-400 hover:bg-[#282930] hover:text-zinc-100"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className={`h-4 w-4 ${cat.color}`} />
                              <span>{cat.label}</span>
                            </div>
                            {active && <Check className="h-3.5 w-3.5 text-zinc-100 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {selectedCategory !== "Tất cả" && (
                      <div className="border-t border-[#2c2e35] pt-1 mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory("Tất cả");
                            setIsCategoryDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-[#282930] hover:text-zinc-100 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Xóa bộ lọc</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-100 sm:text-xl">Khám phá Nhân vật</h2>
              <p className="text-xs text-zinc-400 mt-0.5 font-medium">
                {filteredCharacters.length} nhân vật khả dụng
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md hover:bg-white transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Tạo Nhân Vật</span>
            </button>
          </div>

          {/* Character Grid */}
          {isLoading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
              <p className="mt-3 text-xs text-zinc-400 font-medium">Đang tải danh sách nhân vật...</p>
            </div>
          ) : filteredCharacters.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#31333a] bg-[#212227]/40 p-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2b2c34] text-zinc-400 mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200">Không tìm thấy nhân vật nào</h3>
              <p className="mt-1 text-xs text-zinc-400 max-w-sm">
                {searchQuery
                  ? `Không có kết quả khớp với "${searchQuery}". Hãy thử tìm kiếm từ khóa khác.`
                  : "Chưa có nhân vật nào trong danh mục này. Hãy là người đầu tiên tạo nhé!"}
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 flex items-center gap-1.5 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-white transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Tạo Nhân Vật Ngay</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCharacters.map((char) => (
                <CharacterCard
                  key={char.id}
                  character={char}
                  onSelect={handleSelectCharacter}
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

      {/* Create Modal */}
      <CreateCharacterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCharacter}
      />
    </div>
  );
}
