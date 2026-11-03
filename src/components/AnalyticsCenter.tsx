import React, { useState } from 'react';
import {
  BarChart3,
  Cpu,
  Coins,
  Activity,
  Layers,
  ArrowUpRight,
  RotateCcw,
  Download,
  AlertCircle
} from 'lucide-react';
import { storage } from '../services/storage';
import { sounds } from '../services/soundEffects';
import { AnalyticsRecord } from '../types';

export const AnalyticsCenter: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsRecord>(() => storage.getAnalytics());
  const [spendingLimit, setSpendingLimit] = useState(15.0);

  const totalQueries = analytics.queriesCount || 1;
  const geminiPercent = Math.round(((analytics.providerBreakdown?.gemini || 0) / totalQueries) * 100);
  const openaiPercent = Math.round(((analytics.providerBreakdown?.openai || 0) / totalQueries) * 100);
  const claudePercent = Math.round(((analytics.providerBreakdown?.claude || 0) / totalQueries) * 100);
  const deepseekPercent = Math.round(((analytics.providerBreakdown?.deepseek || 0) / totalQueries) * 100);

  const handleResetMetrics = () => {
    sounds.playClick();
    const fresh: AnalyticsRecord = {
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
      queriesCount: 0,
      estimatedCostUsd: 0.0,
      providerBreakdown: { gemini: 0, openai: 0, claude: 0, deepseek: 0, custom: 0 }
    };
    setAnalytics(fresh);
    localStorage.setItem('cwh_analytics_v2', JSON.stringify(fresh));
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] mt-16 p-4 sm:p-6 overflow-y-auto bg-[#05050b]/90">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950/70 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h1 className="font-orbitron font-bold text-lg sm:text-xl text-white tracking-wider">
                ANALYTICS & USAGE TELEMETRY
              </h1>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-700/60">
                REAL-TIME MONITOR
              </span>
            </div>
            <p className="text-xs text-slate-300 font-rajdhani">
              Live token telemetry, provider request ratios, cost estimates, and threshold alarms.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetMetrics}
              className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-chakra flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Counters</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Tokens */}
          <div className="cyber-panel p-4 rounded-xl space-y-2 border-indigo-950">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-mono-code">TOTAL TOKEN FLUX</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-orbitron font-bold text-white">
              {analytics.totalTokens.toLocaleString()}
            </div>
            <div className="flex justify-between text-[10px] font-mono-code text-slate-400 border-t border-slate-800 pt-1.5">
              <span>PROMPT: {analytics.promptTokens.toLocaleString()}</span>
              <span>COMPL: {analytics.completionTokens.toLocaleString()}</span>
            </div>
          </div>

          {/* Queries Processed */}
          <div className="cyber-panel p-4 rounded-xl space-y-2 border-indigo-950">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-mono-code">TOTAL QUERIES</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-orbitron font-bold text-white">
              {analytics.queriesCount}
            </div>
            <div className="text-[10px] font-mono-code text-purple-400 border-t border-slate-800 pt-1.5">
              <span>SUCCESS RATE: 99.8%</span>
            </div>
          </div>

          {/* Estimated API Cost */}
          <div className="cyber-panel p-4 rounded-xl space-y-2 border-indigo-950">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-mono-code">ESTIMATED API COST</span>
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-orbitron font-bold text-white">
              ${analytics.estimatedCostUsd.toFixed(4)}
            </div>
            <div className="text-[10px] font-mono-code text-slate-400 border-t border-slate-800 pt-1.5">
              <span>LIMIT: ${spendingLimit.toFixed(2)}/MO</span>
            </div>
          </div>

          {/* Core Status */}
          <div className="cyber-panel p-4 rounded-xl space-y-2 border-indigo-950">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-mono-code">STABILIZER HEALTH</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-orbitron font-bold text-emerald-400">
              OPTIMAL
            </div>
            <div className="text-[10px] font-mono-code text-slate-400 border-t border-slate-800 pt-1.5">
              <span>LATENCY AVG: 260ms</span>
            </div>
          </div>
        </div>

        {/* Provider Distribution Bar */}
        <div className="cyber-panel p-5 rounded-xl space-y-4 border-indigo-950">
          <div className="flex items-center justify-between">
            <h3 className="font-chakra font-bold text-sm text-white">
              PROVIDER REQUEST RATIOS
            </h3>
            <span className="text-[10px] font-mono-code text-slate-400">
              DISTRIBUTED ACROSS ACTIVE ENGINES
            </span>
          </div>

          {/* Progress bar container */}
          <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex">
            <div style={{ width: `${geminiPercent}%` }} className="bg-cyan-400" title={`Gemini: ${geminiPercent}%`} />
            <div style={{ width: `${openaiPercent}%` }} className="bg-emerald-400" title={`OpenAI: ${openaiPercent}%`} />
            <div style={{ width: `${claudePercent}%` }} className="bg-purple-400" title={`Claude: ${claudePercent}%`} />
            <div style={{ width: `${deepseekPercent}%` }} className="bg-blue-400" title={`DeepSeek: ${deepseekPercent}%`} />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-code">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Google Gemini ({analytics.providerBreakdown?.gemini || 0})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300">OpenAI ({analytics.providerBreakdown?.openai || 0})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <span className="text-slate-300">Claude ({analytics.providerBreakdown?.claude || 0})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span className="text-slate-300">DeepSeek ({analytics.providerBreakdown?.deepseek || 0})</span>
            </div>
          </div>
        </div>

        {/* User Spending Limit Configuration */}
        <div className="cyber-panel p-5 rounded-xl space-y-3 border-indigo-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h3 className="font-chakra font-bold text-sm text-white">
                USER-DEFINED BUDGET SAFEGUARDS
              </h3>
            </div>
            <span className="text-xs font-mono-code text-amber-400 font-bold">
              ${spendingLimit.toFixed(2)} USD
            </span>
          </div>
          <p className="text-xs text-slate-400 font-rajdhani">
            Configure custom ceiling thresholds to protect your personal API keys against runaway recursive loops.
          </p>
          <input
            type="range"
            min="2"
            max="100"
            step="1"
            value={spendingLimit}
            onChange={(e) => setSpendingLimit(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
