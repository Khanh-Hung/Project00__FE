import { ApiResponse, Character, ChatSession, CreateCharacterRequest } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function fetchCharacters(category?: string): Promise<Character[]> {
  const url = category ? `${API_BASE_URL}/characters?category=${encodeURIComponent(category)}` : `${API_BASE_URL}/characters`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch characters");
  const json: ApiResponse<Character[]> = await res.json();
  return json.data || [];
}

export async function fetchCharacterById(id: string): Promise<Character> {
  const res = await fetch(`${API_BASE_URL}/characters/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Character not found");
  const json: ApiResponse<Character> = await res.json();
  return json.data;
}

export async function createCharacter(req: CreateCharacterRequest): Promise<Character> {
  const res = await fetch(`${API_BASE_URL}/characters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.errors?.[0] || "Failed to create character");
  }
  const json: ApiResponse<Character> = await res.json();
  return json.data;
}

export async function createChatSession(characterId: string, title: string): Promise<ChatSession> {
  const res = await fetch(`${API_BASE_URL}/chat/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ characterId, title }),
  });
  if (!res.ok) throw new Error("Failed to create chat session");
  const json: ApiResponse<ChatSession> = await res.json();
  return json.data;
}

export async function fetchChatSession(sessionId: string): Promise<ChatSession> {
  const res = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load chat session");
  const json: ApiResponse<ChatSession> = await res.json();
  return json.data;
}

export async function sendChatMessage(sessionId: string, content: string): Promise<{ userMessage: any; assistantMessage: any }> {
  const res = await fetch(`${API_BASE_URL}/chat/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, content }),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.errors?.[0] || "Failed to send message to AI");
  }
  const json = await res.json();
  return json.data;
}
