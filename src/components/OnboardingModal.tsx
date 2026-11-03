import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Play,
  RotateCw,
  X,
  Lock,
  Layers
} from 'lucide-react';
import { testApiConnection, VERIFIED_MODELS } from '../services/apiService';
import { storage } from '../services/storage';
import { sounds } from '../services/soundEffects';
import { AIProvider } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (provider: AIProvider, model: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [step, setStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('gemini');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleNext = () => {
    sounds.playClick();
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    sounds.playClick();
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleTest = async () => {
    sounds.playClick();
    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testApiConnection({
        provider: selectedProvider,
        apiKey: apiKey || undefined,
        baseUrl: baseUrl || undefined,
        model: selectedModel
      });
      setTestResult(result);
      if (result.success) {
        sounds.playSuccess();
      }
    } catch (err: any) {
      setTestResult({ success: false, error: err.message || 'Connection test failed' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleActivateAssistant = () => {
    sounds.playCorePulse();
    // Save configuration
    storage.saveApiConfig(selectedProvider, {
      provider: selectedProvider,
      apiKey,
      baseUrl: baseUrl || undefined,
      selectedModel,
      status: testResult?.success ? 'verified' : 'untested',
      latencyMs: testResult?.latencyMs
    });
    sounds.playSuccess();
    onComplete(selectedProvider, selectedModel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#070817] border border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.25)] space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Header */}
        <div className="border-b border-indigo-950 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span className="font-orbitron font-bold text-sm text-cyan-300">
              AI SETUP WIZARD // CODEWITHHIRA AI CORE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-rajdhani">
            Step {step} of 4: Multi-Model Authentication & Neural Sync
          </p>

          {/* Stepper Progress Bar */}
          <div className="w-full h-1.5 bg-slate-900 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Select Provider */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-chakra font-bold text-sm text-white">
              STEP 1: SELECT YOUR PRIMARY AI PROVIDER
            </h3>
            <p className="text-xs text-slate-400 font-rajdhani">
              Choose the foundational cognitive intelligence engine for your workspace. You can configure multiple providers anytime in the API Vault.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'gemini', name: 'Google Gemini', desc: 'Pre-integrated or custom key (Recommended)' },
                { id: 'openai', name: 'OpenAI', desc: 'GPT-4o, GPT-4o Mini, and o1' },
                { id: 'claude', name: 'Anthropic Claude', desc: 'Claude 3.7 Sonnet & Haiku' },
                { id: 'deepseek', name: 'DeepSeek AI', desc: 'DeepSeek-V3 & DeepSeek-R1' },
                { id: 'custom', name: 'Custom OpenAI-Compatible', desc: 'Self-hosted Ollama, vLLM, or LM Studio' }
              ].map((prov) => {
                const isSelected = selectedProvider === prov.id;
                return (
                  <div
                    key={prov.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedProvider(prov.id as AIProvider);
                      setSelectedModel(VERIFIED_MODELS[prov.id as AIProvider][0].id);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-chakra font-bold text-xs">{prov.name}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400 font-rajdhani">{prov.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Configure Credentials */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-chakra font-bold text-sm text-white">
              STEP 2: CONFIGURE API CREDENTIALS
            </h3>
            <p className="text-xs text-slate-400 font-rajdhani">
              {selectedProvider === 'gemini'
                ? 'Google Gemini is already enabled via system server keys. You may optionally enter a personal key to use your own quotas.'
                : `Enter your personal API key for ${selectedProvider.toUpperCase()}. Keys remain encrypted in your local browser vault.`}
            </p>

            <div className="space-y-3">
              {selectedProvider === 'custom' && (
                <div>
                  <label className="text-[10px] font-mono-code text-slate-400 block mb-1">
                    API BASE URL
                  </label>
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="e.g. http://localhost:11434/v1"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-mono-code text-slate-400 block mb-1">
                  API KEY {selectedProvider === 'gemini' && '(OPTIONAL)'}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={
                    selectedProvider === 'gemini'
                      ? 'System key enabled. Enter personal key to override.'
                      : `sk-... or your personal API key`
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-[10px] font-mono-code text-slate-400 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Zero Server Logging Policy — Keys stored in client cryptographic enclave.</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Model Selection & Test */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-chakra font-bold text-sm text-white">
              STEP 3: SELECT MODEL & VERIFY CONNECTION
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono-code text-slate-400 block mb-1">
                  DEFAULT AI MODEL
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs font-chakra text-cyan-300 focus:outline-none focus:border-cyan-400"
                >
                  {(VERIFIED_MODELS[selectedProvider] || []).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.speed} ({m.contextWindow})
                    </option>
                  ))}
                </select>
              </div>

              {/* Test Button */}
              <button
                type="button"
                onClick={handleTest}
                disabled={isTesting}
                className="w-full py-2.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-cyan-300 font-chakra text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isTesting ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTesting ? 'Verifying Neural Handshake...' : 'Test Connection & Ping Latency'}</span>
              </button>

              {testResult && (
                <div
                  className={`p-3 rounded-lg text-xs font-mono-code flex items-center justify-between ${
                    testResult.success
                      ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                      : 'bg-red-950/60 border border-red-500/50 text-red-300'
                  }`}
                >
                  <span>{testResult.message || testResult.error}</span>
                  {testResult.latencyMs && <span>{testResult.latencyMs}ms</span>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Activation Confirmation */}
        {step === 4 && (
          <div className="space-y-4 text-center py-2">
            <div className="w-14 h-14 rounded-full bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(0,240,255,0.4)]">
              <CheckCircle2 className="w-8 h-8 text-cyan-400" />
            </div>

            <div className="space-y-1">
              <h3 className="font-orbitron font-bold text-base text-white">
                QUANTUM ASSISTANT READY FOR DEPLOYMENT
              </h3>
              <p className="text-xs text-slate-300 font-rajdhani">
                Your personal AI assistant is configured with <strong className="text-cyan-300">{selectedModel}</strong> via <strong className="text-purple-300">{selectedProvider.toUpperCase()}</strong>.
              </p>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-indigo-950 text-xs font-mono-code text-slate-400 text-left space-y-1">
              <div>ENGINE: {selectedProvider.toUpperCase()}</div>
              <div>MODEL: {selectedModel}</div>
              <div>SECURITY: CLIENT ISOLATED ENCLAVE</div>
              <div>ECOSYSTEM: CODEWITHHIRA AI CORE v2.0</div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="flex items-center justify-between border-t border-indigo-950 pt-3">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-chakra flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-chakra text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-all cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleActivateAssistant}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-orbitron text-xs font-bold tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
            >
              ACTIVATE AI CORE WORKSPACE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
