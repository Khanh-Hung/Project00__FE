export interface User {
  id: string;
  email: string;
  userName: string;
  displayName: string;
  avatarUrl: string;
  createdAt: string;
  lastUserNameChangedAt?: string | null;
  canChangeUserName?: boolean;
  nextUserNameChangeDate?: string | null;
}

export interface RegisterRequest {
  email: string;
  password: string;
  userName?: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  avatarUrl?: string;
  userName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RelationshipMilestone {
  name: string;
  minScore: number;
  maxScore: number;
  description: string;
  icon?: string;
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
  creatorUserName?: string;
  creatorAvatar?: string;
  defaultAffectionScore?: number;
  defaultMood?: string;
  customMilestones?: RelationshipMilestone[];
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
  defaultAffectionScore?: number;
  defaultMood?: string;
  customMilestones?: RelationshipMilestone[];
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
  defaultAffectionScore?: number;
  defaultMood?: string;
  customMilestones?: RelationshipMilestone[];
}

export interface GeneratedCharacterDto {
  name: string;
  title: string;
  category: string;
  personalityPrompt: string;
  greeting: string;
  tags: string[];
  defaultAffectionScore?: number;
  defaultMood?: string;
  customMilestones?: RelationshipMilestone[];
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
  affectionScore: number;
  relationshipLevel: number;
  currentMood?: string;
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
  affectionScore?: number;
  relationshipLevel?: number;
}

export interface SendMessageResponse {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  affectionScore: number;
  relationshipLevel: number;
  currentMood: string;
  affectionDelta: number;
  levelUp: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  errors: string[];
}
