import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  RotateCw,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Swords,
  Brain,
  Code2,
  KeyRound,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { sounds } from '../services/soundEffects';
import { ActiveTab } from './Navigation';

interface UniverseHeroProps {
  cameraMode: 'cinematic' | 'core-focus' | 'tactical' | 'hud-view';
  setCameraMode: (mode: 'cinematic' | 'core-focus' | 'tactical' | 'hud-view') => void;
  corePower: number;
  setCorePower: (p: number) => void;
  rotationSpeed: number;
  setRotationSpeed: (s: number) => void;
  hologramColor: 'cyan' | 'purple' | 'emerald' | 'amber';
  setHologramColor: (c: 'cyan' | 'purple' | 'emerald' | 'amber') => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const UniverseHero: React.FC<UniverseHeroProps> = ({
  cameraMode,
  setCameraMode,
  corePower,
  setCorePower,
  rotationSpeed,
  setRotationSpeed,
  hologramColor,
  setHologramColor,
  onNavigate
}) => {
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [activeDockTab, setActiveDockTab] = useState<'camera' | 'core' | 'modules'>('camera');

  const handleCameraChange = (mode: 'cinematic' | 'core-focus' | 'tactical' | 'hud-view') => {
    sounds.playWarp();
    sounds.triggerHaptic(20);
    setCameraMode(mode);
  };

  const handleTriggerPulse = () => {
    sounds.playCorePulse();
    setCorePower(1.8);
    setTimeout(() => setCorePower(1.0), 1200);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] mt-16 pointer-events-none select-none flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
      {/* Top HUD Spec Badge */}
      <div className="flex items-start justify-between z-10">
        <div className="pointer-events-auto bg-[#070817]/90 border border-cyan-500/30 rounded-xl p-3 sm:p-3.5 max-w-sm sm:max-w-md backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.7)] animate-in fade-in duration-500">
          <div className="flex items-center gap-2.5 mb-2">
            <img
              src="/cwh-logo.png"
              alt="CODEWITHHIRA Logo"
              className="w-8 h-8 rounded-lg object-cover border border-cyan-500/50 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-orbitron font-bold text-xs tracking-wider text-cyan-300">
                  CODEWITHHIRA AI CORE
                </span>
                <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-purple-950/70 text-purple-300 border border-purple-800/40">
                  V2.0 MASTER
                </span>
              </div>
              <div className="text-[10px] font-mono-code text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>NEURAL QUANTUM MATRIX ONLINE</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 mb-2">
            <img
              src="/founder.png"
              alt="Hiralal Kumar - Founder"
              className="w-9 h-9 rounded-full object-cover border border-cyan-400/80 shadow-[0_0_10px_rgba(0,240,255,0.3)] shrink-0"
            />
            <div className="text-xs font-rajdhani text-slate-300">
              <div className="font-chakra font-bold text-white text-[11px] leading-tight">
                FOUNDER: HIRALAL KUMAR
              </div>
              <div className="text-[10px] font-mono-code text-cyan-400">
                Personal API Multi-Model Architecture
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono-code text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>FLUX: 99.98%</span>
            <span>•</span>
            <span>NODES: 128 ACTIVE</span>
            <span>•</span>
            <button
              onClick={handleTriggerPulse}
              className="ml-auto text-cyan-400 hover:text-cyan-200 underline flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3 h-3" /> Overcharge Core
            </button>
          </div>
        </div>

        {/* Floating Quick Action CTA */}
        <div className="hidden sm:flex flex-col items-end gap-2 pointer-events-auto">
          <button
            onClick={() => {
              sounds.playClick();
              onNavigate('chat');
            }}
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-orbitron text-xs font-semibold tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>ENTER NEURAL WORKSPACE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <span className="text-[10px] font-mono-code text-slate-400 tracking-tight">
            DIRECT MULTI-MODEL ACCESS READY
          </span>
        </div>
      </div>

      {/* Middle Center: 100% Unobstructed 3D Viewport for viewing the 3D core freely */}
      <div className="flex-1 flex items-center justify-center pointer-events-none">
        {/* Subtle holographic watermark ring */}
        <div className="text-center opacity-40">
          <span className="text-[11px] font-mono-code tracking-[0.3em] text-cyan-500/80 uppercase">
            [ INTERACTIVE 3D NEURAL CORE // ROTATE & OBSERVE ]
          </span>
        </div>
      </div>

      {/* Ergonomic Unified Collapsible Bottom Dock (Adheres to Three.js Directive) */}
      <div className="relative pointer-events-auto z-20 flex flex-col items-center">
        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => {
            sounds.playClick(750);
            setHudCollapsed(!hudCollapsed);
          }}
          className="mb-1 px-3 py-1 rounded-t-md bg-[#0a0b18]/90 border-t border-x border-cyan-500/30 text-cyan-400 text-xs font-chakra tracking-wider flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer shadow-lg"
          title={hudCollapsed ? 'Expand HUD Dock' : 'Collapse HUD Dock'}
        >
          {hudCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{hudCollapsed ? 'SHOW CONTROL DOCK' : 'MINIMIZE DOCK (CINEMA MODE)'}</span>
        </button>

        {/* Main Dock Container */}
        <div
          className={`w-full max-w-4xl bg-[#070817]/90 border border-cyan-500/30 rounded-xl p-3 sm:p-4 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] transition-all duration-300 ${
            hudCollapsed ? 'h-0 opacity-0 overflow-hidden py-0 border-transparent' : 'opacity-100'
          }`}
        >
          {/* Dock Tabs Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveDockTab('camera');
                }}
                className={`px-2.5 py-1 rounded text-xs font-chakra font-medium tracking-wide flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeDockTab === 'camera'
                    ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Camera Views</span>
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveDockTab('core');
                }}
                className={`px-2.5 py-1 rounded text-xs font-chakra font-medium tracking-wide flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeDockTab === 'core'
                    ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Core Dynamics</span>
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveDockTab('modules');
                }}
                className={`px-2.5 py-1 rounded text-xs font-chakra font-medium tracking-wide flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeDockTab === 'modules'
                    ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ecosystem Portals</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono-code text-slate-400">
              <span className="text-cyan-400">ENGINE: V2.0</span>
              <span>•</span>
              <span>OWNER: HIRALAL KUMAR</span>
            </div>
          </div>

          {/* Tab 1: Camera Modes */}
          {activeDockTab === 'camera' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'cinematic', label: 'Cinematic Orbit', desc: 'Continuous 360° dynamic camera sweep' },
                { id: 'core-focus', label: 'Core Singularity', desc: 'Deep macro zoom on central crystal' },
                { id: 'tactical', label: 'Tactical Matrix', desc: 'Elevated 45° holographic overview' },
                { id: 'hud-view', label: 'Zen HUD View', desc: 'Balanced perspective for reading' }
              ].map((view) => {
                const isActive = cameraMode === view.id;
                return (
                  <button
                    key={view.id}
                    onClick={() => handleCameraChange(view.id as any)}
                    className={`p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-950/50 border border-cyan-500/60 shadow-[0_0_15px_rgba(0,240,255,0.25)] text-cyan-200'
                        : 'bg-slate-900/40 border border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-chakra font-bold text-xs tracking-wide">{view.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                    </div>
                    <p className="text-[10px] text-slate-400 font-rajdhani line-clamp-1">{view.desc}</p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 2: Core Dynamics */}
          {activeDockTab === 'core' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-1">
              {/* Power Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono-code">
                  <span className="text-slate-300">CORE PULSE FREQUENCY</span>
                  <span className="text-cyan-400 font-bold">{corePower.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={corePower}
                  onChange={(e) => setCorePower(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Rotation Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono-code">
                  <span className="text-slate-300">GYROSCOPIC VELOCITY</span>
                  <span className="text-purple-400 font-bold">{rotationSpeed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              {/* Overcharge Burst Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerPulse}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-900/60 to-purple-900/60 border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 font-chakra font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>EMIT QUANTUM BURST</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Quick Modules Portals */}
          {activeDockTab === 'modules' && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'chat', label: 'Neural Chat', icon: MessageSquare, color: 'text-cyan-400' },
                { id: 'arena', label: 'Model Arena', icon: Swords, color: 'text-purple-400' },
                { id: 'memory', label: 'Memory Vault', icon: Brain, color: 'text-emerald-400' },
                { id: 'code', label: 'AI Code Lab', icon: Code2, color: 'text-blue-400' },
                { id: 'api', label: 'API Vault', icon: KeyRound, color: 'text-amber-400' }
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      sounds.playClick();
                      onNavigate(m.id as any);
                    }}
                    className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/30 text-left transition-all flex items-center gap-2 cursor-pointer group"
                  >
                    <Icon className={`w-4 h-4 ${m.color} group-hover:scale-110 transition-transform`} />
                    <span className="font-chakra text-xs text-slate-200 group-hover:text-white font-medium">
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
