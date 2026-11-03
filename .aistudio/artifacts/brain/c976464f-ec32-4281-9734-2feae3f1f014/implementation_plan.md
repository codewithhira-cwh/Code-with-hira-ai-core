# CODEWITHHIRA AI CORE — Step-by-Step Interactive Tutorial & Guide Plan

## Objective
Provide a complete, step-by-step walkthrough explaining how every module in **CODEWITHHIRA AI CORE** operates, accompanied by a new interactive in-app **Guided Tour & Holocron Academy** component that guides users visually through all features.

---

## 1. Step-by-Step User Workflow (How the App Works)

### Step 1: 3D Universe & Core Matrix
- **Mechanism**: Three.js WebGL canvas runs a real-time procedural AI Core with gyroscopic rotating metallic rings, a swirling particle field, dynamic point lights, and ACES Filmic tone mapping.
- **Controls**:
  - Drag or move your mouse to tilt the camera.
  - Use the bottom control dock to toggle camera views (*Cinematic Orbit*, *Core Singularity*, *Tactical Matrix*, *Zen HUD*).
  - Adjust the **Core Pulse Frequency** and **Gyroscopic Velocity** sliders, or click "Emit Quantum Burst" to overcharge the core.
  - Collapse the dock into **Cinema Mode** anytime with the "Minimize Dock" toggle.

### Step 2: Personal API Management Vault
- **Mechanism**: Every user maintains their own API credentials. The client encrypts keys locally without exposing them to the server.
- **How to Connect**:
  1. Click **API Vault** in the top navigation.
  2. Select your provider (**Google Gemini**, **OpenAI**, **Anthropic Claude**, **DeepSeek**, or **Custom Endpoint**).
  3. Enter your API key (for Gemini, the system server key is pre-configured by default, but you can enter your own `AIza...` key to use your own quotas).
  4. Click **Test Connection** to execute a real latency ping and verify credentials.
  5. Click **Set as Active** to activate that engine for your conversations.

### Step 3: Neural Chat Workspace
- **Mechanism**: Full-duplex Server-Sent Events (SSE) streaming connected to the server proxy (`/api/chat/stream`).
- **Features**:
  - Live chunk streaming with zero lag.
  - Switch models dynamically mid-session using the model dropdown.
  - Toggle **Web Search Grounding** to enrich answers with live internet citations.
  - Use the **Voice Input (STT)** microphone button to speak your prompts.
  - Click **Voice Read (TTS)** on any response to have the AI speak aloud.
  - Copy markdown or code with one click, or export the conversation as `.md` or `.json`.

### Step 4: Multi-Model Benchmark Arena
- **Mechanism**: Parallel execution engine (`/api/arena/compare`).
- **Workflow**:
  1. Type a benchmark stimulus into the prompt console.
  2. Click **Dispatch to All Models**.
  3. Watch Gemini 3.8 Flash, Gemini 3.8 Pro, GPT-4o, and Claude 3.7 Sonnet generate outputs side-by-side.
  4. Compare latency in milliseconds, token efficiency, and estimated cost, then vote for the superior response.

### Step 5: Memory Engine & Knowledge RAG
- **Mechanism**: Dual-layer cognitive storage.
  - **Memory Vault**: Stores user preferences and project rules. The AI Core consults these rules during chats.
  - **Knowledge Base**: Paste or upload documents. The system chunks the text and performs semantic vector search to augment answers.

### Step 6: Multi-AI Agent Nexus & Coding Lab
- **Agent Nexus**: Launch direct dialogues with autonomous specialists (*Nexus Core Architect*, *Quantum Researcher*, *Cyber Sentinel*, *Content Alchemist*) or click **Forge New Agent** to build a custom assistant with personalized system prompts.
- **Coding Lab**: Multi-language code generation (TypeScript, Python, JavaScript, C++, SQL), automated security auditing, algorithmic speed optimization, and sandboxed run simulation.

### Step 7: Tool Matrix, Analytics & Security Center
- **Tool Matrix**: Rapid utilities for JSON prettifying/minifying, text summarization, and multi-language translation.
- **Analytics**: Real-time token flux tracking, provider ratio distribution, and custom budget limits.
- **Security**: Zero-trust enclave status, SSRF URL filters, and immutable audit logs.

---

## 2. Planned Implementation Tasks

1. **Create `TutorialModal.tsx`**:
   - An interactive 7-step visual Holocron tour modal with slide-by-slide diagrams, feature callouts, and "Jump to Feature" action buttons.
2. **Add "SYSTEM TOUR & GUIDE" button in Navigation**:
   - Add a quick-access help icon/button in the top header so any user can open the complete step-by-step tutorial at any time.
3. **Verify Build & Compilation**:
   - Run `compile_applet` and `lint_applet` to ensure seamless execution.
