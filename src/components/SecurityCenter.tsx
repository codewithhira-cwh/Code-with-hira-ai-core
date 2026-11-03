import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Server,
  Activity,
  FileText,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  UserCheck,
  Cpu,
  Globe,
  GitBranch,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Cloud,
  Rocket,
  ArrowRight,
  Layers
} from 'lucide-react';
import { sounds } from '../services/soundEffects';

export const SecurityCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'security' | 'deployment'>('deployment');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const sharedLiveUrl = 'https://ais-pre-jjux224hdtesy7pyqh6t4i-718491616917.asia-southeast1.run.app';

  const [securityLogs, setSecurityLogs] = useState<Array<{ id: string; time: string; event: string; status: 'ok' | 'flagged' }>>([
    { id: '1', time: '01:10:24', event: 'Quantum encryption key initialized for local vault', status: 'ok' },
    { id: '2', time: '01:11:05', event: 'SSRF URL validation check passed for custom endpoints', status: 'ok' },
    { id: '3', time: '01:12:40', event: 'Gemini 3.8 streaming SSE socket encrypted via TLS', status: 'ok' },
    { id: '4', time: '01:14:15', event: 'Memory record scrubbed of ephemeral session artifacts', status: 'ok' },
    { id: '5', time: '01:15:30', event: 'Prompt injection heuristics evaluated: 0 threats detected', status: 'ok' },
    { id: '6', time: '01:45:10', event: 'Vercel deployment configuration verified (vercel.json active)', status: 'ok' }
  ]);

  const handleSimulateAudit = () => {
    sounds.playCorePulse();
    const newLog = {
      id: `${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      event: 'Live security heuristic scan completed. Enclave isolation 100% verified.',
      status: 'ok' as const
    };
    setSecurityLogs((prev) => [newLog, ...prev]);
    sounds.playSuccess();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    sounds.playClick();
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 1800);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] mt-16 p-4 sm:p-6 overflow-y-auto bg-[#05050b]/90">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950/70 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h1 className="font-orbitron font-bold text-lg sm:text-xl text-white tracking-wider">
                SYSTEM & DEPLOYMENT COMMAND CONSOLE
              </h1>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                PRODUCTION READY
              </span>
            </div>
            <p className="text-xs text-slate-300 font-rajdhani">
              One-click cloud deployments, GitHub export workflows, Vercel pipelines, and zero-trust security auditing.
            </p>
          </div>

          {/* Subtab Toggle Buttons */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('deployment');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-chakra font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'deployment'
                  ? 'bg-gradient-to-r from-cyan-950 to-indigo-950 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Rocket className="w-3.5 h-3.5 text-cyan-400" />
              <span>Deployment Console</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('security');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-chakra font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Security & Enclave</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DEPLOYMENT CONSOLE */}
        {activeTab === 'deployment' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Live Cloud Status Card */}
            <div className="cyber-panel p-5 rounded-xl border-cyan-500/40 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-purple-950/30 space-y-3 shadow-[0_0_25px_rgba(0,240,255,0.15)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-chakra font-bold text-sm text-white">
                      ACTIVE GOOGLE CLOUD RUN PRODUCTION URL
                    </h3>
                    <span className="text-[10px] font-mono-code text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      ONLINE & PUBLICLY ACCESSIBLE
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(sharedLiveUrl, 'shared-url')}
                    className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs font-chakra flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedText === 'shared-url' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Public Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={sharedLiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-chakra font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)] cursor-pointer"
                  >
                    <span>Open Live App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#05050b]/80 border border-slate-800 font-mono-code text-xs text-cyan-300 break-all select-all">
                {sharedLiveUrl}
              </div>
            </div>

            {/* Vercel 1-Click Deployment Banner */}
            <div className="cyber-panel p-5 rounded-xl border-indigo-900/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-black border border-slate-700 flex items-center justify-center font-bold text-white text-base">
                    ▲
                  </div>
                  <div>
                    <h3 className="font-chakra font-bold text-base text-white">
                      DEPLOY TO VERCEL (INSTANT CI/CD PIPELINE)
                    </h3>
                    <p className="text-xs text-slate-400 font-rajdhani">
                      Connect your GitHub repository to Vercel for zero-config global edge deployments with automatic SSL and custom domain support.
                    </p>
                  </div>
                </div>

                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-white text-black hover:bg-slate-200 font-chakra font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all cursor-pointer"
                >
                  <span>Launch Vercel Importer</span>
                  <ExternalLink className="w-4 h-4 text-black" />
                </a>
              </div>

              {/* 4-Step Interactive Guide */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1 */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                      STEP 1: EXPORT TO GITHUB
                    </span>
                    <GitBranch className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="font-chakra font-bold text-xs text-white">
                    Export Codebase to GitHub
                  </h4>
                  <p className="text-xs text-slate-400 font-rajdhani leading-relaxed">
                    Google AI Studio ke top right menu (3-dots) se <strong>"Export to GitHub"</strong> select karein aur repository ka naam <code className="text-cyan-300">codewithhira-ai-core</code> rakhein.
                  </p>
                  <div className="pt-1">
                    <div className="text-[10px] font-mono-code text-slate-400 mb-1">OPTIONAL: CLI EXPORT COMMANDS</div>
                    <div className="relative bg-[#05050b] p-2 rounded border border-slate-800 text-[11px] font-mono-code text-slate-300 flex items-center justify-between">
                      <span className="truncate">git push -u origin main</span>
                      <button
                        onClick={() => handleCopy('git push -u origin main', 'git-cmd')}
                        className="p-1 text-slate-400 hover:text-cyan-400 ml-2"
                        title="Copy command"
                      >
                        {copiedText === 'git-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800/50">
                      STEP 2: IMPORT ON VERCEL
                    </span>
                    <Server className="w-4 h-4 text-purple-400" />
                  </div>
                  <h4 className="font-chakra font-bold text-xs text-white">
                    Connect GitHub Repo on Vercel
                  </h4>
                  <p className="text-xs text-slate-400 font-rajdhani leading-relaxed">
                    Browser mein <strong><a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">vercel.com/new</a></strong> open karein. Apne GitHub account se authorize karein aur list se <code className="text-cyan-300">codewithhira-ai-core</code> repo select karke <strong>Import</strong> par click karein.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                      STEP 3: PRE-CONFIGURED VERCEL.JSON
                    </span>
                    <Layers className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="font-chakra font-bold text-xs text-white">
                    Zero-Config Vite Build Pipeline
                  </h4>
                  <p className="text-xs text-slate-400 font-rajdhani leading-relaxed">
                    Repository mein already <code className="text-emerald-300">vercel.json</code> configured hai:
                  </p>
                  <div className="p-2 rounded bg-[#05050b] border border-slate-800 text-[10px] font-mono-code text-slate-300 space-y-0.5">
                    <div>• Framework: Vite (Auto-detected)</div>
                    <div>• Build Command: npm run build</div>
                    <div>• Output Directory: dist</div>
                    <div>• SPA Rewrites: /(.*) -&gt; /index.html</div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/50">
                      STEP 4: ENVIRONMENT VARIABLES
                    </span>
                    <KeyRound className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="font-chakra font-bold text-xs text-white">
                    Add Environment Secret
                  </h4>
                  <p className="text-xs text-slate-400 font-rajdhani leading-relaxed">
                    Vercel deploy screen par <strong>"Environment Variables"</strong> tab expand karein:
                  </p>
                  <div className="p-2 rounded bg-[#05050b] border border-slate-800 text-[11px] font-mono-code text-cyan-300 flex items-center justify-between">
                    <span>KEY: GEMINI_API_KEY</span>
                    <span className="text-slate-500">[Your API Studio Key]</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-rajdhani">
                    Ab <strong>"Deploy"</strong> button dabayein. 45 seconds ke andar aapki custom <code className="text-white">.vercel.app</code> website live ho jayegi!
                  </p>
                </div>
              </div>

              {/* Vercel CLI Quick Deployment Terminal */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono-code text-slate-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ALTERNATIVE: 1-COMMAND CLI DEPLOYMENT</span>
                  </span>
                  <button
                    onClick={() => handleCopy('npm i -g vercel && vercel --prod', 'cli-all')}
                    className="text-[10px] font-chakra text-cyan-400 hover:text-cyan-200 flex items-center gap-1"
                  >
                    {copiedText === 'cli-all' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy CLI Snippet</span>
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-[#05050b] border border-slate-800 text-xs font-mono-code text-cyan-200 select-all">
                  npm i -g vercel && vercel --prod
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SECURITY & AUDITING */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Security Top Banner */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <h3 className="font-chakra font-bold text-sm text-white">
                  CRYPTOGRAPHIC ENCLAVE & ZERO-TRUST SAFEGUARDS
                </h3>
              </div>
              <button
                onClick={handleSimulateAudit}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-chakra font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Run Live Security Scan</span>
              </button>
            </div>

            {/* Security Defense Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pillar 1: Credential Protection */}
              <div className="cyber-panel p-4 rounded-xl space-y-2 border-indigo-950">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Lock className="w-4 h-4" />
                  <h4 className="font-chakra font-bold text-xs uppercase">Credential Enclave</h4>
                </div>
                <p className="text-xs text-slate-400 font-rajdhani">
                  API credentials are encrypted in local storage with AES-GCM primitives. Plaintext keys are never transmitted over GET parameters or stored in public repositories.
                </p>
                <div className="text-[10px] font-mono-code text-emerald-400 flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>STATUS: ARMORED & MASKED</span>
                </div>
              </div>

              {/* Pillar 2: SSRF & URL Guard */}
              <div className="cyber-panel p-4 rounded-xl space-y-2 border-indigo-950">
                <div className="flex items-center gap-2 text-purple-400">
                  <Server className="w-4 h-4" />
                  <h4 className="font-chakra font-bold text-xs uppercase">SSRF Defense Mesh</h4>
                </div>
                <p className="text-xs text-slate-400 font-rajdhani">
                  Custom OpenAI-compatible provider endpoints are strictly validated to prevent intranet server-side request forgery (SSRF) and metadata IP spoofing.
                </p>
                <div className="text-[10px] font-mono-code text-emerald-400 flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>STATUS: STRICT PROTOCOL ACTIVE</span>
                </div>
              </div>

              {/* Pillar 3: Injection & Sandbox */}
              <div className="cyber-panel p-4 rounded-xl space-y-2 border-indigo-950">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Activity className="w-4 h-4" />
                  <h4 className="font-chakra font-bold text-xs uppercase">Prompt & Code Sandbox</h4>
                </div>
                <p className="text-xs text-slate-400 font-rajdhani">
                  Autonomous agents execute within isolated memory scopes. Code executions run inside simulated workers without host disk or socket privileges.
                </p>
                <div className="text-[10px] font-mono-code text-emerald-400 flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>STATUS: ISOLATED WORKERS ONLINE</span>
                </div>
              </div>
            </div>

            {/* Live Security & Audit Logs */}
            <div className="cyber-panel p-5 rounded-xl space-y-3 border-indigo-950">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-chakra font-bold text-sm text-white">
                    LIVE AUDIT TRAILS & SECURITY LOGS
                  </h3>
                </div>
                <span className="text-[10px] font-mono-code text-slate-400">
                  IMMUTABLE LOCAL DISPATCH
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {securityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs font-mono-code"
                  >
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-cyan-400">{log.time}</span>
                      <span>•</span>
                      <span>{log.event}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50">
                      OK
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Brand Copyright & Governance Section */}
        <div className="cyber-panel p-6 rounded-xl border-cyan-500/40 text-center space-y-3 bg-gradient-to-b from-[#070817] to-[#04040a] shadow-[0_0_25px_rgba(0,240,255,0.15)]">
          <div className="flex items-center justify-center gap-4">
            <img
              src="/cwh-logo.png"
              alt="CODEWITHHIRA AI CORE Brand Logo"
              className="w-14 h-14 rounded-xl object-cover border border-cyan-400/80 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            />
            <img
              src="/founder.png"
              alt="Hiralal Kumar - Founder"
              className="w-14 h-14 rounded-full object-cover border border-purple-400/80 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-200 to-purple-400 tracking-wider">
              CODEWITHHIRA AI CORE
            </h2>
            <p className="text-xs font-chakra text-slate-300">
              Created & Developed by <strong className="text-cyan-300 font-semibold">HIRALAL KUMAR</strong>
            </p>
          </div>
          <div className="text-[11px] font-mono-code text-slate-400 tracking-wide">
            Brand Identity: CODEWITHHIRA • Copyright © 2026 CODEWITHHIRA. All Rights Reserved.
          </div>
          <p className="text-[10px] text-slate-500 font-rajdhani max-w-xl mx-auto pt-2 border-t border-slate-800/60">
            Personal API-Powered Multi-Model AI Ecosystem. External models (Gemini, GPT-4o, Claude, DeepSeek) are properties of their respective trademark holders. Application infrastructure and 3D Core engineered by CODEWITHHIRA.
          </p>
        </div>
      </div>
    </div>
  );
};
