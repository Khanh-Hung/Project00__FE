import {
  ApiResponse,
  AuthResponse,
  Character,
  ChatSession,
  ChatSessionListItem,
  CreateCharacterRequest,
  LoginRequest,
  RegisterRequest,
  UpdateCharacterRequest,
  UpdateProfileRequest,
  GeneratedCharacterDto,
  ChatMessage,
  SendMessageResponse,
  User,
  CharacterMemory,
  UserProfile,
  UpdateUserProfileRequest,
  ProactiveReachoutResponse,
  WorldGenre,
  CharacterVisualIdentity,
  TriggerSceneImageResponse,
  SceneImageStatusResponse,
  SceneImageDto,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function getAuthHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("nyxoris_auth_token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

function extractErrorMessage(errorJson: any): string | undefined {
  if (!errorJson) return undefined;
  if (Array.isArray(errorJson.errors) && errorJson.errors.length > 0) {
    return errorJson.errors[0];
  }
  if (errorJson.errors && typeof errorJson.errors === "object") {
    const values = Object.values(errorJson.errors).flat();
    if (values.length > 0) return String(values[0]);
  }
  return errorJson.message || errorJson.title || undefined;
}

function localizeError(rawError: string | undefined, defaultMessage: string): string {
  if (!rawError) return defaultMessage;
  const lower = rawError.toLowerCase();

  if (lower.includes("email is already in use") || lower.includes("already in use") || lower.includes("conflict")) {
    return "Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác.";
  }
  if (lower.includes("invalid email or password") || lower.includes("unauthorized")) {
    return "Email hoặc mật khẩu không chính xác. Vui lòng thử lại!";
  }
  if (lower.includes("character") && lower.includes("not found")) {
    return "Không tìm thấy thông tin nhân vật này.";
  }
  if (lower.includes("session") && lower.includes("not found")) {
    return "Không tìm thấy phòng trò chuyện này.";
  }
  if (lower.includes("failed to send message") || lower.includes("ai")) {
    return "Không thể nhận phản hồi từ AI. Vui lòng thử lại!";
  }

  return rawError.includes("failed") || rawError.includes("error") || rawError.includes("validation") ? defaultMessage : rawError;
}

export async function loginUser(req: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Email hoặc mật khẩu không chính xác. Vui lòng thử lại!"));
  }
  const json: ApiResponse<AuthResponse> = await res.json();
  return json.data;
}

export async function registerUser(req: RegisterRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: req.email,
      password: req.password,
      userName: req.userName || undefined,
      displayName: req.displayName || "User",
      avatarUrl: req.avatarUrl || null,
    }),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Đăng ký không thành công. Vui lòng thử lại!"));
  }
  const json: ApiResponse<AuthResponse> = await res.json();
  return json.data;
}

export async function updateAuthProfile(req: UpdateProfileRequest): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Không thể cập nhật hồ sơ. Vui lòng thử lại!"));
  }
  const json: ApiResponse<User> = await res.json();
  return json.data;
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const authHeader = getAuthHeader();
    if (!authHeader.Authorization) return null;

    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { ...authHeader },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json: ApiResponse<User> = await res.json();
    return json.data || null;
  } catch (error) {
    console.warn("[API] Could not fetch current user:", error);
    return null;
  }
}

export async function fetchCharacters(category?: string): Promise<Character[]> {
  try {
    const url = category
      ? `${API_BASE_URL}/characters?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/characters`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.warn(`[API] Failed to fetch characters, status: ${res.status}`);
      return [];
    }
    const json: ApiResponse<Character[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn("[API] Backend is unreachable or returned error:", error);
    return [];
  }
}

export async function fetchCharacterById(id: string): Promise<Character | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/characters/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json: ApiResponse<Character> = await res.json();
    return json.data || null;
  } catch (error) {
    console.warn(`[API] Could not fetch character ${id}:`, error);
    return null;
  }
}

export async function createCharacter(req: CreateCharacterRequest): Promise<Character> {
  const res = await fetch(`${API_BASE_URL}/characters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Không thể tạo nhân vật mới. Vui lòng thử lại!"));
  }
  const json: ApiResponse<Character> = await res.json();
  return json.data;
}

export async function updateCharacter(id: string, req: UpdateCharacterRequest): Promise<Character> {
  const res = await fetch(`${API_BASE_URL}/characters/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Không thể cập nhật nhân vật. Vui lòng thử lại!"));
  }
  const json: ApiResponse<Character> = await res.json();
  return json.data;
}

export async function deleteCharacter(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/characters/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
    },
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Không thể xóa nhân vật. Vui lòng thử lại!"));
  }
  return true;
}

export async function fetchRecentSessions(): Promise<ChatSessionListItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/chat/sessions`, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json: ApiResponse<ChatSessionListItem[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn("[API] Could not fetch chat sessions:", error);
    return [];
  }
}

export async function createChatSession(characterId: string, title: string): Promise<ChatSession> {
  const res = await fetch(`${API_BASE_URL}/chat/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ characterId, title }),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Không thể khởi tạo phòng trò chuyện. Vui lòng thử lại!"));
  }
  const json: ApiResponse<ChatSession> = await res.json();
  return json.data;
}

export async function getOrCreateChatSession(characterId: string, title?: string): Promise<{ id: string }> {
  try {
    const sessions = await fetchRecentSessions();
    const existing = sessions.find((s) => s.characterId === characterId);
    if (existing) {
      return { id: existing.id };
    }
  } catch (err) {
    console.warn("[API] Could not check existing sessions:", err);
  }
  return await createChatSession(characterId, title || "Cuộc trò chuyện");
}

export async function fetchChatSession(sessionId: string): Promise<ChatSession> {
  const res = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
    headers: { ...getAuthHeader() },
    cache: "no-store",
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Không tìm thấy phòng trò chuyện này."));
  }
  const json: ApiResponse<ChatSession> = await res.json();
  return json.data;
}

export async function deleteChatSession(sessionId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Không thể xóa phòng trò chuyện này."));
  }
  return true;
}

export async function sendChatMessage(
  sessionId: string,
  content: string
): Promise<SendMessageResponse> {
  const res = await fetch(`${API_BASE_URL}/chat/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ sessionId, content }),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Không thể nhận phản hồi từ AI. Vui lòng thử lại!"));
  }
  const json = await res.json();
  return json.data;
}

export async function rollbackChatMessage(
  sessionId: string,
  messageId: string
): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/rollback/${messageId}`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
    },
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Không thể quay về mốc tin nhắn này."));
  }
  return true;
}

export async function fetchRoleplaySuggestions(sessionId: string): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/suggestions`, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data = json?.data ?? json?.value ?? json;
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("Could not fetch roleplay suggestions:", err);
    return [];
  }
}

export async function generateCharacterWithAI(
  idea: string,
  category?: string
): Promise<GeneratedCharacterDto> {
  const res = await fetch(`${API_BASE_URL}/characters/generate-ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ idea, category }),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Không thể tự động tạo nhân vật bằng AI lúc này. Vui lòng thử lại!"));
  }
  const json = await res.json();
  const data = json?.data ?? json?.value ?? json;
  if (!data) {
    throw new Error("Không nhận được dữ liệu hợp lệ từ AI.");
  }
  return data;
}

export const generateCharacterWithAi = generateCharacterWithAI;

export async function fetchAIRandomIdeas(count = 3): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/characters/generate-ideas?count=${count}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data = json?.data ?? json?.value ?? json;
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("Could not fetch AI random ideas:", err);
    return [];
  }
}

export const fetchAiRandomIdeas = fetchAIRandomIdeas;

export async function generateCharacterAvatar(req: {
  name?: string;
  title?: string;
  category?: string;
  personalityPrompt?: string;
  idea?: string;
  worldGenre?: WorldGenre | number;
  visualIdentity?: CharacterVisualIdentity;
}): Promise<{ avatarUrl: string; fullBodyUrl?: string; prompt: string }> {
  const res = await fetch(`${API_BASE_URL}/characters/generate-avatar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Không thể vẽ ảnh đại diện bằng AI lúc này. Vui lòng thử lại!"));
  }
  const json = await res.json();
  const data = json?.data ?? json?.value ?? json;
  const avatarUrl = data?.avatarUrl || data?.imageUrl || data?.url;
  const fullBodyUrl = data?.fullBodyUrl || data?.canonicalReferenceUrl || undefined;
  const prompt = data?.prompt || data?.revisedPrompt || "";
  if (!data || !avatarUrl) {
    throw new Error("Không nhận được ảnh đại diện từ AI.");
  }
  return { avatarUrl, fullBodyUrl, prompt };
}

export async function triggerTurnSceneImage(
  sessionId: string,
  turnId: string
): Promise<TriggerSceneImageResponse> {
  const res = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/turns/${turnId}/image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Không thể kích hoạt vẽ hình ảnh cho lượt này. Vui lòng thử lại!"));
  }
  const json: ApiResponse<TriggerSceneImageResponse> = await res.json();
  return json.data;
}

export async function getSceneImageStatus(
  generationRequestId: string
): Promise<SceneImageStatusResponse> {
  const res = await fetch(`${API_BASE_URL}/chat/scene-images/${generationRequestId}`, {
    headers: {
      ...getAuthHeader(),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Không thể lấy trạng thái hình ảnh."));
  }
  const json: ApiResponse<SceneImageStatusResponse> = await res.json();
  return json.data;
}

export async function fetchTurnSceneImages(
  sessionId: string,
  turnId: string
): Promise<SceneImageDto[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/turns/${turnId}/images`, {
      headers: {
        ...getAuthHeader(),
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json: ApiResponse<SceneImageDto[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn(`[API] Could not fetch scene images for turn ${turnId}:`, error);
    return [];
  }
}

/**
 * @deprecated Use triggerTurnSceneImage and getSceneImageStatus instead.
 */
export async function generateSceneImage(req: {
  sessionId?: string;
  characterName?: string;
  characterTitle?: string;
  characterPersonality?: string;
  messageContent: string;
  userMessageContent?: string;
  referenceImageUrl?: string;
}): Promise<{ imageUrl: string; prompt: string }> {
  const res = await fetch(`${API_BASE_URL}/chat/imagine-scene`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Không thể phác họa khoảnh khắc này. Vui lòng thử lại!"));
  }
  const json = await res.json();
  const data = json?.data ?? json?.value ?? json;
  const imageUrl = data?.imageUrl || data?.avatarUrl || data?.url;
  if (!data || !imageUrl) {
    throw new Error("Không nhận được hình ảnh minh họa từ AI.");
  }
  return { imageUrl, prompt: data.prompt || "" };
}

export async function fetchCharacterMemories(characterId: string, limit: number = 30): Promise<CharacterMemory[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/chat/memories/${characterId}?limit=${limit}`, {
      headers: {
        ...getAuthHeader(),
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || json?.value || [];
  } catch (error) {
    console.warn(`[API] Could not fetch memories for character ${characterId}:`, error);
    return [];
  }
}

export async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/user-profile/${userId}`, {
    headers: {
      ...getAuthHeader(),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Không thể tải hồ sơ người dùng.");
  }
  const json = await res.json();
  return json?.data || json?.value || json;
}

export async function updateUserProfile(userId: string, req: UpdateUserProfileRequest): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/user-profile/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Không thể cập nhật hồ sơ người dùng."));
  }
  const json = await res.json();
  return json?.data || json?.value || json;
}

export async function proactiveReachout(req: { characterId: string; userId: string }): Promise<ProactiveReachoutResponse> {
  const res = await fetch(`${API_BASE_URL}/chat/proactive-reachout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const rawError = extractErrorMessage(errorJson);
    throw new Error(localizeError(rawError, "Không thể kích hoạt tin nhắn làm quen từ nhân vật."));
  }
  const json = await res.json();
  return json?.data || json?.value || json;
}

