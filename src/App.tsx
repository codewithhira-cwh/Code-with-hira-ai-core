/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODEWITHHIRA AI CORE (V2.0 Master Blueprint)
 * Created & Developed by Hiralal Kumar
 * Copyright © 2026 CODEWITHHIRA. All Rights Reserved.
 */

import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ThreeCoreUniverse } from './components/ThreeCoreUniverse';
import { Navigation, ActiveTab } from './components/Navigation';
import { UniverseHero } from './components/UniverseHero';
import { ChatWorkspace } from './components/ChatWorkspace';
import { ModelArena } from './components/ModelArena';
import { ApiVault } from './components/ApiVault';
import { MemoryEngine } from './components/MemoryEngine';
import { AgentNexus } from './components/AgentNexus';
import { CodingWorkspace } from './components/CodingWorkspace';
import { ToolCenter } from './components/ToolCenter';
import { AnalyticsCenter } from './components/AnalyticsCenter';
import { SecurityCenter } from './components/SecurityCenter';
import { OnboardingModal } from './components/OnboardingModal';
import { TutorialModal } from './components/TutorialModal';
import { sounds } from './services/soundEffects';
import { storage } from './services/storage';
import { AIAgent, AIProvider } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('universe');
  const [activeProvider, setActiveProvider] = useState<AIProvider>('gemini');
  const [activeModel, setActiveModel] = useState<string>('gemini-3.8-flash');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // 3D Core controls
  const [cameraMode, setCameraMode] = useState<'cinematic' | 'core-focus' | 'tactical' | 'hud-view'>('cinematic');
  const [corePower, setCorePower] = useState(1.0);
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [hologramColor, setHologramColor] = useState<'cyan' | 'purple' | 'emerald' | 'amber'>('cyan');

  // Load initial settings
  useEffect(() => {
    const configs = storage.getApiConfigs();
    if (configs.gemini?.selectedModel) {
      setActiveModel(configs.gemini.selectedModel);
    }
  }, []);

  // When switching away from universe, set camera to hud-view
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'universe') {
      setCameraMode('cinematic');
    } else {
      setCameraMode('hud-view');
    }
  };

  // Launch chat directly from an agent
  const handleLaunchAgentChat = (agent: AIAgent) => {
    setActiveProvider(agent.defaultProvider);
    setActiveModel(agent.defaultModel);
    setActiveTab('chat');
    sounds.playWarp();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#05050b] text-[#e2e8f0] font-rajdhani select-none">
      {/* 3D WebGL Three.js AI Core Universe Canvas */}
      <ThreeCoreUniverse
        cameraMode={cameraMode}
        corePower={corePower}
        rotationSpeed={rotationSpeed}
        hologramColor={hologramColor}
        onCoreClick={() => {
          sounds.playCorePulse();
          setCorePower(1.6);
          setTimeout(() => setCorePower(1.0), 900);
        }}
      />

      {/* Cybernetic Scanlines Effect */}
      <div className="absolute inset-0 pointer-events-none scanline opacity-30 z-10" />

      {/* Top Sci-Fi Navigation Deck */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        activeProvider={activeProvider}
        activeModel={activeModel}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenApiWizard={() => setIsOnboardingOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      {/* Main Content Area based on Active Tab */}
      <div className="relative z-20 w-full h-full">
        {activeTab === 'universe' && (
          <UniverseHero
            cameraMode={cameraMode}
            setCameraMode={setCameraMode}
            corePower={corePower}
            setCorePower={setCorePower}
            rotationSpeed={rotationSpeed}
            setRotationSpeed={setRotationSpeed}
            hologramColor={hologramColor}
            setHologramColor={setHologramColor}
            onNavigate={handleTabChange}
          />
        )}

        {activeTab === 'chat' && (
          <ChatWorkspace
            activeProvider={activeProvider}
            setActiveProvider={setActiveProvider}
            activeModel={activeModel}
            setActiveModel={setActiveModel}
            onOpenApiVault={() => handleTabChange('api')}
          />
        )}

        {activeTab === 'arena' && <ModelArena />}

        {activeTab === 'api' && (
          <ApiVault
            activeProvider={activeProvider}
            setActiveProvider={setActiveProvider}
            activeModel={activeModel}
            setActiveModel={setActiveModel}
          />
        )}

        {activeTab === 'memory' && <MemoryEngine />}

        {activeTab === 'agents' && (
          <AgentNexus onLaunchAgentChat={handleLaunchAgentChat} />
        )}

        {activeTab === 'code' && (
          <CodingWorkspace
            activeProvider={activeProvider}
            activeModel={activeModel}
          />
        )}

        {activeTab === 'tools' && (
          <ToolCenter
            activeProvider={activeProvider}
            activeModel={activeModel}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsCenter />}

        {activeTab === 'security' && <SecurityCenter />}
      </div>

      {/* First-time / Manual AI Setup Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(provider, model) => {
          setActiveProvider(provider);
          setActiveModel(model);
          setActiveTab('chat');
        }}
      />

      {/* Interactive System Holocron / Guided Tour Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onNavigateToTab={handleTabChange}
      />

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}
