"use client";

import { ReactNode } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-[380px] rounded-3xl border border-[#31333a] bg-[#1d1e22] p-6 text-center shadow-2xl shadow-black/80 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-zinc-500 hover:bg-[#282930] hover:text-zinc-300 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Centered Icon Badge */}
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner ${
            isDanger
              ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
              : "bg-amber-500/10 border-amber-500/20 text-amber-400"
          }`}
        >
          {isDanger ? <Trash2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
        </div>

        {/* Content */}
        <h3 className="text-base font-bold text-zinc-100">{title}</h3>
        <div className="mt-2 text-xs text-zinc-400 leading-relaxed font-normal px-2">
          {description}
        </div>

        {/* Balanced 2-Column Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-2xl border border-[#31333a] bg-[#26272e] py-2.5 text-xs font-semibold text-zinc-300 hover:bg-[#2f3139] hover:text-white transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 ${
              isDanger
                ? "bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-950/40"
                : "bg-zinc-100 text-zinc-950 hover:bg-white shadow-md shadow-white/5"
            }`}
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
