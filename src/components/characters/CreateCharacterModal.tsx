"use client";

import { useState } from "react";
import { CreateCharacterRequest } from "@/types";
import { X, Sparkles, Wand2 } from "lucide-react";

interface CreateCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (req: CreateCharacterRequest) => Promise<void>;
}

const CATEGORIES = ["Companion", "Anime", "Fantasy", "RPG", "Assistant", "Mentor"];

export function CreateCharacterModal({ isOpen, onClose, onSubmit }: CreateCharacterModalProps) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Companion");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [personalityPrompt, setPersonalityPrompt] = useState("");
  const [greeting, setGreeting] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !title || !personalityPrompt || !greeting || !category) {
      setError("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const generatedAvatar = avatarUrl.trim() || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        name,
        title,
        category,
        avatarUrl: generatedAvatar,
        personalityPrompt,
        greeting,
        tags,
        isPublic: true,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Không thể tạo nhân vật. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-purple-950/40 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Tạo Nhân Vật AI Mới</h2>
              <p className="text-xs text-zinc-400">Thiết lập tính cách, danh hiệu và câu chào nhập vai</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300">Tên Nhân Vật *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Lina, Shadow Knight, Elena..."
                className="mt-1 w-full rounded-xl border border-zinc-700/80 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300">Danh hiệu (Title) *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: AI Companion Dịu Dàng, Phù Thủy Cổ Đại..."
                className="mt-1 w-full rounded-xl border border-zinc-700/80 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300">Thể loại (Category) *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-700/80 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300">Avatar URL (Tùy chọn)</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Để trống để tự tạo avatar theo tên"
                className="mt-1 w-full rounded-xl border border-zinc-700/80 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300">Câu chào mở đầu (Greeting) *</label>
            <input
              type="text"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              placeholder="VD: *mỉm cười dịu dàng* Chào bạn! Hôm nay bạn thế nào?"
              className="mt-1 w-full rounded-xl border border-zinc-700/80 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300">Prompt Tính Cách & Bối Cảnh (Personality Prompt) *</label>
            <textarea
              rows={4}
              value={personalityPrompt}
              onChange={(e) => setPersonalityPrompt(e.target.value)}
              placeholder="Mô tả chi tiết tính cách, cách xưng hô, biểu cảm khi nói chuyện của nhân vật..."
              className="mt-1 w-full rounded-xl border border-zinc-700/80 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300">Tags (Cách nhau bằng dấu phẩy)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="gentle, caring, anime, magic..."
              className="mt-1 w-full rounded-xl border border-zinc-700/80 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-all active:scale-95"
            >
              <Wand2 className="h-4 w-4" />
              <span>{isSubmitting ? "Đang tạo..." : "Tạo Nhân Vật"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
