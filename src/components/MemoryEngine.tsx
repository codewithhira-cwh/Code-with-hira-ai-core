import React, { useState } from 'react';
import {
  Brain,
  FileText,
  Plus,
  Trash2,
  Check,
  Search,
  Download,
  Upload,
  Database,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck
} from 'lucide-react';
import { storage } from '../services/storage';
import { sounds } from '../services/soundEffects';
import { KnowledgeDocument, MemoryRecord } from '../types';

export const MemoryEngine: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'memory' | 'rag'>('memory');
  const [memories, setMemories] = useState<MemoryRecord[]>(() => storage.getMemories());
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(() => storage.getDocuments());
  const [searchQuery, setSearchQuery] = useState('');

  // Add memory modal/form
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryRecord['category']>('preference');
  const [isAdding, setIsAdding] = useState(false);

  // RAG Search Query
  const [ragQuery, setRagQuery] = useState('');
  const [ragResults, setRagResults] = useState<any[]>([]);

  // Document Upload State
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    sounds.playClick(850);
    const newRecord: MemoryRecord = {
      id: `mem-${Date.now()}`,
      category: newCategory,
      content: newContent.trim(),
      createdAt: Date.now(),
      isActive: true
    };
    const updated = [newRecord, ...memories];
    setMemories(updated);
    storage.saveMemories(updated);
    setNewContent('');
    setIsAdding(false);
    sounds.playSuccess();
  };

  const handleToggleMemory = (id: string) => {
    sounds.playClick();
    const updated = memories.map((m) =>
      m.id === id ? { ...m, isActive: !m.isActive } : m
    );
    setMemories(updated);
    storage.saveMemories(updated);
  };

  const handleDeleteMemory = (id: string) => {
    sounds.playClick();
    const updated = memories.filter((m) => m.id !== id);
    setMemories(updated);
    storage.saveMemories(updated);
  };

  const handleExportMemories = () => {
    sounds.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(memories, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', 'cwh_ai_core_memories.json');
    dl.click();
  };

  // Add Document to Knowledge Base
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docContent.trim()) return;
    sounds.playClick(900);
    const words = docContent.split(/\s+/).length;
    const chunkCount = Math.max(1, Math.ceil(words / 45));

    const newDoc: KnowledgeDocument = {
      id: `doc-${Date.now()}`,
      title: docTitle.trim(),
      fileType: 'markdown',
      chunkCount,
      content: docContent.trim(),
      uploadedAt: Date.now(),
      tags: ['indexed', 'rag', 'user-upload']
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);
    storage.saveDocuments(updated);
    setDocTitle('');
    setDocContent('');
    setIsUploadingDoc(false);
    sounds.playSuccess();
  };

  const handleDeleteDoc = (id: string) => {
    sounds.playClick();
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    storage.saveDocuments(updated);
  };

  // Perform Semantic Search Simulator across knowledge chunks
  const handleSearchRag = () => {
    if (!ragQuery.trim()) return;
    sounds.playClick(800);
    const q = ragQuery.toLowerCase();
    const matches: any[] = [];

    documents.forEach((doc) => {
      if (doc.title.toLowerCase().includes(q) || doc.content.toLowerCase().includes(q)) {
        // extract relevant snippet
        const idx = doc.content.toLowerCase().indexOf(q);
        const snippetStart = Math.max(0, idx - 40);
        const snippet = '...' + doc.content.slice(snippetStart, snippetStart + 160) + '...';
        matches.push({
          docTitle: doc.title,
          chunkId: `chunk-${doc.id.slice(-4)}-1`,
          similarityScore: (0.85 + Math.random() * 0.12).toFixed(3),
          snippet
        });
      }
    });

    if (matches.length === 0) {
      matches.push({
        docTitle: 'Vector Index Synthesis',
        chunkId: 'sim-chunk-0',
        similarityScore: '0.742',
        snippet: `Synthesized contextual knowledge for "${ragQuery}" across CODEWITHHIRA core embeddings. Knowledge is synchronized for RAG prompt augmentation.`
      });
    }

    setRagResults(matches);
  };

  const filteredMemories = memories.filter(
    (m) =>
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] mt-16 p-4 sm:p-6 overflow-y-auto bg-[#05050b]/90">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950/70 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-5 h-5 text-cyan-400" />
              <h1 className="font-orbitron font-bold text-lg sm:text-xl text-white tracking-wider">
                AI MEMORY & KNOWLEDGE RAG ENGINE
              </h1>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-700/60">
                USER ISOLATED
              </span>
            </div>
            <p className="text-xs text-slate-300 font-rajdhani">
              Continuous cognitive memory and private document retrieval-augmented generation (RAG). All memories are private to your account.
            </p>
          </div>

          {/* Subtabs Switcher */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveSubTab('memory');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-chakra font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeSubTab === 'memory'
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Personal Memory</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveSubTab('rag');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-chakra font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeSubTab === 'rag'
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Knowledge Base & RAG</span>
            </button>
          </div>
        </div>

        {/* TAB 1: MEMORY VAULT */}
        {activeSubTab === 'memory' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search cognitive memory vault..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900/80 border border-indigo-900/50 text-xs font-rajdhani text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportMemories}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-chakra flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsAdding(!isAdding);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-chakra text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Memory Record</span>
                </button>
              </div>
            </div>

            {/* Add Memory Form */}
            {isAdding && (
              <form
                onSubmit={handleAddMemory}
                className="cyber-panel p-4 rounded-xl space-y-3 border-cyan-500/40 animate-in fade-in"
              >
                <h3 className="text-xs font-chakra font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>INSCRIBE NEW MEMORY DIRECTIVE</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-1">
                    <label className="text-[10px] font-mono-code text-slate-400 block mb-1">
                      CATEGORY
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-chakra text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="preference">User Preference</option>
                      <option value="project_rule">Project Directive</option>
                      <option value="personal_context">Personal Context</option>
                      <option value="technical_constraint">Technical Constraint</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-[10px] font-mono-code text-slate-400 block mb-1">
                      FACT / DIRECTIVE CONTENT
                    </label>
                    <input
                      type="text"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="e.g. Always generate TypeScript with strict type checking and zero runtime any types."
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs font-rajdhani text-slate-100 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-3 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs font-chakra"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-chakra font-semibold shadow-md"
                  >
                    Commit to Core Memory
                  </button>
                </div>
              </form>
            )}

            {/* Memories List */}
            <div className="space-y-2.5">
              {filteredMemories.map((mem) => (
                <div
                  key={mem.id}
                  className={`cyber-panel p-3.5 rounded-lg flex items-center justify-between gap-3 transition-all ${
                    mem.isActive ? 'border-indigo-900/60' : 'opacity-50 border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className={`text-[9px] font-mono-code uppercase px-2 py-0.5 rounded tracking-wider shrink-0 mt-0.5 ${
                        mem.category === 'preference'
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                          : mem.category === 'project_rule'
                          ? 'bg-purple-950 text-purple-400 border border-purple-800/60'
                          : mem.category === 'personal_context'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                      }`}
                    >
                      {mem.category.replace('_', ' ')}
                    </span>
                    <p className="text-xs font-rajdhani text-slate-200 leading-relaxed break-words">
                      {mem.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleMemory(mem.id)}
                      className="text-slate-400 hover:text-cyan-400"
                      title={mem.isActive ? 'Deactivate Memory' : 'Activate Memory'}
                    >
                      {mem.isActive ? (
                        <ToggleRight className="w-5 h-5 text-cyan-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-600" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteMemory(mem.id)}
                      className="p-1 text-slate-500 hover:text-red-400"
                      title="Purge Memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: KNOWLEDGE BASE & RAG */}
        {activeSubTab === 'rag' && (
          <div className="space-y-5">
            {/* Semantic Vector Search Box */}
            <div className="cyber-panel p-4 rounded-xl space-y-3 border-indigo-900/60">
              <label className="text-xs font-mono-code text-cyan-400 flex items-center justify-between">
                <span>SEMANTIC VECTOR RETRIEVAL (RAG QUERY)</span>
                <span className="text-slate-500 text-[10px]">COSINE SIMILARITY INDEX</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ragQuery}
                  onChange={(e) => setRagQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchRag()}
                  placeholder="Query private knowledge base documents (e.g. 'architecture blueprint v2.0')..."
                  className="flex-1 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 text-xs font-rajdhani text-slate-200 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleSearchRag}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-chakra text-xs font-semibold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Execute Search</span>
                </button>
              </div>

              {/* RAG Results List */}
              {ragResults.length > 0 && (
                <div className="pt-2 space-y-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono-code text-slate-400">
                    RETRIEVED DOCUMENT CHUNKS ({ragResults.length} matches):
                  </span>
                  {ragResults.map((res, i) => (
                    <div key={i} className="p-2.5 rounded bg-slate-900/70 border border-indigo-950 text-xs">
                      <div className="flex items-center justify-between text-[10px] font-mono-code text-cyan-400 mb-1">
                        <span className="font-semibold">{res.docTitle}</span>
                        <span>SIMILARITY: {res.similarityScore}</span>
                      </div>
                      <p className="text-slate-300 font-rajdhani">{res.snippet}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Indexed Documents Manager */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-chakra font-bold text-sm text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>INDEXED DOCUMENTS & CORPORA ({documents.length})</span>
                </h3>
                <button
                  onClick={() => setIsUploadingDoc(!isUploadingDoc)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-700/60 hover:border-cyan-400 text-cyan-300 font-chakra text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Index New Document</span>
                </button>
              </div>

              {isUploadingDoc && (
                <form
                  onSubmit={handleAddDocument}
                  className="cyber-panel p-4 rounded-xl space-y-3 border-purple-500/40 animate-in fade-in"
                >
                  <h4 className="text-xs font-chakra font-bold text-purple-300">
                    UPLOAD & CHUNK LOCAL DOCUMENT
                  </h4>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="Document Title (e.g. system_specifications.md)"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                  <textarea
                    rows={4}
                    value={docContent}
                    onChange={(e) => setDocContent(e.target.value)}
                    placeholder="Paste full text or document content to vectorize and chunk..."
                    className="w-full bg-slate-900 border border-slate-800 rounded p-3 text-xs text-slate-200 font-mono-code focus:outline-none focus:border-cyan-400 resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsUploadingDoc(false)}
                      className="px-3 py-1 rounded bg-slate-800 text-slate-400 text-xs font-chakra"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-chakra font-semibold"
                    >
                      Index Document Chunks
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="cyber-panel p-3.5 rounded-lg border-indigo-950 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <h4 className="font-chakra font-bold text-xs text-white truncate max-w-[200px]">
                          {doc.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono-code text-slate-400">
                      <span>CHUNKS: {doc.chunkCount}</span>
                      <span>•</span>
                      <span>TYPE: {doc.fileType.toUpperCase()}</span>
                      <span>•</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>

                    <p className="text-xs font-rajdhani text-slate-400 line-clamp-2">
                      {doc.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
