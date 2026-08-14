"use client";

import { Character } from "@/types";
import { MessageSquare } from "lucide-react";

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
}

export function CharacterCard({ character, onSelect }: CharacterCardProps) {
  return (
    <div
      onClick={() => onSelect(character)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:bg-zinc-900/90 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer"
    >
      <div>
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-800 shadow-md">
            <img
              src={character.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${character.name}`}
              alt={character.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-bold text-zinc-100 group-hover:text-purple-300 transition-colors">
                {character.name}
              </h3>
              <span className="shrink-0 rounded-md bg-purple-500/10 px-2 py-0.5 text-[11px] font-medium text-purple-300 border border-purple-500/20">
                {character.category}
              </span>
            </div>
            <p className="truncate text-xs text-zinc-400 mt-0.5">
              {character.title}
            </p>
          </div>
        </div>

        {character.greeting && (
          <div className="mt-4 rounded-xl bg-zinc-950/60 p-3 border border-zinc-800/60">
            <p className="line-clamp-3 text-xs italic text-zinc-300 leading-relaxed">
              "{character.greeting}"
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-6">
          {character.tags?.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-400"
            >
              #{tag}
            </span>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(character);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-purple-300 transition-all hover:bg-purple-600 hover:text-white group-hover:bg-purple-600 group-hover:text-white"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Chat</span>
        </button>
      </div>
    </div>
  );
}
