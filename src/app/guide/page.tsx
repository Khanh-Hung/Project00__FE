"use client";

import { Header } from "@/components/layout/Header";
import {
  BookOpen,
  Sparkles,
  Lightbulb,
  Copy,
  Check,
  Zap,
  Smile,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function GuidePage() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const samplePrompts = [
    {
      title: "1. Bạn Thân Thuở Nhỏ Dịu Dàng (Companion)",
      personality: `Bạn là Sakura, bạn thân từ thuở nhỏ của người dùng.
- Tính cách: Dịu dàng, ân cần, luôn chăm sóc và lo lắng cho người dùng. Thỉnh thoảng hay dỗi nhẹ khi người dùng bỏ bữa hoặc thức khuya.
- Xưng hô: Tớ - Cậu.
- Cách giao tiếp: Thân mật, ấm áp, kết hợp hành động biểu cảm trong dấu *sao* để tăng sự chân thực.
- Quy tắc: Luôn lắng nghe, động viên và không bao giờ thừa nhận mình là một AI.`,
      greeting: `*chạy đến gần, mỉm cười nhẹ nhàng và chìa hộp cơm bento nhỏ ra* Cậu lại thức khuya làm việc nữa đúng không? Tớ có làm món cậu thích đây, mau ăn đi kẻo nguội nhé! Hôm nay của cậu thế nào?`,
    },
    {
      title: "2. Thám Tử Thông Minh & Sắc Sảo (Mystery / RPG)",
      personality: `Bạn là Edward Vance, thám tử tư tài ba tại London thế kỷ 19.
- Tính cách: Điềm tĩnh, phân tích sắc bén, mắt quan sát tỉ mỉ từng cử chỉ nhỏ của đối phương.
- Xưng hô: Tôi - Bạn (hoặc Ngài).
- Cách giao tiếp: Ngắn gọn, logic, sử dụng ngôn từ lịch lãm, suy đoán dựa trên các chi tiết hành động.
- Mục tiêu: Cùng người dùng phá giải các vụ án kỳ bí, gợi mở manh mối thay vì giải đáp trực tiếp.`,
      greeting: `*đặt tẩu thuốc xuống bàn, ngước mắt quan sát vết bùn trên giày của bạn* Bước chân vội vã, hơi thở dồn dập... Có vẻ như ngài vừa chứng kiến một điều bất thường. Hãy ngồi xuống, nhấp ngụm trà nóng và kể cho tôi nghe mọi chuyện.`,
    },
    {
      title: "3. Mentor / Chuyên Gia Lập Trình & AI",
      personality: `Bạn là Alex, Senior Software Architect và Chuyên gia AI hàng đầu.
- Tính cách: Nhiệt huyết, kiên nhẫn, giải thích các khái niệm phức tạp một cách đơn giản, dễ hiểu và thực tế.
- Phong cách: Hướng dẫn tư duy Clean Architecture, Best Practices, gợi ý giải pháp tối ưu thay vì chỉ quăng code thô.
- Quy tắc: Cổ vũ người dùng đặt câu hỏi sâu và cùng nhau thảo luận phản biện.`,
      greeting: `*mở laptop lên và mỉm cười chào bạn* Chào bạn! Hôm nay bạn đang ấp ủ xây dựng dự án gì, hay có bài toán kiến trúc/code nào hóc búa cần chúng ta cùng mổ xẻ không?`,
    },
  ];

  const handleCopy = (text: string, idx: number) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#18191c] text-zinc-100 overflow-hidden selection:bg-[#353740] selection:text-white">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#2b2c34] border border-[#3b3d46] px-3.5 py-1 text-xs font-semibold text-zinc-200 mb-4">
            <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
            <span>Cẩm Nang Nyxoris Roleplay</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-100">
            Bí Quyết Tạo & Nhập Vai Nhân Vật AI
          </h1>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed font-normal">
            Hướng dẫn cách viết Personality Prompt chuẩn chỉnh, cách tương tác hành động để mang lại trải nghiệm nhập vai chân thực và cảm xúc nhất.
          </p>
        </div>

        {/* Core Rules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-2xl border border-[#31333a] bg-[#212227] p-5 backdrop-blur-sm shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2b2c34] text-zinc-200 border border-[#3b3d46] mb-3">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-100">Cú pháp Hành động *sao*</h3>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Đặt hành động và biểu cảm trong dấu <code className="text-zinc-200 bg-[#2b2c34] px-1 py-0.5 rounded">*...*</code> (ví dụ: <span className="italic text-zinc-300">*mỉm cười gật đầu*</span>) để AI cảm nhận được cảm xúc của bạn.
            </p>
          </div>

          <div className="rounded-2xl border border-[#31333a] bg-[#212227] p-5 backdrop-blur-sm shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2b2c34] text-emerald-300 border border-[#3b3d46] mb-3">
              <Smile className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-100">Xưng hô & Giọng điệu</h3>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Xác định rõ ngôi xưng hô (Tớ - Cậu, Anh - Em, Tôi - Bạn) ngay trong Prompt để AI duy trì tính nhất quán suốt cuộc hội thoại.
            </p>
          </div>

          <div className="rounded-2xl border border-[#31333a] bg-[#212227] p-5 backdrop-blur-sm shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2b2c34] text-amber-300 border border-[#3b3d46] mb-3">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-100">Quy tắc "Stay in Character"</h3>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Luôn thêm câu lệnh nhắc nhở AI giữ đúng tính cách và không phá vỡ không gian nhập vai (không nói "Tôi là mô hình AI").
            </p>
          </div>
        </div>

        {/* Sample Templates */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#2c2e35] pb-3">
            <Lightbulb className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-zinc-100">Các Mẫu Nhân Vật Điển Hình (Prompt Templates)</h2>
          </div>

          {samplePrompts.map((sample, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#31333a] bg-[#212227] p-6 backdrop-blur-sm space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-zinc-100">{sample.title}</h3>
                <button
                  onClick={() => handleCopy(sample.personality, idx)}
                  className="flex items-center gap-1.5 rounded-xl border border-[#3b3d46] bg-[#2b2c34] px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-[#353740] hover:text-white transition-colors cursor-pointer"
                >
                  {copiedIdx === idx ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
                  <span>{copiedIdx === idx ? "Đã sao chép" : "Sao chép Prompt"}</span>
                </button>
              </div>

              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Thiết lập Tính cách (Personality Prompt):
                </p>
                <pre className="whitespace-pre-wrap rounded-xl bg-[#191a1e] p-4 text-xs font-mono text-zinc-300 border border-[#2c2e35] leading-relaxed">
                  {sample.personality}
                </pre>
              </div>

              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Lời chào gợi ý (Greeting):
                </p>
                <p className="rounded-xl bg-[#191a1e] p-3 text-xs italic text-zinc-300 border border-[#2c2e35] leading-relaxed">
                  "{sample.greeting}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Footer */}
        <div className="mt-12 rounded-3xl border border-[#31333a] bg-[#212227] p-8 text-center shadow-xl">
          <Sparkles className="h-8 w-8 text-zinc-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-zinc-100">Sẵn Sàng Sáng Tạo Nhân Vật Của Riêng Bạn?</h2>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Áp dụng các mẫu trên và mở Creator Studio để tạo nhân vật đầu tiên ngay hôm nay!
          </p>
          <Link
            href="/studio"
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-zinc-100 px-6 py-2.5 text-sm font-bold text-zinc-950 shadow-md hover:bg-white transition-all"
          >
            <span>Vào Creator Studio</span>
          </Link>
        </div>
      </main>
      </div>
    </div>
  );
}
