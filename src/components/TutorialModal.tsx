import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Cpu,
  KeyRound,
  MessageSquare,
  Swords,
  Brain,
  Bot,
  Code2,
  Wrench,
  BarChart3,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Play
} from 'lucide-react';
import { sounds } from '../services/soundEffects';
import { ActiveTab } from './Navigation';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: ActiveTab) => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      id: 'universe',
      tab: 'universe' as ActiveTab,
      badge: 'STEP 1: 3D UNIVERSE MATRIX',
      icon: Cpu,
      title: '3D Quantum AI Core & Cinematic Controls',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      bgGlow: 'shadow-[0_0_30px_rgba(0,240,255,0.2)]',
      desc: 'The visual centerpiece of CODEWITHHIRA AI CORE is a real-time living 3D WebGL universe engineered with Three.js.',
      keyPoints: [
        'Interactive AI Core: Features a central glowing singularity, 3 rotating metallic gyroscopic rings, 4 orbiting neural satellites, and a swirling particle cosmos.',
        'Camera Controls: Switch between Cinematic Orbit, Core Singularity macro zoom, Tactical Matrix 45° view, and Zen HUD view.',
        'Core Dynamics: Adjust Core Pulse Frequency and Gyroscopic Velocity sliders, or click "Emit Quantum Burst" for an overcharge surge.',
        'Procedural Audio: 100% Web Audio API synthesized sound effects accompany every interaction with zero external file dependencies.'
      ],
      quickAction: 'Explore 3D Universe'
    },
    {
      id: 'api',
      tab: 'api' as ActiveTab,
      badge: 'STEP 2: CREDENTIALS VAULT',
      icon: KeyRound,
      title: 'Personal API Management & Multi-Provider Autonomy',
      color: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      bgGlow: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]',
      desc: 'In accordance with Section 03 of the Master Blueprint, every registered user manages their own AI provider credentials with zero owner dependency.',
      keyPoints: [
        'Supported Providers: Google Gemini (Flagship 3.8 Flash & Pro), OpenAI (GPT-4o, o1), Anthropic Claude (3.7 Sonnet), DeepSeek, and Custom OpenAI endpoints (Ollama, vLLM).',
        'Live Test Connection: Click "Test Connection" next to any provider to send a real test payload and measure actual network ping latency in milliseconds.',
        'Zero-Exposure Encryption: Keys are stored encrypted locally in your browser enclave and masked in the UI. Plaintext keys are never logged or exposed.'
      ],
      quickAction: 'Open API Vault'
    },
    {
      id: 'chat',
      tab: 'chat' as ActiveTab,
      badge: 'STEP 3: NEURAL CHAT',
      icon: MessageSquare,
      title: 'Real-Time Streaming Chat Workspace',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      bgGlow: 'shadow-[0_0_30px_rgba(0,240,255,0.2)]',
      desc: 'A high-performance dialogue cockpit inspired by ChatGPT and Google Gemini, styled with a sleek cyber-command interface.',
      keyPoints: [
        'Server-Sent Events (SSE) Streaming: Real-time token streaming with instant response times and request cancellation support.',
        'Dynamic Model Switching: Switch AI models mid-conversation from the top dropdown without losing message history.',
        'Web Search Grounding: Toggle the "Web Search" button to ground responses in real-time internet data with verifiable source citation chips.',
        'Audio & Voice: Use the microphone button for speech-to-text input, and click "Voice Read" on any response for browser audio synthesis.'
      ],
      quickAction: 'Enter Chat Workspace'
    },
    {
      id: 'arena',
      tab: 'arena' as ActiveTab,
      badge: 'STEP 4: MODEL ARENA',
      icon: Swords,
      title: 'Multi-Model Benchmark Comparison Arena',
      color: 'text-purple-400',
      borderColor: 'border-purple-500/40',
      bgGlow: 'shadow-[0_0_30px_rgba(168,85,247,0.2)]',
      desc: 'Send an identical prompt to multiple top-tier models simultaneously and compare their intelligence, speed, and cost side-by-side.',
      keyPoints: [
        'Parallel Inference: Dispatches the same prompt across Gemini 3.8 Flash, Gemini 3.8 Pro, GPT-4o, and Claude 3.7 Sonnet at once.',
        'Comparative Metrics: Displays live latency (ms), token volume count, and estimated API cost per model.',
        'User Voting: Cast votes for the superior response to establish algorithmic benchmark rankings.'
      ],
      quickAction: 'Launch Model Arena'
    },
    {
      id: 'memory',
      tab: 'memory' as ActiveTab,
      badge: 'STEP 5: MEMORY & RAG',
      icon: Brain,
      title: 'Cognitive Memory & Private Knowledge Base (RAG)',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      bgGlow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]',
      desc: 'A dual-layer memory system providing user-isolated persistent memory directives and semantic vector document retrieval.',
      keyPoints: [
        'Personal Memory Vault: Store your coding preferences, project directives, and technical constraints. The AI Core consults these rules automatically.',
        'Memory Controls: Search, toggle active/inactive, export as JSON, or purge any memory with full privacy control.',
        'Knowledge Base & Document Chunker: Upload Markdown/text files. The system breaks them into vector chunks and runs cosine semantic searches.'
      ],
      quickAction: 'Access Memory & RAG'
    },
    {
      id: 'agents',
      tab: 'agents' as ActiveTab,
      badge: 'STEP 6: AGENT NEXUS & CODE LAB',
      icon: Bot,
      title: 'Autonomous Specialists & Sandboxed Code Lab',
      color: 'text-blue-400',
      borderColor: 'border-blue-500/40',
      bgGlow: 'shadow-[0_0_30px_rgba(59,130,246,0.2)]',
      desc: 'Deploy pre-trained autonomous agents or build your own custom AI personas, and execute multi-language code generation.',
      keyPoints: [
        'Specialized Agents: Includes the Nexus Core Architect, Quantum Researcher, Cyber Sentinel, and Content Alchemist.',
        'Custom Agent Builder: Set custom system prompts, temperature, permissions, and dispatch them directly into a chat thread.',
        'AI Code Lab: Multi-language syntax editor (TypeScript, Python, C++, SQL). Generate code, audit vulnerabilities, optimize speed, and run sandboxed tests.'
      ],
      quickAction: 'Open Agent Nexus'
    },
    {
      id: 'analytics',
      tab: 'analytics' as ActiveTab,
      badge: 'STEP 7: ANALYTICS & SECURITY',
      icon: BarChart3,
      title: 'Telemetry, Budget Safeguards & Security Enclave',
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/40',
      bgGlow: 'shadow-[0_0_30px_rgba(99,102,241,0.2)]',
      desc: 'Comprehensive observability, spending safety limits, and zero-trust security audits.',
      keyPoints: [
        'Token & Cost Telemetry: Monitor prompt vs completion tokens, total queries, and estimated cumulative cost.',
        'Budget Safeguards: Set custom spending ceilings to protect your personal API keys against recursive loops.',
        'Security Mesh: Live cryptographic audit logs, SSRF endpoint validation, and strict isolation protocols.',
        'Founder Governance: Created & Developed by Hiralal Kumar (CODEWITHHIRA). Copyright © 2026 CODEWITHHIRA. All Rights Reserved.'
      ],
      quickAction: 'View Analytics & Security'
    }
  ];

  const stepData = steps[currentStep];
  const StepIcon = stepData.icon;

  const handleNext = () => {
    sounds.playClick(900);
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    sounds.playClick(700);
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const handleJumpToTab = (tab: ActiveTab) => {
    sounds.playWarp();
    onClose();
    onNavigateToTab(tab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div
        className={`relative w-full max-w-2xl bg-[#070817] border ${stepData.borderColor} rounded-2xl p-6 ${stepData.bgGlow} transition-all duration-300 space-y-5`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          title="Close Tutorial"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Step Counter */}
        <div className="flex items-center justify-between border-b border-indigo-950 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <span className="font-orbitron font-bold text-sm tracking-wider text-cyan-300">
              SYSTEM HOLOCRON // INTERACTIVE GUIDED TOUR
            </span>
          </div>
          <div className="text-xs font-mono-code text-slate-400">
            {currentStep + 1} / {steps.length}
          </div>
        </div>

        {/* Step Visual Progress Dots */}
        <div className="flex items-center gap-1.5 w-full">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                sounds.playClick();
                setCurrentStep(idx);
              }}
              className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer ${
                idx === currentStep
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(0,240,255,0.5)]'
                  : idx < currentStep
                  ? 'bg-indigo-700/60'
                  : 'bg-slate-800'
              }`}
              title={`Go to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Active Step Content */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
              <StepIcon className={`w-6 h-6 ${stepData.color}`} />
            </div>
            <div>
              <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-900/80 border ${stepData.borderColor} ${stepData.color} uppercase tracking-wider`}>
                {stepData.badge}
              </span>
              <h2 className="font-chakra font-bold text-lg text-white mt-1">
                {stepData.title}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-rajdhani leading-relaxed">
            {stepData.desc}
          </p>

          {/* Key Bullet Points */}
          <div className="cyber-panel p-4 rounded-xl space-y-2 border-indigo-950 bg-slate-900/50">
            <div className="text-[11px] font-mono-code text-cyan-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CORE MECHANISM & WORKING DETAILS:</span>
            </div>
            <ul className="space-y-1.5 text-xs font-rajdhani text-slate-300">
              {stepData.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0 mt-0.5">▸</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Navigation & Jump Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-indigo-950 pt-3">
          {/* Step Prev/Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-chakra flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-chakra flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Jump to Feature Right Now */}
          <button
            onClick={() => handleJumpToTab(stepData.tab)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-chakra text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Launch {stepData.quickAction} Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
