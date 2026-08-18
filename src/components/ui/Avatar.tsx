"use client";

import { useState } from "react";
import { User, Bot } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  type?: "user" | "character";
  className?: string;
}

function FacebookUserSilhouette() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Nền tròn xám sáng chuẩn Facebook */}
      <circle cx="50" cy="50" r="50" fill="#e4e6eb" />
      {/* Đầu người */}
      <circle cx="50" cy="38" r="16" fill="#65676b" />
      {/* Vai và thân người */}
      <path
        d="M50 58c-18.8 0-34 11.2-35.8 25.5A49.7 49.7 0 0 0 50 100a49.7 49.7 0 0 0 35.8-16.5C84 69.2 68.8 58 50 58z"
        fill="#65676b"
      />
    </svg>
  );
}

export function Avatar({
  src,
  alt,
  size = "md",
  type = "character",
  className = "",
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-base",
    xl: "h-28 w-28 sm:h-36 sm:w-36 text-2xl",
  };

  const showImage = Boolean(src && src.trim().length > 0 && !imgError);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-800 flex items-center justify-center font-bold text-zinc-300 select-none shadow-sm ${sizeClasses[size]} ${className}`}
    >
      {showImage ? (
        <img
          src={src!}
          alt={alt}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-300 antialiased"
          style={{ imageRendering: "auto" }}
        />
      ) : type === "user" ? (
        <FacebookUserSilhouette />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-zinc-400">
          <Bot className="h-1/2 w-1/2" />
        </div>
      )}
    </div>
  );
}

