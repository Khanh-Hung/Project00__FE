"use client";

import { Character } from "@/types";
import { MessageSquare, User } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { getWorldGenreMeta } from "@/lib/constants";
import { resolveMediaUrl } from "@/lib/api";
import Link from "next/link";

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
  dense?: boolean;
}

export function CharacterCard({ character, onSelect, dense = false }: CharacterCardProps) {
  const genreMeta = getWorldGenreMeta(character.worldGenre);
  const rawBgImage =
    character.visualIdentity?.fullBodyUrl ||
    character.visualIdentity?.canonicalReferenceUrl ||
    character.avatarUrl;
  const bgImage = resolveMediaUrl(rawBgImage);

  return (
    <div
      onClick={() => onSelect(character)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#31333a] bg-[#191a1e] aspect-[2/3] p-3.5 sm:p-4 backdrop-blur-sm transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-black/80 cursor-pointer select-none"
    >
      {/* Full-Body Background Artwork */}
      {bgImage && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={bgImage}
            alt={character.name}
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Gentle vignette - letting character art shine through with clear translucency */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 via-45% to-transparent" />
        </div>
      )}

      {/* Top Section: Minimalist Floating Genre Tag */}
      <div className="relative z-10 flex items-center justify-between">
        <span
          title={genreMeta.desc ? `${genreMeta.label}: ${genreMeta.desc}` : genreMeta.label}
          className="rounded-full bg-black/40 backdrop-blur-md px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-zinc-200 border border-white/10 flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
        >
          <span>{genreMeta.emoji}</span>
          <span className="truncate max-w-[120px]">{genreMeta.label}</span>
        </span>
      </div>

      {/* Bottom Dock: Avatar + Name + Title + Personality + Footer Actions */}
      <div className="relative z-10 space-y-2.5">
        {/* Identity Row (Avatar + Name + Title) */}
        <div className="flex items-center gap-2.5">
          <Avatar
            src={character.avatarUrl}
            alt={character.name}
            size="sm"
            type="character"
            className="!rounded-full !size-9 !h-9 !w-9 border-2 border-white/30 shadow-lg shrink-0"
          />

          <div className="min-w-0 flex-1">
            <h3
              title={character.name}
              className="truncate text-base font-bold text-white group-hover:text-amber-300 transition-colors drop-shadow-md cursor-pointer"
            >
              {character.name}
            </h3>
            <p
              title={character.title}
              className="truncate text-xs text-zinc-300 font-medium drop-shadow-sm cursor-pointer"
            >
              {character.title}
            </p>
          </div>
        </div>

        {/* Personality Prompt with Ultra-Frosted Crystal Glass */}
        {character.personalityPrompt && (
          <div
            title={character.personalityPrompt}
            className={`rounded-2xl bg-black/20 backdrop-blur-xl ${
              dense ? "py-1.5 px-2.5" : "p-2.5"
            } border border-white/15 shadow-lg shadow-black/10 cursor-pointer`}
          >
            <p
              className={`${
                dense ? "line-clamp-1" : "line-clamp-2"
              } text-[11px] text-zinc-100 leading-relaxed font-medium drop-shadow-sm cursor-pointer`}
            >
              {character.personalityPrompt}
            </p>
          </div>
        )}

        {/* Card Footer: Creator & Actions */}
        <div className="pt-2 border-t border-white/10">
          {dense ? (
            /* 6-Column Dense Mode: Balanced 50/50 dual action buttons across full width */
            <div className="grid grid-cols-2 gap-1.5 w-full">
              <Link
                href={`/character/${character.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-1 py-1.5 rounded-xl border border-white/15 bg-black/40 backdrop-blur-md text-[11px] font-medium text-zinc-200 hover:bg-white/15 hover:text-white transition-colors"
                title="Xem chi tiết hồ sơ"
              >
                <User className="h-3 w-3" />
                <span>Hồ sơ</span>
              </Link>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(character);
                }}
                className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-zinc-100 text-[11px] font-bold text-zinc-950 hover:bg-white hover:shadow-md hover:shadow-white/20 transition-all active:scale-95 cursor-pointer"
              >
                <MessageSquare className="h-3 w-3 fill-zinc-950" />
                <span>Chat</span>
              </button>
            </div>
          ) : (
            /* 4-Column Mode: Creator tag on left, aligned buttons on right */
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                {(character.creatorName || character.creatorUserName) && (
                  <span
                    title={`Tạo bởi: ${character.creatorName || ""} (@${character.creatorUserName || character.creatorName})`}
                    className="text-[10px] text-zinc-400 truncate font-medium flex items-center gap-1"
                  >
                    <span className="text-zinc-500 text-[10px]">bởi</span>
                    <span className="text-zinc-300 font-semibold truncate text-[10px]">
                      {character.creatorName || `@${character.creatorUserName}`}
                    </span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  href={`/character/${character.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 rounded-xl border border-white/15 bg-black/40 backdrop-blur-md px-2.5 py-1.5 text-[11px] font-medium text-zinc-200 hover:bg-white/15 hover:text-white transition-colors"
                  title="Xem chi tiết hồ sơ"
                >
                  <User className="h-3 w-3" />
                  <span>Hồ sơ</span>
                </Link>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(character);
                  }}
                  className="flex items-center gap-1 rounded-xl bg-zinc-100 px-3.5 py-1.5 text-[11px] font-bold text-zinc-950 hover:bg-white hover:shadow-md hover:shadow-white/20 transition-all active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="h-3 w-3 fill-zinc-950" />
                  <span>Chat</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CharacterCardSkeleton({ dense = false }: { dense?: boolean }) {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#31333a] bg-[#191a1e] aspect-[2/3] p-3.5 sm:p-4 select-none">
      {/* Top minimal tag skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24 rounded-full !bg-white/[0.06]" />
      </div>

      {/* Bottom dock skeleton */}
      <div className="space-y-2.5">
        {/* Identity skeleton: avatar circle + name + title */}
        <div className="flex items-center gap-2.5">
          <Skeleton className="!h-9 !w-9 rounded-full !bg-white/10 shrink-0" />
          <div className="flex-1 space-y-1.5 min-w-0">
            <Skeleton className="h-4 w-3/4 rounded-md !bg-white/10" />
            <Skeleton className="h-3 w-1/2 rounded-md !bg-white/[0.06]" />
          </div>
        </div>

        {/* Personality quote box skeleton */}
        <div className={`rounded-2xl bg-black/20 ${dense ? "py-1.5 px-2.5" : "p-2.5"} border border-white/5 space-y-1.5`}>
          <Skeleton className="h-3 w-full rounded-md !bg-white/[0.06]" />
          {!dense && <Skeleton className="h-3 w-4/5 rounded-md !bg-white/[0.06]" />}
        </div>

        {/* Footer actions skeleton */}
        <div className="pt-2 border-t border-white/10">
          {dense ? (
            <div className="grid grid-cols-2 gap-1.5 w-full">
              <Skeleton className="h-7 w-full rounded-xl !bg-white/[0.06]" />
              <Skeleton className="h-7 w-full rounded-xl !bg-white/10" />
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-3 w-16 rounded-md !bg-white/[0.06]" />
              <div className="flex items-center gap-1.5 shrink-0">
                <Skeleton className="h-7 w-16 rounded-xl !bg-white/[0.06]" />
                <Skeleton className="h-7 w-16 rounded-xl !bg-white/10" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
