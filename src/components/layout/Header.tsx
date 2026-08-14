"use client";

import Link from "next/link";
import { Sparkles, Plus, Compass } from "lucide-react";

interface HeaderProps {
  onOpenCreate?: () => void;
}

export function Header({ onOpenCreate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-md shadow-purple-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-zinc-100">Project<span className="text-purple-400">AI</span></span>
            <span className="ml-2 rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-400 border border-purple-500/20">
              Roleplay Studio
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          >
            <Compass className="h-4 w-4" />
            <span>Khám phá</span>
          </Link>

          {onOpenCreate && (
            <button
              onClick={onOpenCreate}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-md shadow-purple-600/25 transition-all hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-600/40 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Tạo Nhân vật</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
