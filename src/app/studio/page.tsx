"use client";

import { useEffect, useState, useRef } from "react";
import { Character, CreateCharacterRequest, UpdateCharacterRequest } from "@/types";
import { fetchCharacters, createCharacter, updateCharacter, deleteCharacter } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Avatar } from "@/components/ui/Avatar";
import { CreateCharacterModal } from "@/components/characters/CreateCharacterModal";
import { ImageCropperModal } from "@/components/ui/ImageCropperModal";
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
  Check,
  Upload,
  Image as ImageIcon,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Edit form states
  const [editName, setEditName] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [rawEditAvatarImage, setRawEditAvatarImage] = useState<string | null>(null);
  const [isEditCropperOpen, setIsEditCropperOpen] = useState(false);
  const [editCategory, setEditCategory] = useState("Companion");
  const [editPersonality, setEditPersonality] = useState("");
  const [editGreeting, setEditGreeting] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(true);

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

  const handleOpenEdit = (char: Character) => {
    setEditingCharacter(char);
    setEditName(char.name);
    setEditTitle(char.title);
    setEditAvatarUrl(char.avatarUrl);
    setRawEditAvatarImage(char.avatarUrl || null);
    setEditCategory(char.category || "Companion");
    setEditPersonality(char.personalityPrompt);
    setEditGreeting(char.greeting);
    setEditTags(char.tags?.join(", ") || "");
    setEditIsPublic(char.isPublic);
  };

  const handleEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP, GIF)!");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Dung lượng ảnh tối đa là 10MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setRawEditAvatarImage(src);
      setIsEditCropperOpen(true);
      if (editFileInputRef.current) editFileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleEditCropSave = (croppedDataUrl: string) => {
    setEditAvatarUrl(croppedDataUrl);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCharacter || !editName.trim()) return;

    try {
      setIsSubmitting(true);
      const updatedReq: UpdateCharacterRequest = {
        name: editName.trim(),
        title: editTitle.trim(),
        avatarUrl: editAvatarUrl.trim(),
        category: editCategory,
        personalityPrompt: editPersonality.trim(),
        greeting: editGreeting.trim(),
        tags: editTags.split(",").map((t) => t.trim()).filter(Boolean),
        isPublic: editIsPublic,
      };

      const updated = await updateCharacter(editingCharacter.id, updatedReq);
      setCharacters((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setEditingCharacter(null);
    } catch (err: any) {
      console.error("Failed to update character", err);
      alert(err.message || "Không thể cập nhật nhân vật. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
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
                  Creator Studio
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
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Công Khai (Public)</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                {characters.filter((c) => c.isPublic).length}
              </p>
            </div>
            <div className="rounded-2xl border border-[#31333a] bg-[#212227] p-5 backdrop-blur-sm shadow-sm">
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Riêng Tư (Private)</p>
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
                        onClick={() => handleOpenEdit(char)}
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

      {/* Edit Modal */}
      {editingCharacter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#31333a] bg-[#212227] p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2c2e35] pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2b2c34] border border-[#3b3d46]">
                  <Edit2 className="h-4 w-4 text-zinc-200" />
                </div>
                <h2 className="text-lg font-bold text-zinc-100">
                  Chỉnh sửa nhân vật: <span className="text-white">{editingCharacter.name}</span>
                </h2>
              </div>
              <button
                onClick={() => setEditingCharacter(null)}
                className="rounded-xl p-1.5 text-zinc-400 hover:bg-[#282930] hover:text-zinc-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Tên nhân vật *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] px-4 py-2.5 text-sm text-zinc-100 focus:border-[#525562] focus:bg-[#1e2025] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Danh xưng / Vai trò *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] px-4 py-2.5 text-sm text-zinc-100 focus:border-[#525562] focus:bg-[#1e2025] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Thể loại */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Thể loại</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] px-4 py-2.5 text-sm text-zinc-100 focus:border-[#525562] focus:bg-[#1e2025] focus:outline-none transition-colors"
                >
                  {[
                    { id: "Companion", label: "Bạn đồng hành" },
                    { id: "Anime", label: "Anime" },
                    { id: "Fantasy", label: "Kỳ ảo" },
                    { id: "RPG", label: "Nhập vai" },
                    { id: "Assistant", label: "Trợ lý" },
                    { id: "Mentor", label: "Cố vấn" },
                  ].map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#212227] text-zinc-100 py-2">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 3: Centered Avatar Upload / Update Box */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Ảnh đại diện nhân vật (Tùy chọn)
                </label>
                <input
                  type="file"
                  ref={editFileInputRef}
                  accept="image/*"
                  onChange={handleEditFileUpload}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#31333a] bg-[#191a1e]/90 p-6 sm:p-7 text-center transition-all">
                  {editAvatarUrl ? (
                    <>
                      <div className="relative group">
                        <img
                          src={editAvatarUrl}
                          alt="Avatar Preview"
                          className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-[#3b3d46] shadow-2xl ring-4 ring-black/30"
                        />
                      </div>

                      <p className="mt-3.5 max-w-sm text-xs sm:text-sm font-normal text-zinc-300 leading-relaxed">
                        Bạn đã thiết lập ảnh đại diện. Chọn ảnh mới hoặc chỉnh sửa ảnh hiện tại.
                      </p>

                      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => editFileInputRef.current?.click()}
                          className="rounded-2xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
                        >
                          Chọn ảnh từ máy tính
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (rawEditAvatarImage || editAvatarUrl) {
                              setIsEditCropperOpen(true);
                            }
                          }}
                          className="rounded-2xl border border-[#3b3d46] bg-[#2b2c34] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-[#353740] hover:text-white active:scale-95 transition-all cursor-pointer"
                        >
                          Chỉnh sửa ảnh hiện tại
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditAvatarUrl("");
                            setRawEditAvatarImage(null);
                          }}
                          className="rounded-2xl border border-transparent px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all cursor-pointer"
                        >
                          Xóa ảnh
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => editFileInputRef.current?.click()}
                        className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2 border-dashed border-[#3b3d46] bg-[#212227] text-zinc-400 hover:border-zinc-400 hover:text-zinc-200 cursor-pointer shadow-inner transition-all group"
                      >
                        <Upload className="h-6 w-6 group-hover:scale-110 transition-transform" />
                      </div>

                      <p className="mt-3 max-w-sm text-xs sm:text-sm font-normal text-zinc-400 leading-relaxed">
                        Chưa có ảnh đại diện. Tải ảnh từ máy tính để nhân vật của bạn trông nổi bật và sống động hơn.
                      </p>

                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => editFileInputRef.current?.click()}
                          className="rounded-2xl bg-zinc-100 px-5 py-2 text-xs font-bold text-zinc-950 shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
                        >
                          Chọn ảnh từ máy tính
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Tính cách & Bối cảnh nhân vật *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editPersonality}
                  onChange={(e) => setEditPersonality(e.target.value)}
                  placeholder="VD: Bạn là một cô gái dịu dàng, ấm áp. Luôn xưng 'mình' gọi 'bạn', biết lắng nghe chân thành..."
                  className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#525562] focus:bg-[#1e2025] focus:outline-none transition-colors leading-relaxed resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Lời chào mở đầu *</label>
                <textarea
                  rows={3}
                  required
                  value={editGreeting}
                  onChange={(e) => setEditGreeting(e.target.value)}
                  placeholder="VD: *mỉm cười dịu dàng bước tới gần bạn* Chào bạn! Hôm nay của bạn thế nào?..."
                  className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#525562] focus:bg-[#1e2025] focus:outline-none transition-colors leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#2c2e35]">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-300">
                  <input
                    type="checkbox"
                    checked={editIsPublic}
                    onChange={(e) => setEditIsPublic(e.target.checked)}
                    className="rounded border-[#31333a] bg-[#191a1e] text-zinc-100 focus:ring-zinc-500"
                  />
                  <span>Công khai cho mọi người cùng trò chuyện</span>
                </label>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingCharacter(null)}
                    className="rounded-xl border border-[#3b3d46] bg-[#2b2c34] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-[#353740] hover:text-white transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 rounded-xl bg-zinc-100 px-5 py-2 text-xs font-bold text-zinc-950 hover:bg-white disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    <span>Lưu Thay Đổi</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isEditCropperOpen}
        onClose={() => setIsEditCropperOpen(false)}
        imageSrc={rawEditAvatarImage || editAvatarUrl || null}
        onSave={handleEditCropSave}
        outputSize={512}
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
