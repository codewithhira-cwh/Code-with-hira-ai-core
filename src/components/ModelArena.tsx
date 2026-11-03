import React, { useState } from 'react';
import {
  Swords,
  Play,
  Clock,
  Coins,
  Cpu,
  ThumbsUp,
  RotateCcw,
  Check,
  Sparkles,
  Zap,
  Layers,
  Copy
} from 'lucide-react';
import { runMultiModelArena, VERIFIED_MODELS } from '../services/apiService';
import { storage } from '../services/storage';
import { sounds } from '../services/soundEffects';
import { AIProvider } from '../types';

export const ModelArena: React.FC = () => {
  const [prompt, setPrompt] = useState(
    'Evaluate the optimal architectural approach for building a real-time 3D universe with Three.js WebGL and multi-agent AI streaming.'
  );
  const [selectedModels, setSelectedModels] = useState<Array<{ id: string; provider: AIProvider; model: string }>>([
    { id: '1', provider: 'gemini', model: 'gemini-2.5-flash' },
    { id: '2', provider: 'gemini', model: 'gemini-2.5-pro' },
    { id: '3', provider: 'openai', model: 'gpt-4o' },
    { id: '4', provider: 'claude', model: 'claude-3-7-sonnet' }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleRunComparison = async () => {
    if (!prompt.trim() || isRunning) return;
    sounds.playCorePulse();
    setIsRunning(true);
    setResults([]);

    try {
      const configs = storage.getApiConfigs();
      const modelPayload = selectedModels.map((m) => ({
        id: `${m.provider}-${m.model}`,
        provider: m.provider,
        model: m.model,
        apiKey: configs[m.provider]?.apiKey
      }));

      const response = await runMultiModelArena(prompt, modelPayload);
      if (response && response.results) {
        setResults(response.results);
        sounds.playSuccess();
      }
    } catch (err: any) {
      console.error('Arena execution failed:', err);
      sounds.playClick(300);
    } finally {
      setIsRunning(false);
    }
  };

  const handleVote = (modelId: string) => {
    sounds.playClick(900);
    setVotes((prev) => ({
      ...prev,
      [modelId]: (prev[modelId] || 0) + 1
    }));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    sounds.playClick();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] mt-16 p-4 sm:p-6 overflow-y-auto bg-[#05050b]/90">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950/70 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Swords className="w-5 h-5 text-cyan-400" />
              <h1 className="font-orbitron font-bold text-lg sm:text-xl text-white tracking-wider">
                MULTI-MODEL ARENA
              </h1>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-700/60">
                BENCHMARK WORKSPACE
              </span>
            </div>
            <p className="text-xs text-slate-300 font-rajdhani">
              Transmit identical prompts in parallel to multiple AI architectures. Compare latency, token efficiency, reasoning depth, and cost.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunComparison}
              disabled={isRunning || !prompt.trim()}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-chakra font-bold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.35)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isRunning ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>PARALLEL INFERENCE ACTIVE...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>DISPATCH TO ALL MODELS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Prompt Input Box */}
        <div className="cyber-panel p-4 rounded-xl space-y-2">
          <label className="text-xs font-mono-code text-cyan-400 flex items-center justify-between">
            <span>BENCHMARK STIMULUS (TRANSMITTED SIMULTANEOUSLY)</span>
            <span className="text-slate-400 text-[11px]">{prompt.length} chars</span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
            className="w-full bg-slate-900/80 border border-indigo-900/60 rounded-lg p-3 text-slate-200 text-sm font-rajdhani focus:outline-none focus:border-cyan-400 resize-none"
            placeholder="Type your test prompt to compare multiple models simultaneously..."
          />

          {/* Quick Preset Prompts */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] font-mono-code text-slate-400">PRESETS:</span>
            {[
              'Explain Quantum Computing vs Classical Logic in 3 concise points',
              'Write a high-performance LRU Cache in TypeScript with tests',
              'Analyze the safety protocols of AGI autonomous workflows'
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(p)}
                className="text-[11px] font-rajdhani px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-slate-700 transition-colors"
              >
                {p.slice(0, 40)}...
              </button>
            ))}
          </div>
        </div>

        {/* Results Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedModels.map((slot, idx) => {
            const result = results.find((r) => r.id === `${slot.provider}-${slot.model}`) || results[idx];
            const voteCount = votes[`${slot.provider}-${slot.model}`] || 0;

            return (
              <div
                key={idx}
                className="cyber-panel rounded-xl flex flex-col justify-between overflow-hidden border-indigo-900/50 hover:border-cyan-500/40 transition-all shadow-lg"
              >
                {/* Model Header */}
                <div className="p-3 bg-slate-900/80 border-b border-indigo-950 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono-code uppercase text-cyan-400 block font-semibold">
                      {slot.provider}
                    </span>
                    <h3 className="text-xs font-chakra font-bold text-white tracking-wide">
                      {slot.model}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleVote(`${slot.provider}-${slot.model}`)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-purple-950/60 border border-purple-800/40 text-[10px] font-mono-code text-purple-300 hover:text-white hover:border-purple-500 transition-colors cursor-pointer"
                    title="Vote as superior answer"
                  >
                    <ThumbsUp className="w-3 h-3 text-purple-400" />
                    <span>{voteCount}</span>
                  </button>
                </div>

                {/* Metrics Bar */}
                <div className="px-3 py-1.5 bg-[#070817] border-b border-slate-800/60 flex items-center justify-between text-[10px] font-mono-code text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{result?.latencyMs ? `${result.latencyMs}ms` : '-- ms'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-purple-400" />
                    <span>{result?.tokenCount ? `${result.tokenCount} tk` : '-- tk'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-400" />
                    <span>{result?.costEst || '--'}</span>
                  </div>
                </div>

                {/* Response Text Body */}
                <div className="p-3.5 flex-1 min-h-[220px] max-h-[360px] overflow-y-auto text-xs font-rajdhani text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {isRunning ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                      <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[11px] font-mono-code">Synthesizing...</span>
                    </div>
                  ) : result?.text ? (
                    result.text
                  ) : (
                    <span className="text-slate-600 italic">
                      Click "DISPATCH TO ALL MODELS" to stream comparative responses.
                    </span>
                  )}
                </div>

                {/* Card Footer */}
                {result?.text && (
                  <div className="p-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => handleCopy(`${slot.provider}-${slot.model}`, result.text)}
                      className="text-[10px] font-chakra text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      {copiedId === `${slot.provider}-${slot.model}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Output</span>
                        </>
                      )}
                    </button>
                    <span className="text-[9px] font-mono-code text-cyan-500/80">VERIFIED OUTPUT</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
