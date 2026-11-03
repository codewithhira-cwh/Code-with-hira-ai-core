import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  StopCircle,
  RotateCcw,
  Copy,
  Check,
  Globe,
  Sliders,
  Sparkles,
  Trash2,
  Plus,
  Pin,
  Download,
  Search,
  Mic,
  MicOff,
  Volume2,
  Bot,
  User,
  ExternalLink,
  ChevronRight,
  Code2,
  FileText
} from 'lucide-react';
import { streamChatCompletion, VERIFIED_MODELS } from '../services/apiService';
import { storage } from '../services/storage';
import { sounds } from '../services/soundEffects';
import { AIProvider, ChatMessage, Conversation } from '../types';

interface ChatWorkspaceProps {
  activeProvider: AIProvider;
  setActiveProvider: (p: AIProvider) => void;
  activeModel: string;
  setActiveModel: (m: string) => void;
  onOpenApiVault: () => void;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  activeProvider,
  setActiveProvider,
  activeModel,
  setActiveModel,
  onOpenApiVault
}) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => storage.getConversations());
  const [activeConvId, setActiveConvId] = useState<string>(() => conversations[0]?.id || 'conv-1');
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [systemPersonality, setSystemPersonality] = useState('Nexus Core Architect');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];

  // System prompt templates
  const PERSONALITIES: Record<string, string> = {
    'Nexus Core Architect':
      'You are the CODEWITHHIRA AI CORE, an elite multi-model artificial intelligence engineered by Hiralal Kumar (CODEWITHHIRA). Provide modular, secure, high-performance answers with clean syntax highlighting and deep technical precision.',
    'Cyberpunk Specialist':
      'You are a razor-sharp cybernetics and security AI in a high-tech sci-fi future. Deliver technical breakdowns, code auditing, and futuristic systems design with punchy directness.',
    'Quantum Researcher':
      'You are an advanced scientific research mind specializing in deep algorithmic analysis, mathematical proofs, and peer-reviewed rigor. Explain complex phenomena with structured logic.',
    'Senior Full-Stack Mentor':
      'You are an empathetic, senior principal engineer. Write clear, maintainable, production-ready code with step-by-step explanations, tests, and architectural best practices.'
  };

  useEffect(() => {
    storage.saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, isGenerating]);

  // Handle New Chat
  const handleNewChat = () => {
    sounds.playClick();
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Neural Dialogue',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      provider: activeProvider,
      model: activeModel,
      systemPrompt: PERSONALITIES[systemPersonality],
      messages: [
        {
          id: `m-${Date.now()}`,
          role: 'assistant',
          content: `Initialized session with **${activeModel}** via **${activeProvider.toUpperCase()}**.\nHow may I assist your engineering and creative frontiers?`,
          timestamp: Date.now(),
          provider: activeProvider,
          model: activeModel
        }
      ]
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newConv.id);
  };

  // Delete Conversation
  const handleDeleteConv = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    const remaining = conversations.filter((c) => c.id !== id);
    if (remaining.length === 0) {
      handleNewChat();
    } else {
      setConversations(remaining);
      if (activeConvId === id) {
        setActiveConvId(remaining[0].id);
      }
    }
  };

  // Pin Conversation
  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    setConversations(
      conversations.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  // Send Message & Stream
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputMessage).trim();
    if (!textToSend || isGenerating) return;

    sounds.playClick(900);
    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now()
    };

    const assistantMsgId = `asst-${Date.now() + 1}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      provider: activeProvider,
      model: activeModel
    };

    // Update conversation with user message and empty assistant message
    const updatedMessages = [...(currentConversation?.messages || []), userMsg, initialAssistantMsg];
    const isFirstUserMsg = (currentConversation?.messages || []).filter((m) => m.role === 'user').length === 0;
    const title = isFirstUserMsg ? textToSend.slice(0, 32) + (textToSend.length > 32 ? '...' : '') : currentConversation.title;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              title,
              updatedAt: Date.now(),
              provider: activeProvider,
              model: activeModel,
              messages: updatedMessages
            }
          : c
      )
    );

    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    // Retrieve user's configured API key for the current provider
    const configs = storage.getApiConfigs();
    const activeConfig = configs[activeProvider];
    const apiKey = activeConfig?.apiKey;
    const baseUrl = activeConfig?.baseUrl;

    let streamedAccumulator = '';
    const groundingSources: Array<{ title: string; url: string }> = [];

    await streamChatCompletion({
      messages: updatedMessages.slice(0, -1), // exclude the empty pending message
      provider: activeProvider,
      model: activeModel,
      apiKey,
      baseUrl,
      systemInstruction: PERSONALITIES[systemPersonality],
      webSearch: webSearchEnabled,
      signal: abortControllerRef.current.signal,
      onDelta: (chunk) => {
        streamedAccumulator += chunk;
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: streamedAccumulator } : m
                  )
                }
              : c
          )
        );
      },
      onGrounding: (grounding) => {
        if (grounding?.groundingChunks) {
          grounding.groundingChunks.forEach((chunk: any) => {
            if (chunk.web?.uri) {
              groundingSources.push({
                title: chunk.web.title || new URL(chunk.web.uri).hostname,
                url: chunk.web.uri
              });
            }
          });
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConvId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMsgId ? { ...m, groundingSources } : m
                    )
                  }
                : c
            )
          );
        }
      },
      onError: (err) => {
        setIsGenerating(false);
        sounds.playClick(400);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content:
                            streamedAccumulator ||
                            `⚠️ **Neural Link Alert**: ${err}\n\nPlease check your personal API key in the [API Vault] or ensure provider connectivity.`
                        }
                      : m
                  )
                }
              : c
          )
        );
      },
      onDone: () => {
        setIsGenerating(false);
        sounds.playSuccess();
        const tokensEst = Math.round((streamedAccumulator.length + textToSend.length) * 0.35);
        storage.recordUsage(tokensEst, activeProvider);
      }
    });
  };

  // Stop Generation
  const handleStopGeneration = () => {
    sounds.playClick();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
  };

  // Regenerate Response
  const handleRegenerate = () => {
    if (isGenerating || !currentConversation) return;
    const msgs = currentConversation.messages;
    const lastUserIdx = msgs.map((m) => m.role).lastIndexOf('user');
    if (lastUserIdx !== -1) {
      const lastUserPrompt = msgs[lastUserIdx].content;
      // Truncate messages to just before last user message
      const truncated = msgs.slice(0, lastUserIdx);
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, messages: truncated } : c))
      );
      handleSendMessage(lastUserPrompt);
    }
  };

  // Copy to Clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    sounds.playClick();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Text to Speech
  const handleSpeak = (text: string) => {
    sounds.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#`_]/g, ''));
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Web Speech STT Voice input
  const handleToggleVoiceInput = () => {
    sounds.playClick();
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Export Chat
  const handleExportChat = (format: 'markdown' | 'json') => {
    sounds.playClick();
    if (!currentConversation) return;

    let content = '';
    let filename = `${currentConversation.title.toLowerCase().replace(/\s+/g, '_')}`;

    if (format === 'markdown') {
      filename += '.md';
      content = `# ${currentConversation.title}\n\nDate: ${new Date(currentConversation.createdAt).toLocaleString()}\nProvider: ${currentConversation.provider}\nModel: ${currentConversation.model}\n\n---\n\n`;
      currentConversation.messages.forEach((m) => {
        content += `### ${m.role === 'user' ? 'User' : 'CODEWITHHIRA AI CORE'}\n\n${m.content}\n\n`;
      });
    } else {
      filename += '.json';
      content = JSON.stringify(currentConversation, null, 2);
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] mt-16 flex overflow-hidden bg-[#05050b]/90">
      {/* Sidebar - Conversation History */}
      <aside className="hidden md:flex flex-col w-72 lg:w-80 bg-[#070817]/95 border-r border-indigo-950/60 p-3">
        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-cyan-500/20 via-indigo-600/30 to-purple-600/20 border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 font-chakra text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)] mb-3"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>NEW NEURAL THREAD</span>
        </button>

        {/* Search Bar */}
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search dialogue archives..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md bg-slate-900/60 border border-slate-800 text-xs font-rajdhani text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {filteredConversations.map((conv) => {
            const isActive = conv.id === activeConvId;
            return (
              <div
                key={conv.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveConvId(conv.id);
                }}
                className={`group relative p-2.5 rounded-lg flex items-center justify-between text-left cursor-pointer transition-all ${
                  isActive
                    ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.1)]'
                    : 'hover:bg-slate-900/50 text-slate-400 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {conv.isPinned ? (
                    <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                  <span className="text-xs font-chakra truncate">{conv.title}</span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleTogglePin(conv.id, e)}
                    className="p-1 text-slate-400 hover:text-amber-400"
                    title={conv.isPinned ? 'Unpin' : 'Pin to top'}
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteConv(conv.id, e)}
                    className="p-1 text-slate-400 hover:text-red-400"
                    title="Delete thread"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Link to API Vault */}
        <div className="pt-2 border-t border-slate-800/80 mt-2">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenApiVault();
            }}
            className="w-full py-1.5 px-2.5 rounded bg-slate-900/40 border border-indigo-900/40 hover:border-cyan-500/50 text-[11px] font-mono-code text-indigo-300 flex items-center justify-between transition-colors"
          >
            <span>API KEYS & ENDPOINTS</span>
            <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </aside>

      {/* Main Chat Deck */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#05050b]/60">
        {/* Chat Deck Header Controls */}
        <div className="h-14 border-b border-indigo-950/60 px-4 flex items-center justify-between gap-3 bg-[#070817]/70 backdrop-blur-md">
          {/* Provider & Model Selectors */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {/* Provider Selector */}
            <select
              value={activeProvider}
              onChange={(e) => {
                const prov = e.target.value as AIProvider;
                sounds.playClick();
                setActiveProvider(prov);
                setActiveModel(VERIFIED_MODELS[prov][0].id);
              }}
              className="bg-slate-900 border border-indigo-800/60 rounded px-2.5 py-1 text-xs font-chakra text-cyan-400 focus:outline-none focus:border-cyan-400 uppercase cursor-pointer"
            >
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI</option>
              <option value="claude">Anthropic Claude</option>
              <option value="deepseek">DeepSeek AI</option>
              <option value="custom">Custom Endpoint</option>
            </select>

            {/* Model Selector */}
            <select
              value={activeModel}
              onChange={(e) => {
                sounds.playClick();
                setActiveModel(e.target.value);
              }}
              className="bg-slate-900 border border-indigo-800/60 rounded px-2.5 py-1 text-xs font-chakra text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {(VERIFIED_MODELS[activeProvider] || []).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.speed})
                </option>
              ))}
            </select>

            {/* System Personality Selector */}
            <select
              value={systemPersonality}
              onChange={(e) => {
                sounds.playClick();
                setSystemPersonality(e.target.value);
              }}
              className="hidden lg:block bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs font-chakra text-purple-300 focus:outline-none focus:border-purple-400 cursor-pointer"
              title="Select AI Personality Preset"
            >
              {Object.keys(PERSONALITIES).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Web Search Grounding Toggle */}
            <button
              onClick={() => {
                sounds.playClick();
                setWebSearchEnabled(!webSearchEnabled);
              }}
              className={`px-2.5 py-1 rounded text-xs font-chakra flex items-center gap-1.5 transition-all cursor-pointer ${
                webSearchEnabled
                  ? 'bg-cyan-950/70 border border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Ground responses with real-time Web Search"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Web Search</span>
            </button>

            {/* Export Menu */}
            <button
              onClick={() => handleExportChat('markdown')}
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
              title="Export Conversation as Markdown"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message Stream Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {currentConversation?.messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <div
                key={message.id}
                className={`flex gap-3 sm:gap-4 max-w-4xl mx-auto ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] sm:max-w-[78%] rounded-xl p-3.5 sm:p-4 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-900/40 border border-indigo-600/40 text-slate-100 shadow-md'
                      : 'cyber-panel text-slate-200 border-indigo-900/40 shadow-lg'
                  }`}
                >
                  {/* Meta Bar */}
                  <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400 mb-1.5 border-b border-slate-800/60 pb-1">
                    <span className="font-semibold text-cyan-400">
                      {isUser ? 'HUMAN OPERATOR' : `${message.provider?.toUpperCase() || 'CORE'} // ${message.model || ''}`}
                    </span>
                    <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* Render content */}
                  <div className="whitespace-pre-wrap break-words font-rajdhani font-normal text-sm sm:text-base leading-relaxed">
                    {message.content}
                  </div>

                  {/* Grounding Source Chips */}
                  {message.groundingSources && message.groundingSources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80">
                      <div className="text-[10px] font-mono-code text-cyan-400 mb-1 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> VERIFIED WEB CITATIONS:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {message.groundingSources.map((src, i) => (
                          <a
                            key={i}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-slate-900/80 border border-cyan-800/50 hover:border-cyan-400 text-cyan-300 flex items-center gap-1 transition-colors"
                          >
                            <span>{src.title}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Action Toolbar */}
                  {!isUser && message.content && (
                    <div className="mt-2.5 flex items-center gap-2 pt-1 border-t border-slate-800/60">
                      <button
                        onClick={() => handleCopy(message.id, message.content)}
                        className="text-[11px] font-chakra text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleSpeak(message.content)}
                        className="text-[11px] font-chakra text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Voice Read</span>
                      </button>

                      <button
                        onClick={handleRegenerate}
                        disabled={isGenerating}
                        className="text-[11px] font-chakra text-slate-400 hover:text-purple-300 flex items-center gap-1 transition-colors disabled:opacity-40"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Regenerate</span>
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-900/80 border border-indigo-700/60 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-indigo-300" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Console */}
        <div className="p-3 sm:p-4 border-t border-indigo-950/60 bg-[#070817]/90 backdrop-blur-md">
          <div className="max-w-4xl mx-auto space-y-2">
            {/* Quick Prompt Starters (when empty or new) */}
            {currentConversation?.messages.length <= 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  'Architect a high-performance 3D scene in Three.js',
                  'Compare Gemini 2.5 Flash vs GPT-4o vs Claude',
                  'Audit this secure authentication and API vault design',
                  'Generate a full-stack REST API with streaming SSE'
                ].map((starter, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(starter)}
                    className="text-[11px] font-rajdhani whitespace-nowrap px-2.5 py-1 rounded bg-slate-900/80 border border-indigo-900/60 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    ✨ {starter}
                  </button>
                ))}
              </div>
            )}

            <div className="relative flex items-end gap-2 bg-slate-900/70 border border-indigo-800/50 focus-within:border-cyan-400/80 rounded-xl p-2 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              {/* Voice Input Button */}
              <button
                onClick={handleToggleVoiceInput}
                className={`p-2 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse'
                    : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800'
                }`}
                title={isListening ? 'Stop Voice Recording' : 'Voice Input (STT)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text Input Area */}
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Ask CODEWITHHIRA AI CORE (${activeModel})... Press Enter to transmit`}
                rows={1}
                className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 font-rajdhani text-sm sm:text-base resize-none focus:outline-none min-h-[40px] max-h-36 py-2"
              />

              {/* Send or Stop Button */}
              {isGenerating ? (
                <button
                  onClick={handleStopGeneration}
                  className="p-2.5 rounded-lg bg-red-600/30 border border-red-500 text-red-300 hover:bg-red-600/50 transition-colors cursor-pointer"
                  title="Halt Generation Stream"
                >
                  <StopCircle className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  className="p-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)] cursor-pointer"
                  title="Transmit Prompt"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400 px-1">
              <span>ACTIVE: {activeModel} // LATENCY PROXY ACTIVE</span>
              <span>CODEWITHHIRA AI CORE © 2026</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
