"use client";

import { useState } from "react";
import { useAuth } from "@/core/providers/AuthProvider";
import { X, Lock, Mail, Loader2, LogIn, UserPlus, Eye, EyeOff, Check, AlertCircle } from "lucide-react";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (tab === "login") {
        await login({ email, password });
      } else {
        if (password.length < 6) {
          throw new Error("Mật khẩu phải có tối thiểu 6 ký tự!");
        }
        if (password !== confirmPassword) {
          throw new Error("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại!");
        }

        await register({
          email,
          password,
          userName: "User",
        });
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchTab = (newTab: "login" | "register") => {
    setTab(newTab);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#31333a] bg-[#212227]/98 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-zinc-400 hover:bg-[#2b2c34] hover:text-zinc-100 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5 mt-1">
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            {tab === "login" ? "Chào mừng trở lại!" : "Tạo tài khoản Nyxoris"}
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            {tab === "login"
              ? "Đăng nhập để lưu lịch sử và quản lý nhân vật AI của bạn"
              : "Khởi tạo tài khoản để trải nghiệm trò chuyện không giới hạn"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-[#18191c] p-1 mb-6 border border-[#2c2e35]">
          <button
            type="button"
            onClick={() => handleSwitchTab("login")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all cursor-pointer ${
              tab === "login"
                ? "bg-[#2b2c34] text-white border border-[#3b3d46] shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Đăng nhập</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchTab("register")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all cursor-pointer ${
              tab === "register"
                ? "bg-[#2b2c34] text-white border border-[#3b3d46] shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Đăng ký</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5" key={tab}>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Email *</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete={tab === "login" ? "email" : "off"}
                style={{ colorScheme: "dark" }}
                className="w-full rounded-xl border border-[#31333a] bg-[#1a1b1f] py-2.5 pl-10 pr-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-[#4d505c] focus:bg-[#1f2026] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Mật khẩu *</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                autoComplete={tab === "login" ? "current-password" : "new-password"}
                style={{ colorScheme: "dark" }}
                className="w-full rounded-xl border border-[#31333a] bg-[#1a1b1f] py-2.5 pl-10 pr-10 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-[#4d505c] focus:bg-[#1f2026] focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {tab === "register" && password.length > 0 && password.length < 6 && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-amber-400/90 font-medium">
                <AlertCircle className="h-3 w-3" />
                <span>Mật khẩu cần tối thiểu 6 ký tự</span>
              </p>
            )}
          </div>

          {tab === "register" && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Nhập lại mật khẩu *</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-zinc-500 pointer-events-none" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  autoComplete="new-password"
                  style={{ colorScheme: "dark" }}
                  className={`w-full rounded-xl border bg-[#1a1b1f] py-2.5 pl-10 pr-10 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none transition-all ${
                    confirmPassword.length > 0
                      ? password === confirmPassword && password.length >= 6
                        ? "border-emerald-500/70 focus:border-emerald-400"
                        : "border-rose-500/70 focus:border-rose-400"
                      : "border-[#31333a] focus:border-[#4d505c] focus:bg-[#1f2026]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 p-1 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  title={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <div className="mt-1 flex items-center gap-1 text-[11px]">
                  {password === confirmPassword ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <Check className="h-3 w-3" />
                      <span>Mật khẩu trùng khớp</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-400 font-medium">
                      <AlertCircle className="h-3 w-3" />
                      <span>Mật khẩu không khớp</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-3 flex items-center justify-center gap-2 rounded-2xl bg-zinc-100 py-3 text-xs font-bold text-zinc-950 hover:bg-white shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-900" />
            ) : tab === "login" ? (
              <span>Đăng nhập ngay</span>
            ) : (
              <span>Tạo tài khoản mới</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
