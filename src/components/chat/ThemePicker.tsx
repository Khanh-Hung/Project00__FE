"use client";

import React, { useRef, useEffect } from "react";
import { Check, Palette } from "lucide-react";
import { ChatTheme, THEMES } from "./chat.constants";

interface ThemePickerProps {
  currentTheme: ChatTheme;
  onSelectTheme: (theme: ChatTheme) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const ThemePicker: React.FC<ThemePickerProps> = ({
  currentTheme,
  onSelectTheme,
  isOpen,
  onToggle,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 rounded-xl border border-[#3b3d46] bg-[#2b2c34] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-[#353740] hover:text-white transition-colors cursor-pointer"
        title="Đổi tông màu phòng chat"
      >
        <Palette className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Màu sắc</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 overflow-hidden rounded-3xl border border-[#31333a] bg-[#212227]/98 p-2.5 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-[#2c2e35] mb-2">
            <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
              Chọn Tông Màu
            </span>
            <span className="text-[10px] text-zinc-500">Tự lưu cấu hình</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 max-h-72 overflow-y-auto custom-scrollbar pr-0.5">
            {Object.values(THEMES).map((t) => {
              const active = currentTheme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    onSelectTheme(t.id);
                    onClose();
                  }}
                  className={`flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-[#2d303b] text-white font-semibold ring-1 ring-zinc-500/40 shadow-sm"
                      : "text-zinc-300 hover:bg-[#282930] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${t.dotColor} shadow-sm shrink-0`}
                    />
                    <span className="truncate">{t.name}</span>
                  </div>
                  {active && <Check className="h-3.5 w-3.5 text-zinc-200 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
