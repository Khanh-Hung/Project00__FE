"use client";

import { useEffect, useState } from "react";
import { Character, UpdateCharacterRequest } from "@/types";
import { fetchCharacters, createCharacter, updateCharacter, deleteCharacter } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Avatar } from "@/components/ui/Avatar";
import { CreateCharacterModal } from "@/components/characters/CreateCharacterModal";
import { EditCharacterModal } from "@/components/characters/EditCharacterModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  Palette,
  Plus,
  Edit2,
  Trash2,
  Globe,
  Lock,
  Search,
  Loader2,
  Sparkles,
  X,
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

export default function StudioPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCharacters = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCharacters();
      setCharacters(data);
    } catch (err) {
      console.error("Failed to load studio characters", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  const handleUpdateCharacter = async (characterId: string, req: UpdateCharacterRequest) => {
    const updated = await updateCharacter(characterId, req);
    setCharacters((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditingCharacter(null);
  };

  const handleConfirmDelete = async () => {
    if (!characterToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCharacter(characterToDelete.id);
      setCharacters((prev) => prev.filter((c) => c.id !== characterToDelete.id));
      setCharacterToDelete(null);
    } catch (err) {
      console.error("Failed to delete character", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublic = async (char: Character) => {
    try {
      const updated = await updateCharacter(char.id, {
        name: char.name,
        title: char.title,
        avatarUrl: char.avatarUrl,
        category: char.category,
        personalityPrompt: char.personalityPrompt,
        greeting: char.greeting,
        tags: char.tags,
        isPublic: !char.isPublic,
      });
      setCharacters((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch (err) {
      console.error("Failed to toggle public status", err);
    }
  };

  const filteredCharacters = characters.filter((c) => {
    const matchName = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchName || matchCategory;
  });

  return (
    <div className="h-full flex flex-col bg-[#18191c] text-zinc-100 overflow-hidden selection:bg-[#353740] selection:text-white">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c2e35] pb-6 mb-8">
            <div>
              <div className="flex items-center gap-2.5">
                <Palette className="h-6 w-6 text-pink-400" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
                  Studio Sáng Tạo
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Quản lý, chỉnh sửa và tạo mới các nhân vật AI nhập vai của bạn
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex items-center w-full sm:w-64">
                <Search className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm nhân vật..."
                  className="w-full rounded-2xl border border-[#31333a] bg-[#212227] py-2 pl-10 pr-8 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#525562] focus:bg-[#26272e] focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 rounded-md p-0.5 text-zinc-400 hover:text-zinc-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md shadow-white/5 hover:bg-white active:scale-95 transition-all whitespace-nowrap cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Tạo Mới</span>
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-[#31333a] bg-[#212227] p-5 backdrop-blur-sm shadow-sm">
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Tổng Nhân Vật</p>
              <p className="text-2xl font-bold text-zinc-100 mt-1">{characters.length}</p>
            </div>
            <div className="rounded-2xl border border-[#31333a] bg-[#212227] p-5 backdrop-blur-sm shadow-sm">
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Công Khai</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                {characters.filter((c) => c.isPublic).length}
              </p>
            </div>
            <div className="rounded-2xl border border-[#31333a] bg-[#212227] p-5 backdrop-blur-sm shadow-sm">
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Riêng Tư</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">
                {characters.filter((c) => !c.isPublic).length}
              </p>
            </div>
          </div>

          {/* Characters Table/List */}
          {isLoading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
              <p className="mt-3 text-xs text-zinc-400">Đang tải Studio...</p>
            </div>
          ) : filteredCharacters.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#31333a] bg-[#212227]/40 p-10 text-center">
              <Sparkles className="h-10 w-10 text-zinc-500 mb-3" />
              <h3 className="text-sm font-semibold text-zinc-200">Chưa có nhân vật nào</h3>
              <p className="mt-1 text-xs text-zinc-400">Hãy nhấn nút "Tạo Mới" để sáng tạo nhân vật AI đầu tiên của bạn!</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 flex items-center gap-1.5 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-white transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Tạo Nhân Vật Ngay</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCharacters.map((char) => (
                <div
                  key={char.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[#31333a] bg-[#212227] p-5 backdrop-blur-sm hover:border-[#4a4d58] hover:bg-[#27282f] transition-all shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <Avatar
                          src={char.avatarUrl}
                          alt={char.name}
                          size="md"
                          type="character"
                          className="!rounded-2xl border border-[#3b3d46]"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-zinc-100 truncate">{char.name}</h3>
                            <span className="rounded-md bg-[#2b2c34] px-2 py-0.5 text-[10px] font-medium text-zinc-300 border border-[#3b3d46]">
                              {CATEGORY_MAP[char.category] || char.category}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 truncate mt-0.5">{char.title}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleTogglePublic(char)}
                        title={char.isPublic ? "Đang công khai (Bấm để đổi)" : "Đang riêng tư (Bấm để đổi)"}
                        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                          char.isPublic
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                        }`}
                      >
                        {char.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                        <span>{char.isPublic ? "Công khai" : "Riêng tư"}</span>
                      </button>
                    </div>

                    {char.greeting && (
                      <div className="mt-4 rounded-xl bg-[#191a1e] p-3 border border-[#2c2e35] text-xs text-zinc-400 italic line-clamp-2">
                        "{char.greeting}"
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#2c2e35] flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500">
                      Tạo: {new Date(char.createdAt).toLocaleDateString("vi-VN")}
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/character/${char.id}`}
                        className="rounded-xl bg-[#2b2c34] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-[#353740] hover:text-white transition-colors border border-[#3b3d46]"
                      >
                        Xem hồ sơ
                      </Link>

                      <button
                        onClick={() => setEditingCharacter(char)}
                        className="flex items-center gap-1 rounded-xl border border-[#3b3d46] bg-[#2b2c34] px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-[#353740] hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Sửa</span>
                      </button>

                      <button
                        onClick={() => setCharacterToDelete(char)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#31333a] bg-[#212227] text-zinc-400 hover:border-rose-500/40 hover:bg-rose-950/30 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Xóa nhân vật"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create Modal */}
      <CreateCharacterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (req) => {
          await createCharacter(req);
          await loadCharacters();
        }}
      />

      {/* Modern Edit Character Modal */}
      <EditCharacterModal
        character={editingCharacter}
        isOpen={Boolean(editingCharacter)}
        onClose={() => setEditingCharacter(null)}
        onSubmit={handleUpdateCharacter}
      />

      {/* Delete Character Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(characterToDelete)}
        onClose={() => setCharacterToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa nhân vật?"
        description={
          <span>
            Xóa nhân vật <strong className="text-zinc-200">{characterToDelete?.name}</strong> và toàn bộ lịch sử trò chuyện?
          </span>
        }
        confirmText="Xác nhận xóa"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
