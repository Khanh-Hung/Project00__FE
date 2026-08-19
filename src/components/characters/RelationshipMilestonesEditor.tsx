"use client";

import React from "react";
import { Plus, Trash2, Trophy, Sparkles, RefreshCw } from "lucide-react";
import { RelationshipMilestone } from "@/types";

interface RelationshipMilestonesEditorProps {
  milestones: RelationshipMilestone[];
  onChange: (milestones: RelationshipMilestone[]) => void;
}

export default function RelationshipMilestonesEditor({
  milestones,
  onChange,
}: RelationshipMilestonesEditorProps) {
  const handleAddMilestone = () => {
    let nextMin = 0;
    let nextMax = 100;
    if (milestones.length > 0) {
      const last = milestones[milestones.length - 1];
      nextMin = Math.min(100, last.maxScore + 1);
      nextMax = 100;
    }
    const newM: RelationshipMilestone = {
      name: `Cột mốc ${milestones.length + 1}`,
      minScore: nextMin,
      maxScore: nextMax,
      description: "Thái độ và cách ứng xử của nhân vật đối với bạn ở mốc này...",
    };
    onChange([...milestones, newM]);
  };

  const handleUpdateMilestone = (
    index: number,
    field: keyof RelationshipMilestone,
    value: string | number
  ) => {
    const updated = [...milestones];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const handleDeleteMilestone = (index: number) => {
    const updated = milestones.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleResetToStandard = () => {
    const standard: RelationshipMilestone[] = [
      {
        name: "Kẻ Thù Truyền Kiếp",
        minScore: -100,
        maxScore: -61,
        description: "Cực kỳ căm ghét, dùng lời đe dọa, khinh bỉ và sẵn sàng tấn công.",
      },
      {
        name: "Thù Địch & Ác Cảm",
        minScore: -60,
        maxScore: -21,
        description: "Khó chịu, mỉa mai, cự tuyệt tiếp xúc và giữ khoảng cách tối đa.",
      },
      {
        name: "Người Lạ",
        minScore: -20,
        maxScore: 20,
        description: "Lịch thiệp, giữ khoảng cách và thận trọng quan sát bạn.",
      },
      {
        name: "Người Quen",
        minScore: 21,
        maxScore: 45,
        description: "Cởi mở hơn, sẵn sàng chào hỏi và chia sẻ thói quen đời thường.",
      },
      {
        name: "Bạn Thân Thiết",
        minScore: 46,
        maxScore: 70,
        description: "Xưng hô thân mật, hay trêu đùa và sẵn sàng bảo vệ bạn.",
      },
      {
        name: "Tri Kỷ & Rung Động",
        minScore: 71,
        maxScore: 90,
        description: "Rung động, tin tưởng tuyệt đối và chia sẻ những vết thương quá khứ.",
      },
      {
        name: "Gắn Kết Linh Hồn",
        minScore: 91,
        maxScore: 100,
        description: "Dành trọn trái tim, nguyện hy sinh và ở bên nhau trọn đời.",
      },
    ];
    onChange(standard);
  };

  return (
    <div className="rounded-2xl border border-[#31333a] bg-[#191a1e] p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          <div>
            <h4 className="text-xs font-bold text-zinc-200">
              Cây Cột Mốc Quan Hệ Độc Quyền ({milestones.length} mốc)
            </h4>
            <p className="text-[11px] text-zinc-500">
              Tùy biến số lượng & tên mốc theo bối cảnh riêng của nhân vật
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToStandard}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 bg-[#24252f] hover:bg-[#2c2d3a] px-2.5 py-1 rounded-xl border border-[#363847] transition-all cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Mẫu 7 mốc chuẩn</span>
          </button>
          <button
            type="button"
            onClick={handleAddMilestone}
            className="flex items-center gap-1 text-[11px] font-bold text-pink-300 bg-pink-950/50 hover:bg-pink-900/60 px-3 py-1 rounded-xl border border-pink-800/40 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm cột mốc</span>
          </button>
        </div>
      </div>

      {milestones.length === 0 ? (
        <div className="p-4 rounded-xl border border-dashed border-[#343644] bg-[#15161c] text-center space-y-2">
          <p className="text-xs text-zinc-400">
            Chưa có cột mốc riêng. Nhân vật sẽ sử dụng 7 cột mốc mặc định của hệ thống.
          </p>
          <button
            type="button"
            onClick={handleResetToStandard}
            className="inline-flex items-center gap-1.5 text-xs text-pink-400 font-semibold hover:underline"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Tạo danh sách cột mốc tùy biến ngay</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-[#2a2c38] bg-[#14151b] space-y-2.5 transition-all hover:border-[#383b4b]"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <span className="text-[11px] font-mono font-bold text-pink-400 bg-pink-950/40 px-2 py-0.5 rounded-lg border border-pink-800/30">
                    Mốc #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={m.name}
                    onChange={(e) => handleUpdateMilestone(idx, "name", e.target.value)}
                    placeholder="Tên cột mốc (VD: Đệ Tử Mới, Tri Kỷ...)"
                    className="flex-1 rounded-lg border border-[#2d303b] bg-[#1a1b24] px-2.5 py-1 text-xs text-zinc-100 placeholder-zinc-500 focus:border-pink-500/50 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <span>Điểm:</span>
                    <input
                      type="number"
                      min="-100"
                      max="100"
                      value={m.minScore}
                      onChange={(e) =>
                        handleUpdateMilestone(
                          idx,
                          "minScore",
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                      className="w-14 rounded-lg border border-[#2d303b] bg-[#1a1b24] px-1.5 py-1 text-center text-xs text-zinc-200 focus:border-pink-500/50 focus:outline-none font-mono"
                    />
                    <span>➔</span>
                    <input
                      type="number"
                      min="-100"
                      max="100"
                      value={m.maxScore}
                      onChange={(e) =>
                        handleUpdateMilestone(
                          idx,
                          "maxScore",
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                      className="w-14 rounded-lg border border-[#2d303b] bg-[#1a1b24] px-1.5 py-1 text-center text-xs text-zinc-200 focus:border-pink-500/50 focus:outline-none font-mono"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteMilestone(idx)}
                    title="Xóa cột mốc này"
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={m.description}
                  onChange={(e) =>
                    handleUpdateMilestone(idx, "description", e.target.value)
                  }
                  placeholder="Mô tả thái độ và chỉ dẫn cách ứng xử của nhân vật đối với người chơi ở mốc này..."
                  className="w-full rounded-lg border border-[#2d303b] bg-[#1a1b24] px-2.5 py-1.5 text-xs text-zinc-300 placeholder-zinc-600 focus:border-pink-500/50 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
