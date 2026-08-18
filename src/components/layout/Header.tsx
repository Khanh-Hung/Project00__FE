"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/core/providers/AuthProvider";
import { Avatar } from "@/components/ui/Avatar";
import {
  Plus,
  Compass,
  Flame,
  History,
  Palette,
  BookOpen,
  LogIn,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface HeaderProps {
  onOpenCreate?: () => void;
}

export function Header({ onOpenCreate }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    {
      label: "Khám phá",
      href: "/",
      icon: <Compass className="h-3.5 w-3.5" />,
    },
    {
      label: "Thịnh hành",
      href: "/trending",
      icon: <Flame className="h-3.5 w-3.5" />,
    },
    {
      label: "Lịch sử",
      href: "/history",
      icon: <History className="h-3.5 w-3.5" />,
    },
    {
      label: "Studio",
      href: "/studio",
      icon: <Palette className="h-3.5 w-3.5" />,
    },
    {
      label: "Cẩm nang",
      href: "/guide",
      icon: <BookOpen className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-40 w-full shrink-0 transition-all duration-300 border-b ${
        scrolled
          ? "border-[#2c2e35] bg-[#1a1b1f]/95 shadow-xl shadow-black/30 backdrop-blur-xl"
          : "border-[#26282e] bg-[#18191c]/85 backdrop-blur-md"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          {/* Left Zone: Brand Mark */}
          <div className="flex-1 flex items-center justify-start">
            <Link href="/" className="flex items-center group cursor-pointer select-none">
              <span className="font-sans text-xl font-black tracking-tighter text-zinc-100 transition-all duration-300 group-hover:text-white">
                Nyxoris
              </span>
            </Link>
          </div>

          {/* Center Zone: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 text-xs font-semibold transition-colors py-2 px-1 ${
                    active
                      ? "text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <span className="transition-transform group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Zone: Actions & Auth */}
          <div className="flex-1 flex items-center justify-end gap-3">
            {onOpenCreate ? (
              <button
                onClick={onOpenCreate}
                className="hidden sm:flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3.5 py-1.5 text-xs font-bold text-zinc-950 shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tạo Nhân vật</span>
              </button>
            ) : (
              <Link
                href="/studio"
                className="hidden sm:flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3.5 py-1.5 text-xs font-bold text-zinc-950 shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tạo Nhân vật</span>
              </Link>
            )}

            {/* Auth Dropdown / Buttons */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="relative flex items-center justify-center rounded-full p-0.5 border border-[#3b3d46] bg-[#23242a] hover:border-[#525560] transition-all cursor-pointer shadow-sm active:scale-95 shrink-0 select-none"
                  title={user.userName}
                >
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.userName}
                    size="sm"
                    type="user"
                    className="!rounded-full !size-8 !h-8 !w-8 border-none text-xs font-bold shrink-0"
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-[#31333a] bg-[#212227] p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center justify-between gap-3 border-b border-[#2c2e35] p-2.5 mb-1 rounded-xl hover:bg-[#2b2c33] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar
                          src={user.avatarUrl}
                          alt={user.userName}
                          size="md"
                          type="user"
                          className="!rounded-full !h-10 !w-10 border border-[#3b3d46] text-xs font-bold shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors truncate">
                            {user.userName}
                          </p>
                          <span className="inline-block mt-1 rounded-md bg-[#2b2c33] px-1.5 py-0.5 text-[9px] font-semibold text-zinc-300 border border-[#3b3d46]">
                            Gói: Miễn phí
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-200 transition-colors shrink-0" />
                    </Link>

                    <div className="py-1 space-y-0.5">
                      <Link
                        href="/studio"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-[#2b2c33] hover:text-zinc-100 transition-colors"
                      >
                        <Palette className="h-4 w-4 text-pink-400" />
                        <span>Studio của tôi</span>
                      </Link>

                      <Link
                        href="/history"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-[#2b2c33] hover:text-zinc-100 transition-colors"
                      >
                        <History className="h-4 w-4 text-emerald-400" />
                        <span>Lịch sử trò chuyện</span>
                      </Link>
                    </div>

                    <div className="border-t border-[#2c2e35] pt-1 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 rounded-xl border border-[#3b3d46] bg-[#23242a] px-3.5 py-1.5 text-xs font-semibold text-zinc-200 hover:border-[#525560] hover:bg-[#2b2c33] hover:text-white transition-all cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
