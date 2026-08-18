export interface User {
  id: string;
  email: string;
  userName: string;
  avatarUrl: string;
  createdAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  userName: string;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  personalityPrompt: string;
  greeting: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  createdBy?: string;
  creatorName?: string;
  creatorAvatar?: string;
}

export interface CreateCharacterRequest {
  name: string;
  title: string;
  avatarUrl: string;
  personalityPrompt: string;
  greeting: string;
  category: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateCharacterRequest {
  name: string;
  title: string;
  avatarUrl: string;
  personalityPrompt: string;
  greeting: string;
  category: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface GeneratedCharacterDto {
  name: string;
  title: string;
  category: string;
  personalityPrompt: string;
  greeting: string;
  tags: string[];
}

export enum MessageRole {
  User = 1,
  Assistant = 2,
  System = 3,
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  characterId: string;
  characterName: string;
  characterAvatar: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  characterTitle?: string;
  characterPersonality?: string;
  characterCategory?: string;
}

export interface ChatSessionListItem {
  id: string;
  characterId: string;
  characterName: string;
  characterAvatar: string;
  title: string;
  lastMessageContent: string | null;
  lastMessageTime: string | null;
  messageCount: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  errors: string[];
}
