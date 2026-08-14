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

export enum MessageRole {
  User = 0,
  Assistant = 1,
  System = 2,
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
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  errors: string[];
}
