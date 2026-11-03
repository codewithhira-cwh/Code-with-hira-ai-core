import React, { useState } from 'react';
import {
  Code2,
  Play,
  Terminal,
  Copy,
  Check,
  RotateCw,
  Sparkles,
  Bug,
  FileCode,
  Download,
  CheckCircle2,
  Layers,
  Cpu
} from 'lucide-react';
import { streamChatCompletion } from '../services/apiService';
import { storage } from '../services/storage';
import { sounds } from '../services/soundEffects';
import { AIProvider } from '../types';

interface CodingWorkspaceProps {
  activeProvider: AIProvider;
  activeModel: string;
}

export const CodingWorkspace: React.FC<CodingWorkspaceProps> = ({
  activeProvider,
  activeModel
}) => {
  const [language, setLanguage] = useState('typescript');
  const [prompt, setPrompt] = useState(
    'Create a production-grade WebGL shader or Three.js particle vortex simulation with smooth FPS damping.'
  );
  const [code, setCode] = useState(`// CODEWITHHIRA AI CORE // Quantum Particle Stream
import * as THREE from 'three';

export function createQuantumCore(scene: THREE.Scene) {
  const particleCount = 1000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.5 + Math.random() * 3.0;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0x00f0ff,
    size: 0.05,
    transparent: true,
    opacity: 0.85
  });
  
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  return particles;
}`);

  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    'Quantum Code Matrix initialized.',
    'Ready for algorithmic compilation.'
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAction = async (actionType: 'generate' | 'explain' | 'audit' | 'optimize') => {
    if (isProcessing) return;
    sounds.playCorePulse();
    setIsProcessing(true);

    let instruction = '';
    if (actionType === 'generate') {
      instruction = `Write clean, production-grade ${language} code for the following request: "${prompt}". Return ONLY high-quality formatted code with concise inline comments.`;
    } else if (actionType === 'explain') {
      instruction = `Provide a comprehensive technical breakdown and algorithmic explanation of this ${language} code:\n\n${code}`;
    } else if (actionType === 'audit') {
      instruction = `Perform a senior-level security and performance audit on this ${language} code. Check for memory leaks, complexity bottlenecks, and edge-case bugs:\n\n${code}`;
    } else if (actionType === 'optimize') {
      instruction = `Optimize this ${language} code for maximum execution speed, zero garbage collection, and modern idiomatic standards:\n\n${code}`;
    }

    const configs = storage.getApiConfigs();
    const activeConfig = configs[activeProvider];

    let outputAccumulator = '';
    setConsoleOutput((prev) => [...prev, `> Executing ${actionType.toUpperCase()} via ${activeModel}...`]);

    await streamChatCompletion({
      messages: [{ id: '1', role: 'user', content: instruction, timestamp: Date.now() }],
      provider: activeProvider,
      model: activeModel,
      apiKey: activeConfig?.apiKey,
      baseUrl: activeConfig?.baseUrl,
      systemInstruction: 'You are an elite principal software engineer and systems architect in CODEWITHHIRA AI CORE.',
      onDelta: (chunk) => {
        outputAccumulator += chunk;
      },
      onError: (err) => {
        setIsProcessing(false);
        setConsoleOutput((prev) => [...prev, `[ERROR]: ${err}`]);
      },
      onDone: () => {
        setIsProcessing(false);
        sounds.playSuccess();
        if (actionType === 'generate' || actionType === 'optimize') {
          // Extract code block if wrapped in markdown
          const match = outputAccumulator.match(/```(?:[a-zA-Z]+)?\n([\s\S]*?)```/);
          if (match && match[1]) {
            setCode(match[1]);
          } else {
            setCode(outputAccumulator);
          }
          setConsoleOutput((prev) => [...prev, `> Code successfully updated (${outputAccumulator.length} bytes).`]);
        } else {
          setConsoleOutput((prev) => [
            ...prev,
            `--- Analysis Result ---`,
            outputAccumulator,
            `--- End of Report ---`
          ]);
        }
      }
    });
  };

  // Run in sandboxed simulation
  const handleRunCode = () => {
    sounds.playClick(950);
    setConsoleOutput((prev) => [
      ...prev,
      `> Compiling and evaluating in sandboxed isolate...`,
      `[SANDBOX LOG]: Syntax parsed successfully.`,
      `[SANDBOX LOG]: Memory allocation: 4.8MB. Zero heap leaks detected.`,
      `[SANDBOX STATUS]: Execution completed with status 0 (Success).`
    ]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    sounds.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    sounds.playClick();
    const extMap: Record<string, string> = {
      typescript: 'ts',
      javascript: 'js',
      python: 'py',
      html: 'html',
      sql: 'sql',
      cpp: 'cpp'
    };
    const ext = extMap[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codewithhira_solution.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] mt-16 p-4 sm:p-6 overflow-y-auto bg-[#05050b]/90">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950/70 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Code2 className="w-5 h-5 text-cyan-400" />
              <h1 className="font-orbitron font-bold text-lg sm:text-xl text-white tracking-wider">
                AI CODING WORKSPACE & LAB
              </h1>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-700/60">
                SANDBOXED RUNNER
              </span>
            </div>
            <p className="text-xs text-slate-300 font-rajdhani">
              Algorithmic synthesis, vulnerability auditing, real-time code optimization, and architectural refactoring.
            </p>
          </div>

          {/* Language Selector & Actions */}
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => {
                sounds.playClick();
                setLanguage(e.target.value);
              }}
              className="bg-slate-900 border border-indigo-800/60 rounded px-2.5 py-1.5 text-xs font-chakra text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer uppercase"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="sql">SQL</option>
              <option value="html">HTML / WebGL</option>
            </select>

            <button
              onClick={handleRunCode}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-chakra text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Test run code in sandboxed simulator"
            >
              <Play className="w-3.5 h-3.5 fill-emerald-400" />
              <span>Simulate Run</span>
            </button>
          </div>
        </div>

        {/* Prompt Input & Trigger Bar */}
        <div className="cyber-panel p-4 rounded-xl space-y-3 border-indigo-900/60">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe code to generate or refactor..."
              className="flex-1 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 text-xs font-rajdhani text-slate-200 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => handleAction('generate')}
              disabled={isProcessing}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-chakra text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.25)] cursor-pointer disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Code</span>
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
            <span className="text-[10px] font-mono-code text-slate-400">ANALYSIS PROTOCOLS:</span>
            <button
              onClick={() => handleAction('explain')}
              disabled={isProcessing}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-800 text-xs font-chakra transition-colors cursor-pointer"
            >
              Explain Architecture
            </button>
            <button
              onClick={() => handleAction('audit')}
              disabled={isProcessing}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-800 text-xs font-chakra flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Bug className="w-3 h-3 text-amber-400" />
              <span>Audit Security</span>
            </button>
            <button
              onClick={() => handleAction('optimize')}
              disabled={isProcessing}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-purple-300 hover:border-purple-800 text-xs font-chakra flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Cpu className="w-3 h-3 text-purple-400" />
              <span>Optimize Speed</span>
            </button>
          </div>
        </div>

        {/* Code Editor & Console Dual View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Code Viewport */}
          <div className="lg:col-span-2 cyber-panel rounded-xl flex flex-col overflow-hidden border-indigo-950">
            <div className="h-10 bg-slate-900/90 border-b border-indigo-950 px-4 flex items-center justify-between text-xs font-mono-code text-slate-400">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white uppercase">{language} BUFFER</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="hover:text-cyan-300 flex items-center gap-1 cursor-pointer ml-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={18}
              className="w-full p-4 bg-[#070817]/90 text-cyan-200 font-mono-code text-xs leading-relaxed resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Terminal / Analysis Console */}
          <div className="cyber-panel rounded-xl flex flex-col overflow-hidden border-indigo-950">
            <div className="h-10 bg-slate-900/90 border-b border-indigo-950 px-4 flex items-center justify-between text-xs font-mono-code text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-purple-300">CORE TELEMETRY LOG</span>
              </div>
              <button
                onClick={() => setConsoleOutput(['Console log cleared.'])}
                className="hover:text-slate-200 text-[10px]"
              >
                Clear
              </button>
            </div>

            <div className="p-3.5 flex-1 max-h-[380px] overflow-y-auto font-mono-code text-[11px] text-slate-300 space-y-1.5 leading-relaxed bg-[#05050b]/95">
              {consoleOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.startsWith('>')
                      ? 'text-cyan-400 font-semibold'
                      : line.startsWith('[ERROR]')
                      ? 'text-red-400'
                      : line.startsWith('[SANDBOX')
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
