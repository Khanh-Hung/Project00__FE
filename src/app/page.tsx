"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { CharacterCard } from "@/components/characters/CharacterCard";
import { CreateCharacterModal } from "@/components/characters/CreateCharacterModal";
import { Character, CreateCharacterRequest } from "@/types";
import { fetchCharacters, createCharacter, createChatSession } from "@/lib/api";
import { Sparkles, Search, Plus, Loader2 } from "lucide-react";

const CATEGORIES = ["Tất cả", "Companion", "Anime", "Fantasy", "RPG", "Assistant", "Mentor"];

export default function HomePage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);

  const loadCharacters = async (cat?: string) => {
    try {
      setIsLoading(true);
      const categoryParam = cat && cat !== "Tất cả" ? cat : undefined;
      const data = await fetchCharacters(categoryParam);
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
      const session = await createChatSession(char.id, `Trò chuyện cùng ${char.name}`);
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-purple-500/30 selection:text-purple-200">
      <Header onOpenCreate={() => setIsCreateModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-800/60 bg-gradient-to-b from-purple-950/20 via-zinc-950 to-zinc-950 py-16 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-xs font-semibold text-purple-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Roleplay Platform v1.0</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-zinc-100">
            Khám phá Thế giới <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Nhân Vật AI Độc Đáo
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
            Trò chuyện, nhập vai và kết nối cùng các nhân vật AI sống động với tính cách phong phú được hỗ trợ bởi Google Gemini AI.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm nhân vật theo tên, bối cảnh, thể loại..."
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 py-3.5 pl-12 pr-4 text-sm text-zinc-100 placeholder-zinc-500 shadow-xl backdrop-blur-md transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                    active
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-semibold"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-100">Danh sách Nhân vật</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Chọn một nhân vật để bắt đầu cuộc phiêu lưu nhập vai</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Tạo Nhân Vật Mới</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            <p className="text-sm text-zinc-400">Đang tải danh sách nhân vật...</p>
          </div>
        ) : filteredCharacters.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 p-8 text-center bg-zinc-900/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-zinc-200">Chưa có nhân vật nào phù hợp</h3>
            <p className="mt-1 max-w-md text-xs text-zinc-400">
              Hãy thử tìm kiếm với từ khóa khác hoặc tự tạo một nhân vật AI độc đáo của riêng bạn!
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-5 flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-600/30 hover:bg-purple-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Tạo Nhân Vật Ngay</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <p>Project AI Roleplay Platform • Built with .NET 10 Web API & Next.js 15</p>
      </footer>

      {/* Starting Chat Loading Overlay */}
      {isStartingChat && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
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
