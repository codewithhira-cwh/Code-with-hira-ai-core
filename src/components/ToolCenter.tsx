import React, { useState } from 'react';
import {
  Wrench,
  FileJson,
  FileText,
  Languages,
  Sparkles,
  Search,
  Check,
  Copy,
  Sliders,
  Volume2,
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';
import { streamChatCompletion } from '../services/apiService';
import { storage } from '../services/storage';
import { sounds } from '../services/soundEffects';
import { AIProvider } from '../types';

interface ToolCenterProps {
  activeProvider: AIProvider;
  activeModel: string;
}

export const ToolCenter: React.FC<ToolCenterProps> = ({ activeProvider, activeModel }) => {
  const [activeTool, setActiveTool] = useState<'summarizer' | 'json' | 'translator' | 'vision'>('summarizer');

  // Summarizer state
  const [summaryInput, setSummaryInput] = useState(
    'CODEWITHHIRA AI CORE is an autonomous personal API-powered multi-model ecosystem designed by Hiralal Kumar. It provides user-isolated memory, real-time 3D Three.js universe visualization, customizable autonomous agents, a side-by-side benchmark arena, encrypted credentials management, and high-performance streaming with Google Gemini, OpenAI, Claude, and DeepSeek.'
  );
  const [summaryResult, setSummaryResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // JSON Formatter state
  const [jsonInput, setJsonInput] = useState('{"project":"CODEWITHHIRA AI CORE","version":"2.0","modules":["AI Engine","3D Universe","Memory","Agents","Vault"],"status":"active"}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Translator state
  const [transInput, setTransInput] = useState('Quantum Core status is fully operational. Neural link established.');
  const [transTarget, setTransTarget] = useState('Japanese');
  const [transResult, setTransResult] = useState('');

  // Vision Prompt state
  const [visionPrompt, setVisionPrompt] = useState('Describe the holographic quantum core interface in high-tech sci-fi detail.');
  const [visionResult, setVisionResult] = useState('');

  const [copied, setCopied] = useState(false);

  // Run Summarizer
  const handleRunSummarizer = async () => {
    if (!summaryInput.trim() || isProcessing) return;
    sounds.playCorePulse();
    setIsProcessing(true);
    setSummaryResult('');

    const configs = storage.getApiConfigs();
    let acc = '';

    await streamChatCompletion({
      messages: [
        {
          id: '1',
          role: 'user',
          content: `Extract executive bullet points and key takeaways from the following text:\n\n${summaryInput}`,
          timestamp: Date.now()
        }
      ],
      provider: activeProvider,
      model: activeModel,
      apiKey: configs[activeProvider]?.apiKey,
      baseUrl: configs[activeProvider]?.baseUrl,
      onDelta: (chunk) => {
        acc += chunk;
        setSummaryResult(acc);
      },
      onError: (err) => {
        setIsProcessing(false);
        setSummaryResult(`Error: ${err}`);
      },
      onDone: () => {
        setIsProcessing(false);
        sounds.playSuccess();
      }
    });
  };

  // Run JSON Formatter
  const handleFormatJson = (minify = false) => {
    sounds.playClick();
    setJsonError(null);
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, minify ? 0 : 2));
      sounds.playSuccess();
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    }
  };

  // Run Translator
  const handleRunTranslator = async () => {
    if (!transInput.trim() || isProcessing) return;
    sounds.playClick();
    setIsProcessing(true);
    setTransResult('');

    const configs = storage.getApiConfigs();
    let acc = '';

    await streamChatCompletion({
      messages: [
        {
          id: '1',
          role: 'user',
          content: `Translate the following text into ${transTarget} accurately with natural tone:\n\n"${transInput}"`,
          timestamp: Date.now()
        }
      ],
      provider: activeProvider,
      model: activeModel,
      apiKey: configs[activeProvider]?.apiKey,
      baseUrl: configs[activeProvider]?.baseUrl,
      onDelta: (chunk) => {
        acc += chunk;
        setTransResult(acc);
      },
      onError: (err) => {
        setIsProcessing(false);
        setTransResult(`Error: ${err}`);
      },
      onDone: () => {
        setIsProcessing(false);
        sounds.playSuccess();
      }
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    sounds.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] mt-16 p-4 sm:p-6 overflow-y-auto bg-[#05050b]/90">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950/70 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="w-5 h-5 text-cyan-400" />
              <h1 className="font-orbitron font-bold text-lg sm:text-xl text-white tracking-wider">
                AI TOOL MATRIX & WORKSPACE UTILITIES
              </h1>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-700/60">
                MULTI-UTILITY SUITE
              </span>
            </div>
            <p className="text-xs text-slate-300 font-rajdhani">
              Specialized neural micro-tools for data transformation, semantic synthesis, translation, and structured data analysis.
            </p>
          </div>

          {/* Tool selector buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'summarizer', label: 'Summarizer', icon: FileText },
              { id: 'json', label: 'JSON Formatter', icon: FileJson },
              { id: 'translator', label: 'AI Translator', icon: Languages },
              { id: 'vision', label: 'Visual Analyzer', icon: ImageIcon }
            ].map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveTool(tool.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-chakra font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TOOL 1: SUMMARIZER */}
        {activeTool === 'summarizer' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="cyber-panel p-4 rounded-xl space-y-3 border-indigo-950">
              <label className="text-xs font-mono-code text-cyan-400 flex items-center justify-between">
                <span>INPUT CORPUS TO CONDENSE</span>
                <span className="text-slate-500 text-[10px]">{summaryInput.length} chars</span>
              </label>
              <textarea
                rows={9}
                value={summaryInput}
                onChange={(e) => setSummaryInput(e.target.value)}
                placeholder="Paste long text, article, or documentation..."
                className="w-full bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-rajdhani focus:outline-none focus:border-cyan-400 resize-none"
              />
              <button
                onClick={handleRunSummarizer}
                disabled={isProcessing}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-chakra text-xs font-semibold flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Synthesizing Key Takeaways...' : 'Generate Executive Summary'}</span>
              </button>
            </div>

            <div className="cyber-panel p-4 rounded-xl flex flex-col justify-between border-indigo-950">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono-code text-purple-400">EXECUTIVE SUMMARY OUTPUT</span>
                  {summaryResult && (
                    <button
                      onClick={() => handleCopy(summaryResult)}
                      className="text-[10px] font-chakra text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <div className="p-3 bg-slate-900/70 rounded-lg min-h-[200px] max-h-[320px] overflow-y-auto text-xs font-rajdhani text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {summaryResult || <span className="text-slate-600 italic">Summary output will appear here...</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 2: JSON FORMATTER */}
        {activeTool === 'json' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFormatJson(false)}
                className="px-3.5 py-1.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-chakra font-semibold cursor-pointer"
              >
                Prettify JSON (2-Spaces)
              </button>
              <button
                onClick={() => handleFormatJson(true)}
                className="px-3.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-xs font-chakra cursor-pointer"
              >
                Minify JSON
              </button>
              {jsonError && (
                <span className="text-xs font-mono-code text-red-400 pl-2">⚠️ {jsonError}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="cyber-panel p-4 rounded-xl border-indigo-950">
                <span className="text-xs font-mono-code text-slate-400 block mb-2">RAW JSON INPUT</span>
                <textarea
                  rows={14}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="cyber-panel p-4 rounded-xl border-indigo-950 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono-code text-cyan-400">FORMATTED JSON OUTPUT</span>
                    {jsonOutput && (
                      <button
                        onClick={() => handleCopy(jsonOutput)}
                        className="text-[10px] font-chakra text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                  <textarea
                    readOnly
                    rows={14}
                    value={jsonOutput}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs font-mono-code text-cyan-200 focus:outline-none resize-none"
                    placeholder="Click 'Prettify JSON' to view formatted structure..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 3: AI TRANSLATOR */}
        {activeTool === 'translator' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="cyber-panel p-4 rounded-xl space-y-3 border-indigo-950">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code text-cyan-400">SOURCE TRANSMISSION</span>
                <select
                  value={transTarget}
                  onChange={(e) => setTransTarget(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-purple-300 font-chakra cursor-pointer"
                >
                  <option value="Japanese">Target: Japanese</option>
                  <option value="Hindi">Target: Hindi</option>
                  <option value="Spanish">Target: Spanish</option>
                  <option value="German">Target: German</option>
                  <option value="French">Target: French</option>
                  <option value="Cyber-Technical Sci-Fi">Target: Cyber-Technical</option>
                </select>
              </div>

              <textarea
                rows={8}
                value={transInput}
                onChange={(e) => setTransInput(e.target.value)}
                placeholder="Type text to translate..."
                className="w-full bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-rajdhani focus:outline-none focus:border-cyan-400 resize-none"
              />

              <button
                onClick={handleRunTranslator}
                disabled={isProcessing}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-chakra text-xs font-semibold flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-40"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Translating...' : `Translate to ${transTarget}`}</span>
              </button>
            </div>

            <div className="cyber-panel p-4 rounded-xl flex flex-col justify-between border-indigo-950">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono-code text-purple-400">
                    TRANSLATED RESULT ({transTarget.toUpperCase()})
                  </span>
                  {transResult && (
                    <button
                      onClick={() => handleCopy(transResult)}
                      className="text-[10px] font-chakra text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <div className="p-3 bg-slate-900/70 rounded-lg min-h-[190px] text-xs font-rajdhani text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {transResult || <span className="text-slate-600 italic">Translation output will appear here...</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 4: VISUAL ANALYZER */}
        {activeTool === 'vision' && (
          <div className="cyber-panel p-5 rounded-xl space-y-4 border-indigo-950">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-cyan-400" />
              <h3 className="font-chakra font-bold text-sm text-white">
                MULTIMODAL VISION & SCENE INTELLIGENCE
              </h3>
            </div>
            <p className="text-xs text-slate-300 font-rajdhani">
              Google Gemini multimodal engine supports high-fidelity visual description, optical document reading, diagram decoding, and UI wireframe analysis.
            </p>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-indigo-900/60 space-y-3">
              <span className="text-xs font-mono-code text-cyan-400">VISUAL PROMPT ANALYZER</span>
              <input
                type="text"
                value={visionPrompt}
                onChange={(e) => setVisionPrompt(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono-code text-slate-400">
                  IMAGE INPUT: Attach images via the Neural Chat composer or analyze scene geometry.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
