"use client";

import { Character } from "@/types";
import { MessageSquare, User } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import Link from "next/link";

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
}

const CATEGORY_MAP: Record<string, string> = {
  Companion: "Bạn đồng hành",
  Anime: "Anime",
  Fantasy: "Kỳ ảo",
  RPG: "Nhập vai",
  Assistant: "Trợ lý",
  Mentor: "Cố vấn",
};

export function CharacterCard({ character, onSelect }: CharacterCardProps) {
  const categoryLabel = CATEGORY_MAP[character.category] || character.category;

  return (
    <div
      onClick={() => onSelect(character)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#31333a] bg-[#212227] p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#4a4d58] hover:bg-[#27282f] hover:shadow-xl hover:shadow-black/20 cursor-pointer"
    >
      <div>
        <div className="flex items-start gap-4">
          <Avatar
            src={character.avatarUrl}
            alt={character.name}
            size="lg"
            type="character"
            className="!rounded-2xl border border-[#3b3d46] shadow-sm"
          />

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-zinc-100 group-hover:text-white transition-colors">
              {character.name}
            </h3>
            <p className="truncate text-xs text-zinc-400 mt-0.5 font-medium">
              {character.title}
            </p>
          </div>
        </div>

        {character.greeting && (
          <div className="mt-4 rounded-xl bg-[#191a1e] p-3 border border-[#2c2e35]">
            <p className="line-clamp-3 text-xs italic text-zinc-300 leading-relaxed">
              "{character.greeting}"
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#2c2e35] flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden max-h-6">
          <span className="rounded-full bg-[#2b2c34] px-2.5 py-0.5 text-[11px] text-zinc-300 font-semibold border border-[#3b3d46]">
            {categoryLabel}
          </span>
          {character.creatorName && (
            <span className="text-[11px] text-zinc-400/90 truncate max-w-[110px] hidden xs:inline font-medium">
              @{character.creatorName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/character/${character.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 rounded-xl border border-[#3b3d46] bg-[#2b2c34] px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-[#363842] hover:text-white transition-colors"
            title="Xem chi tiết hồ sơ"
          >
            <User className="h-3 w-3" />
            <span className="hidden xs:inline">Hồ sơ</span>
          </Link>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(character);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-[#2b2c34] border border-[#3b3d46] px-3.5 py-1.5 text-xs font-semibold text-zinc-200 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-950 hover:border-zinc-100 group-hover:bg-zinc-100 group-hover:text-zinc-950 group-hover:border-zinc-100 shadow-sm active:scale-95 cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
