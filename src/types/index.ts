export type AIProvider = 'gemini' | 'openai' | 'claude' | 'deepseek' | 'custom';

export interface ModelInfo {
  id: string;
  name: string;
  provider: AIProvider;
  contextWindow: string;
  speed: 'Ultra' | 'Fast' | 'Balanced' | 'Deep Reasoning';
  description: string;
  capabilities: string[];
}

export interface UserApiKeyConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl?: string;
  selectedModel: string;
  status: 'untested' | 'verified' | 'failed';
  latencyMs?: number;
  lastTested?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  provider?: AIProvider;
  model?: string;
  groundingSources?: Array<{ title: string; url: string }>;
  tokenEstimate?: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  provider: AIProvider;
  model: string;
  isPinned?: boolean;
  systemPrompt?: string;
  agentId?: string;
}

export interface MemoryRecord {
  id: string;
  category: 'preference' | 'personal_context' | 'project_rule' | 'technical_constraint';
  content: string;
  createdAt: number;
  isActive: boolean;
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  avatarIcon: string;
  color: string;
  description: string;
  systemInstruction: string;
  defaultModel: string;
  defaultProvider: AIProvider;
  temperature: number;
  tools: string[];
  isBuiltIn?: boolean;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  fileType: string;
  chunkCount: number;
  content: string;
  uploadedAt: number;
  tags: string[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  actionType: 'prompt' | 'code_review' | 'summarize' | 'search';
  model: string;
  instruction: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  output?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  lastRun?: number;
}

export interface AnalyticsRecord {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  queriesCount: number;
  estimatedCostUsd: number;
  providerBreakdown: Record<AIProvider, number>;
}
