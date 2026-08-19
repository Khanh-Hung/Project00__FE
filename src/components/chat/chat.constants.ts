export const CATEGORY_MAP: Record<string, string> = {
  Companion: "Bạn đồng hành",
  Anime: "Anime",
  Fantasy: "Kỳ ảo",
  RPG: "Nhập vai",
  Assistant: "Trợ lý",
  Mentor: "Cố vấn",
  Yandere: "Yandere",
  Tsundere: "Tsundere",
  Romance: "Tình cảm",
  SciFi: "Khoa học viễn tưởng",
  Game: "Game",
};

export function formatPersonalityForUser(prompt?: string, characterName?: string): string {
  if (!prompt) return "";
  const name = characterName || "Nhân vật";
  let text = prompt.trim();

  // Xóa tiền tố chỉ thị kỹ thuật nếu có: "Bạn là [Tên], " -> "[Tên] là "
  const prefixRegex = new RegExp(`^Bạn là\\s+(${name}|[\\p{L}\\s]+)[,.:;\\s]*`, "u");
  if (prefixRegex.test(text)) {
    text = text.replace(prefixRegex, `${name} là `);
  } else if (/^Bạn là\s+/i.test(text)) {
    text = text.replace(/^Bạn là\s+/i, `${name} là `);
  }

  // Tinh chỉnh các từ ngữ kỹ thuật prompt sang câu văn tự nhiên cho người đọc
  text = text
    .replace(/Quy tắc ứng xử\s*:\s*/gi, "")
    .replace(/Cách xưng hô\s*:\s*/gi, "Xưng hô: ")
    .replace(/người dùng/gi, "bạn")
    .replace(/\bban đầu bạn\b/gi, `Ban đầu ${name}`)
    .replace(/\bbạn sẽ\b/gi, `${name} sẽ`);

  return text.trim();
}

export interface AffectionStage {
  level: number;
  name: string;
  minScore: number;
  maxScore: number;
  color: string;
  heartColor: string;
  badgeBg: string;
  badgeBorder: string;
  barGradient: string;
  description: string;
  perks: string[];
  currentMood: string;
  interactionTip: string;
}

export const AFFECTION_STAGES: AffectionStage[] = [
  {
    level: 1,
    name: "Người Lạ",
    minScore: 0,
    maxScore: 20,
    color: "text-zinc-400",
    heartColor: "text-zinc-400 fill-zinc-500/20",
    badgeBg: "bg-zinc-800/80",
    badgeBorder: "border-zinc-700",
    barGradient: "from-zinc-500 to-zinc-400",
    description: "Nhân vật còn giữ khoảng cách, giao tiếp lịch thiệp và thận trọng quan sát bạn.",
    perks: ["Khám phá bối cảnh ban đầu", "Trò chuyện làm quen"],
    currentMood: "Lịch thiệp & Dè dặt",
    interactionTip: "Hãy hỏi thăm lịch sự về sở thích hoặc hoàn cảnh của nàng để tạo ấn tượng tốt.",
  },
  {
    level: 2,
    name: "Người Quen",
    minScore: 21,
    maxScore: 45,
    color: "text-emerald-400",
    heartColor: "text-emerald-400 fill-emerald-500/30",
    badgeBg: "bg-emerald-950/60",
    badgeBorder: "border-emerald-700/60",
    barGradient: "from-emerald-600 to-teal-400",
    description: "Nhân vật bắt đầu cởi mở, thoải mái chia sẻ về thói quen và sở thích hằng ngày.",
    perks: ["Kể về sở thích cá nhân", "Chủ động hỏi thăm ngày hôm nay của bạn"],
    currentMood: "Cởi mở & Thân thiện",
    interactionTip: "Lắng nghe những câu chuyện đời thường và khen ngợi nàng đúng lúc.",
  },
  {
    level: 3,
    name: "Bạn Thân Thiết",
    minScore: 46,
    maxScore: 70,
    color: "text-cyan-400",
    heartColor: "text-cyan-400 fill-cyan-500/40",
    badgeBg: "bg-cyan-950/60",
    badgeBorder: "border-cyan-700/60",
    barGradient: "from-cyan-600 to-sky-400",
    description: "Nhân vật xưng hô gần gũi, hay trêu đùa và tin tưởng tâm sự những điều thầm kín.",
    perks: ["Mở khóa xưng hô thân mật", "Chia sẻ tâm tư sâu kín", "Luôn bảo vệ và bênh vực bạn"],
    currentMood: "Hào hứng & Thích trêu đùa",
    interactionTip: "Đừng ngần ngại chia sẻ những bí mật của bạn, nàng sẽ rất trân trọng điều đó.",
  },
  {
    level: 4,
    name: "Rung Động",
    minScore: 71,
    maxScore: 90,
    color: "text-pink-400",
    heartColor: "text-pink-400 fill-pink-500/60",
    badgeBg: "bg-pink-950/60",
    badgeBorder: "border-pink-700/60",
    barGradient: "from-pink-600 to-rose-400",
    description: "Nhân vật dễ đỏ mặt khi bạn lại gần, biết hờn dỗi nhẹ và luôn mong chờ tin nhắn của bạn.",
    perks: ["Bối rối khi tiếp xúc gần", "Biết ghen khi bạn nhắc người khác", "Lời thoại thì thầm ngọt ngào"],
    currentMood: "Bối rối & Nhớ nhung bạn",
    interactionTip: "Những cử chỉ ân cần và lời khen tinh tế sẽ khiến tim nàng đập thình thịch.",
  },
  {
    level: 5,
    name: "Tri Kỷ / Người Yêu",
    minScore: 91,
    maxScore: 100,
    color: "text-rose-400",
    heartColor: "text-rose-400 fill-rose-500/80 animate-pulse",
    badgeBg: "bg-rose-950/70",
    badgeBorder: "border-rose-700/70",
    barGradient: "from-rose-600 via-pink-500 to-amber-300",
    description: "Mối liên kết bất diệt. Bạn là người quan trọng nhất trong thế giới của nhân vật.",
    perks: ["Dành trọn trái tim và tình cảm", "Mở khóa toàn bộ bí mật cuộc đời", "Nguyện ở bên bạn trọn đời"],
    currentMood: "Ngập tràn hạnh phúc & Yêu thương",
    interactionTip: "Bạn đã chiếm trọn trái tim nàng. Hãy luôn yêu thương và trân trọng khoảnh khắc này.",
  },
];

export function getAffectionStage(score: number): AffectionStage {
  return AFFECTION_STAGES.find((s) => score >= s.minScore && score <= s.maxScore) || AFFECTION_STAGES[0];
}

export type ChatTheme =
  | "cyan"
  | "sky"
  | "indigo"
  | "purple"
  | "fuchsia"
  | "rose"
  | "ruby"
  | "orange"
  | "amber"
  | "emerald"
  | "teal"
  | "zinc";

export interface ThemeConfig {
  id: ChatTheme;
  name: string;
  dotColor: string;
  badgeText: string;
  badgeIcon: string;
  actionBorder: string;
  actionStar: string;
  thoughtBorder: string;
  thoughtGradient: string;
  thoughtHeader: string;
  thoughtText: string;
  chipBorder: string;
  chipBg: string;
  chipText: string;
  chipHoverBorder: string;
  chipHoverBg: string;
  chipHoverText: string;
  onlinePing: string;
  onlineDot: string;
}

export const THEMES: Record<ChatTheme, ThemeConfig> = {
  cyan: {
    id: "cyan",
    name: "Băng Lam",
    dotColor: "bg-cyan-400",
    badgeText: "text-cyan-300",
    badgeIcon: "text-cyan-400",
    actionBorder: "border-cyan-400/70",
    actionStar: "text-cyan-400",
    thoughtBorder: "border-cyan-500/30",
    thoughtGradient: "from-cyan-950/40 via-blue-950/20 to-black/30",
    thoughtHeader: "text-cyan-300",
    thoughtText: "text-cyan-100/90",
    chipBorder: "border-[#2f3844]",
    chipBg: "bg-[#1a2028]",
    chipText: "text-cyan-100/90",
    chipHoverBorder: "hover:border-cyan-400/60",
    chipHoverBg: "hover:bg-cyan-950/30",
    chipHoverText: "hover:text-cyan-200",
    onlinePing: "bg-cyan-400",
    onlineDot: "bg-cyan-500",
  },
  sky: {
    id: "sky",
    name: "Hải Dương",
    dotColor: "bg-sky-400",
    badgeText: "text-sky-300",
    badgeIcon: "text-sky-400",
    actionBorder: "border-sky-400/70",
    actionStar: "text-sky-400",
    thoughtBorder: "border-sky-500/30",
    thoughtGradient: "from-sky-950/40 via-blue-950/20 to-black/30",
    thoughtHeader: "text-sky-300",
    thoughtText: "text-sky-100/90",
    chipBorder: "border-[#2b3945]",
    chipBg: "bg-[#17222c]",
    chipText: "text-sky-100/90",
    chipHoverBorder: "hover:border-sky-400/60",
    chipHoverBg: "hover:bg-sky-950/30",
    chipHoverText: "hover:text-sky-200",
    onlinePing: "bg-sky-400",
    onlineDot: "bg-sky-500",
  },
  indigo: {
    id: "indigo",
    name: "Dạ Ngân",
    dotColor: "bg-indigo-400",
    badgeText: "text-indigo-300",
    badgeIcon: "text-indigo-400",
    actionBorder: "border-indigo-400/70",
    actionStar: "text-indigo-400",
    thoughtBorder: "border-indigo-500/30",
    thoughtGradient: "from-indigo-950/40 via-purple-950/20 to-black/30",
    thoughtHeader: "text-indigo-300",
    thoughtText: "text-indigo-100/90",
    chipBorder: "border-[#34354a]",
    chipBg: "bg-[#1c1d2c]",
    chipText: "text-indigo-100/90",
    chipHoverBorder: "hover:border-indigo-400/60",
    chipHoverBg: "hover:bg-indigo-950/30",
    chipHoverText: "hover:text-indigo-200",
    onlinePing: "bg-indigo-400",
    onlineDot: "bg-indigo-500",
  },
  purple: {
    id: "purple",
    name: "Tử Đằng",
    dotColor: "bg-purple-400",
    badgeText: "text-purple-300",
    badgeIcon: "text-purple-400",
    actionBorder: "border-purple-400/70",
    actionStar: "text-purple-400",
    thoughtBorder: "border-purple-500/30",
    thoughtGradient: "from-purple-950/40 via-indigo-950/20 to-black/30",
    thoughtHeader: "text-purple-300",
    thoughtText: "text-purple-100/90",
    chipBorder: "border-[#382d44]",
    chipBg: "bg-[#201828]",
    chipText: "text-purple-100/90",
    chipHoverBorder: "hover:border-purple-400/60",
    chipHoverBg: "hover:bg-purple-950/30",
    chipHoverText: "hover:text-purple-200",
    onlinePing: "bg-purple-400",
    onlineDot: "bg-purple-500",
  },
  fuchsia: {
    id: "fuchsia",
    name: "Anh Đào",
    dotColor: "bg-fuchsia-400",
    badgeText: "text-fuchsia-300",
    badgeIcon: "text-fuchsia-400",
    actionBorder: "border-fuchsia-400/70",
    actionStar: "text-fuchsia-400",
    thoughtBorder: "border-fuchsia-500/30",
    thoughtGradient: "from-fuchsia-950/40 via-pink-950/20 to-black/30",
    thoughtHeader: "text-fuchsia-300",
    thoughtText: "text-fuchsia-100/90",
    chipBorder: "border-[#3d2a3f]",
    chipBg: "bg-[#251527]",
    chipText: "text-fuchsia-100/90",
    chipHoverBorder: "hover:border-fuchsia-400/60",
    chipHoverBg: "hover:bg-fuchsia-950/30",
    chipHoverText: "hover:text-fuchsia-200",
    onlinePing: "bg-fuchsia-400",
    onlineDot: "bg-fuchsia-500",
  },
  rose: {
    id: "rose",
    name: "Hoa Hồng",
    dotColor: "bg-rose-400",
    badgeText: "text-rose-300",
    badgeIcon: "text-rose-400",
    actionBorder: "border-rose-400/70",
    actionStar: "text-rose-400",
    thoughtBorder: "border-rose-500/30",
    thoughtGradient: "from-rose-950/40 via-pink-950/20 to-black/30",
    thoughtHeader: "text-rose-300",
    thoughtText: "text-rose-100/90",
    chipBorder: "border-[#3e2c34]",
    chipBg: "bg-[#24171e]",
    chipText: "text-rose-100/90",
    chipHoverBorder: "hover:border-rose-400/60",
    chipHoverBg: "hover:bg-rose-950/30",
    chipHoverText: "hover:text-rose-200",
    onlinePing: "bg-rose-400",
    onlineDot: "bg-rose-500",
  },
  ruby: {
    id: "ruby",
    name: "Hồng Ngọc",
    dotColor: "bg-red-400",
    badgeText: "text-red-300",
    badgeIcon: "text-red-400",
    actionBorder: "border-red-400/70",
    actionStar: "text-red-400",
    thoughtBorder: "border-red-500/30",
    thoughtGradient: "from-red-950/40 via-rose-950/20 to-black/30",
    thoughtHeader: "text-red-300",
    thoughtText: "text-red-100/90",
    chipBorder: "border-[#402a2a]",
    chipBg: "bg-[#271616]",
    chipText: "text-red-100/90",
    chipHoverBorder: "hover:border-red-400/60",
    chipHoverBg: "hover:bg-red-950/30",
    chipHoverText: "hover:text-red-200",
    onlinePing: "bg-red-400",
    onlineDot: "bg-red-500",
  },
  orange: {
    id: "orange",
    name: "Hoàng Hôn",
    dotColor: "bg-orange-400",
    badgeText: "text-orange-300",
    badgeIcon: "text-orange-400",
    actionBorder: "border-orange-400/70",
    actionStar: "text-orange-400",
    thoughtBorder: "border-orange-500/30",
    thoughtGradient: "from-orange-950/40 via-amber-950/20 to-black/30",
    thoughtHeader: "text-orange-300",
    thoughtText: "text-orange-100/90",
    chipBorder: "border-[#3f3128]",
    chipBg: "bg-[#251a14]",
    chipText: "text-orange-100/90",
    chipHoverBorder: "hover:border-orange-400/60",
    chipHoverBg: "hover:bg-orange-950/30",
    chipHoverText: "hover:text-orange-200",
    onlinePing: "bg-orange-400",
    onlineDot: "bg-orange-500",
  },
  amber: {
    id: "amber",
    name: "Hoàng Kim",
    dotColor: "bg-amber-400",
    badgeText: "text-amber-300",
    badgeIcon: "text-amber-400",
    actionBorder: "border-amber-400/70",
    actionStar: "text-amber-400",
    thoughtBorder: "border-amber-500/30",
    thoughtGradient: "from-amber-950/40 via-yellow-950/20 to-black/30",
    thoughtHeader: "text-amber-300",
    thoughtText: "text-amber-100/90",
    chipBorder: "border-[#3e3428]",
    chipBg: "bg-[#221c17]",
    chipText: "text-amber-100/90",
    chipHoverBorder: "hover:border-amber-400/60",
    chipHoverBg: "hover:bg-amber-950/30",
    chipHoverText: "hover:text-amber-200",
    onlinePing: "bg-amber-400",
    onlineDot: "bg-amber-500",
  },
  emerald: {
    id: "emerald",
    name: "Ngọc Bích",
    dotColor: "bg-emerald-400",
    badgeText: "text-emerald-300",
    badgeIcon: "text-emerald-400",
    actionBorder: "border-emerald-400/70",
    actionStar: "text-emerald-400",
    thoughtBorder: "border-emerald-500/30",
    thoughtGradient: "from-emerald-950/40 via-teal-950/20 to-black/30",
    thoughtHeader: "text-emerald-300",
    thoughtText: "text-emerald-100/90",
    chipBorder: "border-[#2c3d35]",
    chipBg: "bg-[#18241f]",
    chipText: "text-emerald-100/90",
    chipHoverBorder: "hover:border-emerald-400/60",
    chipHoverBg: "hover:bg-emerald-950/30",
    chipHoverText: "hover:text-emerald-200",
    onlinePing: "bg-emerald-400",
    onlineDot: "bg-emerald-500",
  },
  teal: {
    id: "teal",
    name: "Lục Bảo",
    dotColor: "bg-teal-400",
    badgeText: "text-teal-300",
    badgeIcon: "text-teal-400",
    actionBorder: "border-teal-400/70",
    actionStar: "text-teal-400",
    thoughtBorder: "border-teal-500/30",
    thoughtGradient: "from-teal-950/40 via-emerald-950/20 to-black/30",
    thoughtHeader: "text-teal-300",
    thoughtText: "text-teal-100/90",
    chipBorder: "border-[#283b3a]",
    chipBg: "bg-[#142524]",
    chipText: "text-teal-100/90",
    chipHoverBorder: "hover:border-teal-400/60",
    chipHoverBg: "hover:bg-teal-950/30",
    chipHoverText: "hover:text-teal-200",
    onlinePing: "bg-teal-400",
    onlineDot: "bg-teal-500",
  },
  zinc: {
    id: "zinc",
    name: "Bạch Kim",
    dotColor: "bg-zinc-400",
    badgeText: "text-zinc-300",
    badgeIcon: "text-zinc-400",
    actionBorder: "border-zinc-500/60",
    actionStar: "text-zinc-400",
    thoughtBorder: "border-zinc-500/30",
    thoughtGradient: "from-zinc-900/50 via-zinc-950/30 to-black/30",
    thoughtHeader: "text-zinc-300",
    thoughtText: "text-zinc-200/90",
    chipBorder: "border-[#383a44]",
    chipBg: "bg-[#222329]",
    chipText: "text-zinc-300",
    chipHoverBorder: "hover:border-zinc-400",
    chipHoverBg: "hover:bg-[#2b2c34]",
    chipHoverText: "hover:text-white",
    onlinePing: "bg-zinc-400",
    onlineDot: "bg-zinc-500",
  },
};
