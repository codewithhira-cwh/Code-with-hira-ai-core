import { AIProvider, ChatMessage, ModelInfo } from '../types';

export const VERIFIED_MODELS: Record<AIProvider, ModelInfo[]> = {
  gemini: [
    {
      id: 'gemini-3.8-flash',
      name: 'Gemini 3.8 Flash',
      provider: 'gemini',
      contextWindow: '1,000,000 tokens',
      speed: 'Ultra',
      description: 'Ultra-fast multimodal reasoning, coding, and high-throughput real-time assistant.',
      capabilities: ['Multimodal', 'Web Search Grounding', 'Code Execution', 'Function Calling']
    },
    {
      id: 'gemini-3.8-pro',
      name: 'Gemini 3.8 Pro',
      provider: 'gemini',
      contextWindow: '2,000,000 tokens',
      speed: 'Deep Reasoning',
      description: 'Advanced reasoning, complex system architecture, mathematics, and deep research.',
      capabilities: ['Multimodal', 'Deep Reasoning', 'Long Context', 'Web Search']
    }
  ],
  openai: [
    {
      id: 'gpt-4o',
      name: 'GPT-4o Omnimodel',
      provider: 'openai',
      contextWindow: '128,000 tokens',
      speed: 'Fast',
      description: 'Flagship multimodal high-intelligence model by OpenAI.',
      capabilities: ['Multimodal', 'Code', 'Complex Reasoning']
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      provider: 'openai',
      contextWindow: '128,000 tokens',
      speed: 'Ultra',
      description: 'Affordable, fast, intelligent mini model.',
      capabilities: ['Code', 'Conversation', 'Summarization']
    },
    {
      id: 'o1-preview',
      name: 'OpenAI o1 Reasoning',
      provider: 'openai',
      contextWindow: '128,000 tokens',
      speed: 'Deep Reasoning',
      description: 'Advanced chain-of-thought deliberate reasoning engine.',
      capabilities: ['Deliberate Reasoning', 'Complex Math', 'Algorithmic Optimization']
    }
  ],
  claude: [
    {
      id: 'claude-3-7-sonnet',
      name: 'Claude 3.7 Sonnet',
      provider: 'claude',
      contextWindow: '200,000 tokens',
      speed: 'Fast',
      description: 'Top-tier coding, creative writing, nuanced synthesis, and reasoning.',
      capabilities: ['Advanced Code', 'Refactoring', 'Long Context', 'System Prompts']
    },
    {
      id: 'claude-3-5-haiku',
      name: 'Claude 3.5 Haiku',
      provider: 'claude',
      contextWindow: '200,000 tokens',
      speed: 'Ultra',
      description: 'High-speed intelligence for lightweight workflows and queries.',
      capabilities: ['Rapid Response', 'Code Formatting']
    }
  ],
  deepseek: [
    {
      id: 'deepseek-chat',
      name: 'DeepSeek-V3 Chat',
      provider: 'deepseek',
      contextWindow: '64,000 tokens',
      speed: 'Ultra',
      description: 'High-performance open-architecture MoE model with exceptional coding power.',
      capabilities: ['General Chat', 'Code Generation', 'Cost Efficient']
    },
    {
      id: 'deepseek-reasoner',
      name: 'DeepSeek-R1 Reasoner',
      provider: 'deepseek',
      contextWindow: '64,000 tokens',
      speed: 'Deep Reasoning',
      description: 'Open reasoning model specializing in mathematical proofs and code verification.',
      capabilities: ['Chain of Thought', 'Mathematical Rigor']
    }
  ],
  custom: [
    {
      id: 'custom-model',
      name: 'Custom Endpoint Model',
      provider: 'custom',
      contextWindow: 'Variable',
      speed: 'Balanced',
      description: 'Connect any OpenAI-compatible custom inference server (Ollama, vLLM, LM Studio, etc.).',
      capabilities: ['Self-Hosted', 'Private Network', 'Custom Fine-Tuning']
    }
  ]
};

export async function testApiConnection(params: {
  provider: AIProvider;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}) {
  const resp = await fetch('/api/test-connection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return await resp.json();
}

export async function checkSystemHealth() {
  const resp = await fetch('/api/system/health');
  return await resp.json();
}

export async function streamChatCompletion({
  messages,
  provider,
  model,
  apiKey,
  baseUrl,
  systemInstruction,
  webSearch,
  onDelta,
  onGrounding,
  onError,
  onDone,
  signal
}: {
  messages: ChatMessage[];
  provider: AIProvider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  systemInstruction?: string;
  webSearch?: boolean;
  onDelta: (text: string) => void;
  onGrounding?: (grounding: any) => void;
  onError: (err: string) => void;
  onDone: (info: any) => void;
  signal?: AbortSignal;
}) {
  try {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        provider,
        model,
        apiKey,
        baseUrl,
        systemInstruction,
        webSearch
      }),
      signal
    });

    if (!response.ok) {
      const err = await response.text();
      onError(`Server error ${response.status}: ${err}`);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError('Response stream body unavailable');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || '';

      for (const part of parts) {
        const lines = part.split('\n');
        let currentEvent = 'message';
        let currentData = '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            currentData = line.slice(6).trim();
          }
        }

        if (currentData) {
          try {
            const parsed = JSON.parse(currentData);
            if (currentEvent === 'delta') {
              if (parsed.text) onDelta(parsed.text);
            } else if (currentEvent === 'grounding') {
              if (onGrounding) onGrounding(parsed.grounding);
            } else if (currentEvent === 'done') {
              onDone(parsed);
            } else if (currentEvent === 'error') {
              onError(parsed.error || 'Unknown error');
            }
          } catch {
            // raw string delta
            if (currentEvent === 'delta') onDelta(currentData);
          }
        }
      }
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      onDone({ aborted: true });
    } else {
      onError(err.message || 'Streaming failed');
    }
  }
}

export async function runMultiModelArena(prompt: string, modelConfigs: any[]) {
  const resp = await fetch('/api/arena/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, modelConfigs })
  });
  return await resp.json();
}

export function maskApiKey(key?: string): string {
  if (!key) return 'Not Configured';
  if (key.length <= 8) return '••••••••';
  return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
}
