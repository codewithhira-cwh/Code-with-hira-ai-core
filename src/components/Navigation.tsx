import React, { useState } from 'react';
import {
  Cpu,
  MessageSquare,
  Swords,
  Brain,
  Bot,
  Code2,
  Wrench,
  KeyRound,
  BarChart3,
  ShieldCheck,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Menu,
  X,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { sounds } from '../services/soundEffects';
import { AIProvider } from '../types';

export type ActiveTab =
  | 'universe'
  | 'chat'
  | 'arena'
  | 'memory'
  | 'agents'
  | 'code'
  | 'tools'
  | 'api'
  | 'analytics'
  | 'security';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeProvider: AIProvider;
  activeModel: string;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onOpenApiWizard?: () => void;
  onOpenTutorial?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  activeProvider,
  activeModel,
  soundEnabled,
  setSoundEnabled,
  onOpenApiWizard,
  onOpenTutorial
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playClick(900);
  };

  const toggleFullscreen = () => {
    sounds.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ComponentType<any>; badge?: string }> = [
    { id: 'universe', label: '3D Universe', icon: Cpu },
    { id: 'chat', label: 'Neural Chat', icon: MessageSquare },
    { id: 'arena', label: 'Model Arena', icon: Swords, badge: 'Multi' },
    { id: 'memory', label: 'Memory & RAG', icon: Brain },
    { id: 'agents', label: 'Agent Nexus', icon: Bot },
    { id: 'code', label: 'Code Lab', icon: Code2 },
    { id: 'tools', label: 'Tool Matrix', icon: Wrench },
    { id: 'api', label: 'API Vault', icon: KeyRound },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'security', label: 'Security', icon: ShieldCheck }
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    sounds.playClick(650);
    sounds.triggerHaptic(10);
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#05050b]/85 backdrop-blur-md border-b border-indigo-950/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div
          onClick={() => handleSelectTab('universe')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-[1.5px] shadow-[0_0_18px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_28px_rgba(0,240,255,0.7)] transition-all overflow-hidden shrink-0">
            <img
              src="/cwh-logo.png"
              alt="CODEWITHHIRA AI CORE Logo"
              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-orbitron font-bold tracking-wider text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-200 to-purple-400">
                CODEWITHHIRA
              </span>
              <span className="text-[10px] font-chakra font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                AI CORE
              </span>
            </div>
            <div className="text-[10px] font-mono-code text-slate-300 tracking-tight flex items-center gap-1.5">
              <img
                src="/founder.png"
                alt="Hiralal Kumar"
                className="w-3.5 h-3.5 rounded-full object-cover border border-cyan-400/80 inline-block shadow-sm"
              />
              <span>FOUNDER: HIRALAL KUMAR</span>
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-400"></span>
              <span className="text-purple-300">v2.0 MASTER</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`relative px-2.5 py-1.5 rounded-md text-xs font-chakra tracking-wide flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1 rounded bg-purple-900/80 text-purple-300 border border-purple-700/50">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Pills & Controls */}
        <div className="flex items-center gap-2">
          {/* Active Provider Pill */}
          <button
            onClick={() => {
              sounds.playClick();
              if (onOpenApiWizard) onOpenApiWizard();
              else handleSelectTab('api');
            }}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono-code bg-indigo-950/40 border border-indigo-700/40 hover:border-cyan-500/60 text-indigo-200 transition-all cursor-pointer"
            title="Configure Active Provider & API Credentials"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="uppercase font-bold text-cyan-400">{activeProvider}</span>
            <span className="text-slate-400 truncate max-w-[85px]">{activeModel}</span>
          </button>

          {/* Guided Tutorial Button */}
          <button
            onClick={() => {
              sounds.playClick(900);
              if (onOpenTutorial) onOpenTutorial();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-chakra font-semibold bg-cyan-950/60 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all cursor-pointer"
            title="Open Interactive System Tour & Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GUIDED TOUR</span>
          </button>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute procedural audio' : 'Enable procedural audio'}
            className="p-1.5 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-slate-900/80 border border-transparent hover:border-slate-800 transition-colors"
            title={soundEnabled ? 'Mute Sci-Fi Sound FX' : 'Enable Sci-Fi Sound FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="hidden sm:block p-1.5 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-slate-900/80 border border-transparent hover:border-slate-800 transition-colors"
            title="Toggle Fullscreen Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-slate-300 hover:text-white bg-slate-900/60 border border-slate-800"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070817] border-b border-indigo-900/50 px-4 pt-2 pb-4 space-y-1 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-2 py-1 text-[11px] font-mono-code text-cyan-400 flex items-center justify-between border-b border-slate-800/80 mb-2">
            <span>ACTIVE: {activeProvider.toUpperCase()} ({activeModel})</span>
            <button
              onClick={() => {
                handleSelectTab('api');
              }}
              className="text-purple-400 hover:underline"
            >
              Configure
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`px-3 py-2 rounded-md text-xs font-chakra tracking-wide flex items-center gap-2 transition-all ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/50'
                      : 'text-slate-300 bg-slate-900/40 border border-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
