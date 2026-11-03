import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCw,
  Eye,
  EyeOff,
  Trash2,
  Lock,
  Server,
  Zap,
  Globe,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { testApiConnection, maskApiKey, VERIFIED_MODELS } from '../services/apiService';
import { storage } from '../services/storage';
import { sounds } from '../services/soundEffects';
import { AIProvider, UserApiKeyConfig } from '../types';

interface ApiVaultProps {
  activeProvider: AIProvider;
  setActiveProvider: (p: AIProvider) => void;
  activeModel: string;
  setActiveModel: (m: string) => void;
}

export const ApiVault: React.FC<ApiVaultProps> = ({
  activeProvider,
  setActiveProvider,
  activeModel,
  setActiveModel
}) => {
  const [configs, setConfigs] = useState<Record<string, UserApiKeyConfig>>(() => storage.getApiConfigs());
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [revealedKey, setRevealedKey] = useState<Record<string, boolean>>({});
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleUpdateKey = (provider: AIProvider, newKey: string) => {
    const updated = {
      ...configs[provider],
      provider,
      apiKey: newKey,
      status: 'untested' as const
    };
    const nextConfigs = { ...configs, [provider]: updated };
    setConfigs(nextConfigs);
    storage.saveApiConfig(provider, updated);
  };

  const handleUpdateBaseUrl = (provider: AIProvider, url: string) => {
    const updated = {
      ...configs[provider],
      baseUrl: url,
      status: 'untested' as const
    };
    const nextConfigs = { ...configs, [provider]: updated };
    setConfigs(nextConfigs);
    storage.saveApiConfig(provider, updated);
  };

  const handleUpdateModel = (provider: AIProvider, model: string) => {
    const updated = {
      ...configs[provider],
      selectedModel: model
    };
    const nextConfigs = { ...configs, [provider]: updated };
    setConfigs(nextConfigs);
    storage.saveApiConfig(provider, updated);
    if (activeProvider === provider) {
      setActiveModel(model);
    }
  };

  const handleSetDefaultProvider = (provider: AIProvider) => {
    sounds.playClick(850);
    setActiveProvider(provider);
    const m = configs[provider]?.selectedModel || VERIFIED_MODELS[provider][0].id;
    setActiveModel(m);
    setSaveSuccess(`Active provider switched to ${provider.toUpperCase()}`);
    setTimeout(() => setSaveSuccess(null), 2500);
  };

  const handleTestConnection = async (provider: AIProvider) => {
    sounds.playClick();
    setTestingProvider(provider);

    try {
      const cfg = configs[provider];
      const result = await testApiConnection({
        provider,
        apiKey: cfg?.apiKey,
        baseUrl: cfg?.baseUrl,
        model: cfg?.selectedModel
      });

      setTestResults((prev) => ({ ...prev, [provider]: result }));

      const updated = {
        ...cfg,
        status: (result.success ? 'verified' : 'failed') as any,
        latencyMs: result.latencyMs,
        lastTested: new Date().toLocaleTimeString()
      };
      setConfigs((prev) => ({ ...prev, [provider]: updated }));
      storage.saveApiConfig(provider, updated);

      if (result.success) {
        sounds.playSuccess();
      } else {
        sounds.playClick(300);
      }
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [provider]: { success: false, error: err.message || 'Connection test failed' }
      }));
    } finally {
      setTestingProvider(null);
    }
  };

  const handleClearKey = (provider: AIProvider) => {
    sounds.playClick();
    handleUpdateKey(provider, '');
  };

  const providersList: Array<{
    id: AIProvider;
    name: string;
    badge: string;
    desc: string;
    docsUrl: string;
    hasBaseUrl?: boolean;
  }> = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      badge: 'Integrated Engine (Default)',
      desc: 'High speed, multimodal, 2M token context, native code execution and search grounding.',
      docsUrl: 'https://aistudio.google.com'
    },
    {
      id: 'openai',
      name: 'OpenAI (GPT-4o & o1)',
      badge: 'Personal Key',
      desc: 'Industry standard reasoning, coding, and complex systemic generation.',
      docsUrl: 'https://platform.openai.com/api-keys'
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      badge: 'Personal Key',
      desc: 'Top-tier coding, 200k context, nuanced writing, and architectural analysis.',
      docsUrl: 'https://console.anthropic.com/settings/keys'
    },
    {
      id: 'deepseek',
      name: 'DeepSeek AI (V3 & R1)',
      badge: 'Personal Key',
      desc: 'Ultra cost-effective open-weights reasoning and advanced mathematical proofs.',
      docsUrl: 'https://platform.deepseek.com'
    },
    {
      id: 'custom',
      name: 'Custom OpenAI-Compatible API',
      badge: 'Self-Hosted / Proxy',
      desc: 'Connect local Ollama, vLLM, LM Studio, or private enterprise endpoints.',
      docsUrl: '#',
      hasBaseUrl: true
    }
  ];

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] mt-16 p-4 sm:p-6 overflow-y-auto bg-[#05050b]/90">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950/70 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <KeyRound className="w-5 h-5 text-cyan-400" />
              <h1 className="font-orbitron font-bold text-lg sm:text-xl text-white tracking-wider">
                PERSONAL API MANAGEMENT VAULT
              </h1>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
                <Lock className="w-3 h-3" /> CLIENT ENCRYPTED
              </span>
            </div>
            <p className="text-xs text-slate-300 font-rajdhani">
              Connect your personal credentials for multi-provider autonomy. Every user manages their own API keys. Keys are stored encrypted locally and proxied securely.
            </p>
          </div>

          {/* Active Status Pill */}
          <div className="flex items-center gap-2 font-mono-code text-xs bg-slate-900/80 border border-indigo-900/60 px-3 py-1.5 rounded-lg">
            <span className="text-slate-400">CURRENT ACTIVE:</span>
            <span className="text-cyan-400 font-bold uppercase">{activeProvider}</span>
            <span className="text-slate-500">({activeModel})</span>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs font-chakra flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Security Banner */}
        <div className="cyber-panel p-4 rounded-xl flex items-start gap-3 border-indigo-900/40">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-chakra font-bold text-cyan-200">
              Zero-Exposure Cryptographic Vault Design
            </h4>
            <p className="text-xs text-slate-400 font-rajdhani leading-relaxed">
              In accordance with the CODEWITHHIRA Master Blueprint (Section 03), credentials are never logged, never exposed in client bundles, and never stored in plain text URLs. Google Gemini is available automatically via the server environment or your own personal API key.
            </p>
          </div>
        </div>

        {/* Providers Cards Grid */}
        <div className="space-y-4">
          {providersList.map((prov) => {
            const cfg = configs[prov.id] || {
              provider: prov.id,
              apiKey: '',
              selectedModel: VERIFIED_MODELS[prov.id][0].id,
              status: 'untested'
            };
            const isRevealed = revealedKey[prov.id] || false;
            const isCurrentActive = activeProvider === prov.id;
            const testResult = testResults[prov.id];
            const isTesting = testingProvider === prov.id;

            return (
              <div
                key={prov.id}
                className={`cyber-panel p-4 sm:p-5 rounded-xl border transition-all ${
                  isCurrentActive
                    ? 'border-cyan-500/60 shadow-[0_0_20px_rgba(0,240,255,0.15)] bg-slate-900/50'
                    : 'border-indigo-950 hover:border-indigo-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Provider Info */}
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <h3 className="font-chakra font-bold text-sm sm:text-base text-white">
                        {prov.name}
                      </h3>
                      <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-indigo-950/80 text-cyan-300 border border-indigo-800/50">
                        {prov.badge}
                      </span>
                      {isCurrentActive && (
                        <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/50">
                          ACTIVE ENGINE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-rajdhani">{prov.desc}</p>
                  </div>

                  {/* Provider Inputs & Actions */}
                  <div className="flex-1 max-w-xl space-y-2">
                    {/* Optional Base URL for Custom */}
                    {prov.hasBaseUrl && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono-code text-slate-400">
                          CUSTOM API BASE ENDPOINT URL
                        </label>
                        <input
                          type="text"
                          value={cfg.baseUrl || ''}
                          onChange={(e) => handleUpdateBaseUrl(prov.id, e.target.value)}
                          placeholder="e.g. http://localhost:11434/v1 or https://api.proxy.ai/v1"
                          className="w-full bg-slate-900/80 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    )}

                    {/* API Key Input */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400">
                        <span>PERSONAL API KEY {prov.id === 'gemini' && '(Optional if using built-in)'}</span>
                        {cfg.apiKey && (
                          <span className="text-slate-500">{maskApiKey(cfg.apiKey)}</span>
                        )}
                      </div>

                      <div className="relative flex items-center">
                        <input
                          type={isRevealed ? 'text' : 'password'}
                          value={cfg.apiKey}
                          onChange={(e) => handleUpdateKey(prov.id, e.target.value)}
                          placeholder={
                            prov.id === 'gemini'
                              ? 'Default system key active. Enter personal AIza... key to override'
                              : `Paste your ${prov.name} API key (sk-...)`
                          }
                          className="w-full bg-slate-900/90 border border-indigo-900/60 rounded px-3 py-1.5 text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-400 pr-16"
                        />
                        <div className="absolute right-1.5 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setRevealedKey((prev) => ({ ...prev, [prov.id]: !isRevealed }))
                            }
                            className="p-1 text-slate-500 hover:text-slate-300"
                            title={isRevealed ? 'Mask key' : 'Reveal key'}
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          {cfg.apiKey && (
                            <button
                              type="button"
                              onClick={() => handleClearKey(prov.id)}
                              className="p-1 text-slate-500 hover:text-red-400"
                              title="Clear stored key"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Model Choice & Test Row */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {/* Model Select */}
                      <div className="flex-1 min-w-[160px]">
                        <select
                          value={cfg.selectedModel}
                          onChange={(e) => handleUpdateModel(prov.id, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs font-chakra text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
                        >
                          {(VERIFIED_MODELS[prov.id] || []).map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.speed})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Test Connection Button */}
                      <button
                        onClick={() => handleTestConnection(prov.id)}
                        disabled={isTesting}
                        className="px-3 py-1 rounded bg-indigo-950/70 border border-indigo-700/60 hover:border-cyan-400 text-cyan-300 font-chakra text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                      >
                        {isTesting ? (
                          <RotateCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                        <span>{isTesting ? 'Pinging...' : 'Test Connection'}</span>
                      </button>

                      {/* Set as Active Provider Button */}
                      <button
                        onClick={() => handleSetDefaultProvider(prov.id)}
                        disabled={isCurrentActive}
                        className={`px-3 py-1 rounded text-xs font-chakra font-semibold transition-all cursor-pointer ${
                          isCurrentActive
                            ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 cursor-default'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {isCurrentActive ? 'Active Engine' : 'Set as Active'}
                      </button>
                    </div>

                    {/* Test Result Feedback */}
                    {testResult && (
                      <div
                        className={`text-[11px] font-mono-code p-2 rounded flex items-center justify-between ${
                          testResult.success
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                            : 'bg-red-950/60 text-red-300 border border-red-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {testResult.success ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-red-400" />
                          )}
                          <span>{testResult.message || testResult.error}</span>
                        </div>
                        {testResult.latencyMs && (
                          <span className="text-slate-400">{testResult.latencyMs}ms latency</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
