import { AIAgent, AIProvider, AnalyticsRecord, Conversation, KnowledgeDocument, MemoryRecord, UserApiKeyConfig, Workflow } from '../types';

const KEYS = {
  API_CONFIGS: 'cwh_api_configs_v2',
  CONVERSATIONS: 'cwh_conversations_v2',
  ACTIVE_CONVERSATION_ID: 'cwh_active_conversation_v2',
  MEMORIES: 'cwh_memories_v2',
  AGENTS: 'cwh_agents_v2',
  DOCUMENTS: 'cwh_knowledge_docs_v2',
  WORKFLOWS: 'cwh_workflows_v2',
  ANALYTICS: 'cwh_analytics_v2',
  USER_PROFILE: 'cwh_user_profile_v2'
};

// Initial built-in agents
export const DEFAULT_AGENTS: AIAgent[] = [
  {
    id: 'agent-core-architect',
    name: 'Nexus Core Architect',
    role: 'Full-Stack Systems Architect',
    avatarIcon: 'Cpu',
    color: '#00f0ff',
    description: 'Specializes in high-performance distributed systems, Three.js, WebGL, algorithms, and clean architecture.',
    systemInstruction: 'You are the Nexus Core Architect, an elite sci-fi AI specialized in full-stack engineering, performance optimization, scalable cloud infrastructure, and modern software design. Provide clear, precise, production-grade code with deep technical insights.',
    defaultModel: 'gemini-3.8-flash',
    defaultProvider: 'gemini',
    temperature: 0.5,
    tools: ['Code Execution', 'Web Search', 'Memory Vault'],
    isBuiltIn: true
  },
  {
    id: 'agent-quantum-researcher',
    name: 'Quantum Researcher',
    role: 'Deep Intelligence & Science Analyst',
    avatarIcon: 'Atom',
    color: '#a855f7',
    description: 'Expert in scientific research, quantum theory, literature synthesis, and complex mathematical proofs.',
    systemInstruction: 'You are the Quantum Research Agent within CODEWITHHIRA AI CORE. Analyze questions with mathematical rigor, synthesize deep multi-domain evidence, cite key logical steps, and explain complex phenomena with crystalline clarity.',
    defaultModel: 'gemini-3.8-pro',
    defaultProvider: 'gemini',
    temperature: 0.3,
    tools: ['Deep Reasoning', 'Web Search Grounding', 'Document Intelligence'],
    isBuiltIn: true
  },
  {
    id: 'agent-cyber-sentinel',
    name: 'Cyber Sentinel',
    role: 'Security & Vulnerability Hunter',
    avatarIcon: 'ShieldAlert',
    color: '#3b82f6',
    description: 'Focuses on application security, OWASP vulnerabilities, encryption protocols, and threat mitigation.',
    systemInstruction: 'You are the Cyber Sentinel security agent. Your mission is to audit codebases, find potential zero-days, harden cryptographic configurations, prevent SSRF/XSS/injection, and formulate threat models.',
    defaultModel: 'gemini-3.8-flash',
    defaultProvider: 'gemini',
    temperature: 0.4,
    tools: ['Security Audit', 'Code Review'],
    isBuiltIn: true
  },
  {
    id: 'agent-content-alchemist',
    name: 'Content Alchemist',
    role: 'Creative Director & Technical Writer',
    avatarIcon: 'Sparkles',
    color: '#ec4899',
    description: 'Crafts cinematic narratives, documentation, marketing copy, and thought leadership articles.',
    systemInstruction: 'You are the Content Alchemist. Transform raw concepts into compelling technical documentation, sci-fi world-building narratives, and crisp communications with cinematic tone.',
    defaultModel: 'gemini-3.8-flash',
    defaultProvider: 'gemini',
    temperature: 0.8,
    tools: ['Creative Writing', 'Prompt Enhancer'],
    isBuiltIn: true
  }
];

export const storage = {
  // API Configurations
  getApiConfigs: (): Record<string, UserApiKeyConfig> => {
    try {
      const data = localStorage.getItem(KEYS.API_CONFIGS);
      if (data) return JSON.parse(data);
    } catch {}
    return {
      gemini: { provider: 'gemini', apiKey: '', selectedModel: 'gemini-3.8-flash', status: 'verified' },
      openai: { provider: 'openai', apiKey: '', selectedModel: 'gpt-4o', status: 'untested' },
      claude: { provider: 'claude', apiKey: '', selectedModel: 'claude-3-7-sonnet', status: 'untested' },
      deepseek: { provider: 'deepseek', apiKey: '', selectedModel: 'deepseek-chat', status: 'untested' },
      custom: { provider: 'custom', apiKey: '', baseUrl: 'http://localhost:11434/v1', selectedModel: 'custom-model', status: 'untested' }
    };
  },

  saveApiConfig: (provider: string, config: UserApiKeyConfig) => {
    const current = storage.getApiConfigs();
    current[provider] = config;
    localStorage.setItem(KEYS.API_CONFIGS, JSON.stringify(current));
  },

  // Conversations
  getConversations: (): Conversation[] => {
    try {
      const data = localStorage.getItem(KEYS.CONVERSATIONS);
      if (data) return JSON.parse(data);
    } catch {}
    return [
      {
        id: 'conv-init-1',
        title: 'Quantum Core Initialization',
        createdAt: Date.now() - 3600000,
        updatedAt: Date.now() - 3600000,
        provider: 'gemini',
        model: 'gemini-3.8-flash',
        messages: [
          {
            id: 'm1',
            role: 'assistant',
            content: 'Greetings. I am the CODEWITHHIRA AI CORE, online and fully synchronized with your multi-model neural mesh. How may we advance your technological frontiers today?',
            timestamp: Date.now() - 3600000,
            provider: 'gemini',
            model: 'gemini-3.8-flash'
          }
        ]
      }
    ];
  },

  saveConversations: (conversations: Conversation[]) => {
    localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(conversations));
  },

  // Memories
  getMemories: (): MemoryRecord[] => {
    try {
      const data = localStorage.getItem(KEYS.MEMORIES);
      if (data) return JSON.parse(data);
    } catch {}
    return [
      {
        id: 'mem-1',
        category: 'project_rule',
        content: 'Project owner and founder is Hiralal Kumar (CODEWITHHIRA). Always respect architectural modularity and high performance standards.',
        createdAt: Date.now() - 86400000,
        isActive: true
      },
      {
        id: 'mem-2',
        category: 'preference',
        content: 'Prefers TypeScript, clean architectural decomposition, responsive UI, and cinematic sci-fi aesthetics.',
        createdAt: Date.now() - 43200000,
        isActive: true
      }
    ];
  },

  saveMemories: (memories: MemoryRecord[]) => {
    localStorage.setItem(KEYS.MEMORIES, JSON.stringify(memories));
  },

  // Agents
  getAgents: (): AIAgent[] => {
    try {
      const data = localStorage.getItem(KEYS.AGENTS);
      if (data) return JSON.parse(data);
    } catch {}
    return DEFAULT_AGENTS;
  },

  saveAgents: (agents: AIAgent[]) => {
    localStorage.setItem(KEYS.AGENTS, JSON.stringify(agents));
  },

  // Knowledge Documents
  getDocuments: (): KnowledgeDocument[] => {
    try {
      const data = localStorage.getItem(KEYS.DOCUMENTS);
      if (data) return JSON.parse(data);
    } catch {}
    return [
      {
        id: 'doc-1',
        title: 'CODEWITHHIRA_AI_CORE_Specification_V2.0.md',
        fileType: 'markdown',
        chunkCount: 14,
        content: 'CODEWITHHIRA AI CORE is a personal API-powered multi-model ecosystem created by Hiralal Kumar. It supports multi-provider routing, memory engine, custom agents, coding workspace, and real-time 3D universe visual interface.',
        uploadedAt: Date.now() - 120000,
        tags: ['architecture', 'v2.0', 'blueprint']
      }
    ];
  },

  saveDocuments: (docs: KnowledgeDocument[]) => {
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
  },

  // Analytics
  getAnalytics: (): AnalyticsRecord => {
    try {
      const data = localStorage.getItem(KEYS.ANALYTICS);
      if (data) return JSON.parse(data);
    } catch {}
    return {
      totalTokens: 148200,
      promptTokens: 48900,
      completionTokens: 99300,
      queriesCount: 84,
      estimatedCostUsd: 0.0224,
      providerBreakdown: {
        gemini: 62,
        openai: 12,
        claude: 6,
        deepseek: 4,
        custom: 0
      }
    };
  },

  recordUsage: (tokens: number, provider: string) => {
    const current = storage.getAnalytics();
    current.totalTokens += tokens;
    current.completionTokens += Math.round(tokens * 0.7);
    current.promptTokens += Math.round(tokens * 0.3);
    current.queriesCount += 1;
    current.estimatedCostUsd += (tokens / 1000000) * 0.15;
    const provKey = provider as AIProvider;
    if (Object.prototype.hasOwnProperty.call(current.providerBreakdown, provKey)) {
      current.providerBreakdown[provKey] = (current.providerBreakdown[provKey] || 0) + 1;
    }
    localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(current));
  }
};
