import React, { useState } from 'react';
import {
  Bot,
  Plus,
  Play,
  Settings2,
  Trash2,
  Sparkles,
  Cpu,
  Atom,
  ShieldAlert,
  Flame,
  Terminal,
  Layers,
  ArrowRight
} from 'lucide-react';
import { storage, DEFAULT_AGENTS } from '../services/storage';
import { sounds } from '../services/soundEffects';
import { AIAgent, AIProvider } from '../types';

interface AgentNexusProps {
  onLaunchAgentChat: (agent: AIAgent) => void;
}

export const AgentNexus: React.FC<AgentNexusProps> = ({ onLaunchAgentChat }) => {
  const [agents, setAgents] = useState<AIAgent[]>(() => storage.getAgents());
  const [isCreating, setIsCreating] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(agents[0]);

  // Form fields for new agent
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [defaultModel, setDefaultModel] = useState('gemini-3.8-flash');
  const [temperature, setTemperature] = useState(0.7);

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !systemInstruction.trim()) return;
    sounds.playClick(900);

    const newAgent: AIAgent = {
      id: `agent-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Autonomous Assistant',
      avatarIcon: 'Bot',
      color: '#00f0ff',
      description: description.trim() || 'Custom user-defined autonomous agent.',
      systemInstruction: systemInstruction.trim(),
      defaultModel,
      defaultProvider: 'gemini',
      temperature,
      tools: ['Web Search', 'Code Execution', 'Memory'],
      isBuiltIn: false
    };

    const updated = [newAgent, ...agents];
    setAgents(updated);
    storage.saveAgents(updated);
    setIsCreating(false);
    setSelectedAgent(newAgent);
    setName('');
    setRole('');
    setDescription('');
    setSystemInstruction('');
    sounds.playSuccess();
  };

  const handleDeleteAgent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    const updated = agents.filter((a) => a.id !== id);
    setAgents(updated);
    storage.saveAgents(updated);
    if (selectedAgent?.id === id) {
      setSelectedAgent(updated[0] || null);
    }
  };

  const getAgentIcon = (iconName: string, color: string) => {
    if (iconName === 'Cpu') return <Cpu className="w-5 h-5" style={{ color }} />;
    if (iconName === 'Atom') return <Atom className="w-5 h-5" style={{ color }} />;
    if (iconName === 'ShieldAlert') return <ShieldAlert className="w-5 h-5" style={{ color }} />;
    if (iconName === 'Sparkles') return <Sparkles className="w-5 h-5" style={{ color }} />;
    return <Bot className="w-5 h-5" style={{ color }} />;
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] mt-16 p-4 sm:p-6 overflow-y-auto bg-[#05050b]/90">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950/70 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-5 h-5 text-cyan-400" />
              <h1 className="font-orbitron font-bold text-lg sm:text-xl text-white tracking-wider">
                MULTI-AI AGENT NEXUS
              </h1>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-700/60">
                AUTONOMOUS SPECIALISTS
              </span>
            </div>
            <p className="text-xs text-slate-300 font-rajdhani">
              Assemble, configure, and orchestrate specialized AI agents with tailored system prompts, tool permissions, and persistent memory directives.
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setIsCreating(!isCreating);
            }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-chakra text-xs font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>FORGE NEW AGENT</span>
          </button>
        </div>

        {/* Forge New Agent Modal / Panel */}
        {isCreating && (
          <form
            onSubmit={handleCreateAgent}
            className="cyber-panel p-5 rounded-xl space-y-4 border-cyan-500/50 animate-in fade-in"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-chakra font-bold text-sm text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>FORGE AUTONOMOUS AGENT SPECIFICATION</span>
              </h3>
              <span className="text-[10px] font-mono-code text-slate-400">V2.0 COMPATIBLE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono-code text-slate-400 block mb-1">AGENT NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cyber Matrix Architect"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono-code text-slate-400 block mb-1">PRIMARY ROLE</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Distributed Consensus Specialist"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-mono-code text-slate-400 block mb-1">BRIEF MISSION DESCRIPTION</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Validates high-performance algorithms, cryptographic handshakes, and node telemetry."
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-mono-code text-slate-400 block mb-1">SYSTEM INSTRUCTION / COGNITIVE DIRECTIVE</label>
                <textarea
                  rows={3}
                  value={systemInstruction}
                  onChange={(e) => setSystemInstruction(e.target.value)}
                  placeholder="You are the Cyber Matrix Architect. Your objective is to formulate resilient, high-speed architectures..."
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-slate-200 font-mono-code focus:outline-none focus:border-cyan-400 resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono-code text-slate-400 block mb-1">DEFAULT MODEL</label>
                <select
                  value={defaultModel}
                  onChange={(e) => setDefaultModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
                  <option value="deepseek-chat">DeepSeek-V3</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-mono-code text-slate-400 mb-1">
                  <span>TEMPERATURE (CREATIVITY VS DETERMINISM)</span>
                  <span className="text-cyan-400">{temperature.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.2"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-400 hover:text-white text-xs font-chakra"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-chakra text-xs font-semibold shadow-md"
              >
                Deploy Agent to Nexus
              </button>
            </div>
          </form>
        )}

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent) => {
            const isSelected = selectedAgent?.id === agent.id;
            return (
              <div
                key={agent.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedAgent(agent);
                }}
                className={`cyber-panel p-4 rounded-xl flex flex-col justify-between border transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-cyan-500/60 shadow-[0_0_20px_rgba(0,240,255,0.2)] bg-slate-900/60'
                    : 'border-indigo-950 hover:border-indigo-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getAgentIcon(agent.avatarIcon, agent.color)}
                    </div>

                    <div className="flex items-center gap-1">
                      {agent.isBuiltIn && (
                        <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                          CORE SYSTEM
                        </span>
                      )}
                      {!agent.isBuiltIn && (
                        <button
                          onClick={(e) => handleDeleteAgent(agent.id, e)}
                          className="p-1 text-slate-500 hover:text-red-400"
                          title="Decommission Agent"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="font-chakra font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {agent.name}
                  </h3>
                  <span className="text-[11px] font-mono-code text-cyan-400 block mb-2">
                    {agent.role}
                  </span>
                  <p className="text-xs text-slate-400 font-rajdhani line-clamp-3 mb-3">
                    {agent.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  {/* Tool chips */}
                  <div className="flex flex-wrap gap-1">
                    {agent.tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Launch Chat Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playClick();
                      onLaunchAgentChat(agent);
                    }}
                    className="w-full py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-chakra font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-cyan-400" />
                    <span>LAUNCH AGENT DIALOGUE</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Agent Detailed Directive Viewer */}
        {selectedAgent && (
          <div className="cyber-panel p-5 rounded-xl space-y-3 border-indigo-900/60">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="font-chakra font-bold text-sm text-white">
                  DIRECTIVE TELEMETRY: {selectedAgent.name.toUpperCase()}
                </h3>
              </div>
              <div className="text-[10px] font-mono-code text-slate-400">
                MODEL: {selectedAgent.defaultModel} // TEMP: {selectedAgent.temperature}
              </div>
            </div>

            <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800 text-xs font-mono-code text-slate-300 leading-relaxed whitespace-pre-wrap">
              {selectedAgent.systemInstruction}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
