'use client';

import React, { useState, useEffect } from 'react';

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-slate-200/50">
    <div className="text-2xl mb-3">{icon}</div>
    <h3 className="text-lg font-semibold mb-2 text-slate-900">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const ConceptCard = ({ title, traditional, generative }: { title: string; traditional: string; generative: string }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/50 overflow-hidden">
    <div className="px-3 py-1.5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/50">
      <h3 className="font-semibold text-slate-900 text-xs">{title}</h3>
    </div>
    <div className="grid grid-cols-2">
      <div className="p-2 border-r border-slate-200/50">
        <div className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Traditional</div>
        <p className="text-xs text-slate-700 leading-tight">{traditional}</p>
      </div>
      <div className="p-2">
        <div className="text-xs text-blue-600 uppercase tracking-wide mb-0.5 font-medium">Generative</div>
        <p className="text-xs text-slate-700 leading-tight">{generative}</p>
      </div>
    </div>
  </div>
);

const TypewriterText = ({ text, speed = 50 }: { text: string; speed?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <span>{displayText}<span className="animate-pulse text-blue-500">|</span></span>;
};

const ParticleBackground = () => {
  const [particles, setParticles] = useState<Array<{id: number, size: number, left: number, delay: number}>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      delay: Math.random() * 15
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="particles">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  );
};

export default function HomePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedComponent, setGeneratedComponent] = useState(0);

  const generateInterface = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedComponent(prev => (prev + 1) % 4);
    }, 3000);
  };

  const componentExamples = [
    "Dynamic form with context-aware field validation",
    "Adaptive dashboard with personalized widget layout",
    "Smart content editor with contextual toolbar",
    "Intelligent data visualization with auto-generated charts"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      <ParticleBackground />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 relative z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-bold text-lg gradient-text">Generative UI</div>
          <div className="flex items-center space-x-4">
            <a
              href="/playground"
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              🎮 体验 Playground
            </a>
            <div className="text-sm text-slate-500">Runtime Interface Generation</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">

        {/* Concept Introduction */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              <span className="gradient-text">Generative UI</span> Maturity Spectrum
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Extending the generative paradigm from text and content generation to interface and application generation.
              Generative UI represents <strong className="text-blue-600">runtime-generated, AI-driven user experiences</strong>
              that adapt dynamically to context, user input, and real-time reasoning.
            </p>
          </div>

          {/* Interactive Demo */}
          <div className="glass-card rounded-xl p-6 mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Live Generation Demo</h2>
                <button
                  onClick={generateInterface}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isGenerating ? '⚡ Generating...' : '🎯 Generate Interface'}
                </button>
              </div>

              <div className="bg-slate-50/70 backdrop-blur-sm rounded border border-slate-200/50 p-4 min-h-24 flex items-center relative overflow-hidden">
                {isGenerating && <div className="absolute inset-0 shimmer"></div>}
                {isGenerating ? (
                  <div className="text-slate-600 relative z-10">
                    <TypewriterText text="AI Agent analyzing context and generating optimal interface layout..." />
                  </div>
                ) : (
                  <div className="text-slate-800 relative z-10">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Generated: {componentExamples[generatedComponent]}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Key Differences */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Traditional UI vs <span className="gradient-text">Generative UI</span></h2>
          <div className="grid gap-2">
            <ConceptCard
              title="Interface Creation"
              traditional="Static interfaces designed and coded during development phase"
              generative="Dynamic interfaces generated at runtime by AI based on context"
            />
            <ConceptCard
              title="User Experience"
              traditional="Same fixed interface for all users with predetermined layouts"
              generative="Personalized interfaces that adapt to individual users and contexts"
            />
            <ConceptCard
              title="Adaptability"
              traditional="Limited to predefined components, changes require development cycles"
              generative="Infinite possibilities with AI creating novel patterns in real-time"
            />
          </div>
        </section>

                                {/* Generative UI Maturity Spectrum */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Generative UI Maturity Spectrum</h2>
          <p className="text-slate-600 mb-4 max-w-4xl text-sm">
            Generative UI encompasses a spectrum of maturity levels, from basic document formatting to fully interactive agent-driven interfaces.
            Understanding these levels helps identify the appropriate approach for different use cases.
          </p>

                    {/* Compact Timeline Layout */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-5 left-0 right-0 h-px bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200"></div>

            {/* Timeline Levels */}
            <div className="relative grid grid-cols-5 gap-2">
              {/* Level 0 */}
              <div className="text-center">
                <div className="relative z-10 w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-white shadow-md">
                  <span className="text-sm">📝</span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1.5 border border-slate-200/50 min-h-[75px]">
                  <h3 className="font-semibold text-slate-900 mb-0.5 text-xs">Level 0</h3>
                  <h4 className="font-medium text-slate-800 mb-0.5 text-xs">Markdown</h4>
                  <p className="text-slate-600 text-xs leading-tight">Basic content & formatting</p>
                </div>
              </div>

                            {/* Level 1 */}
              <div className="text-center">
                <div className="relative z-10 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-white shadow-md">
                  <span className="text-sm">⚡</span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1.5 border border-slate-200/50 min-h-[75px]">
                  <h3 className="font-semibold text-slate-900 mb-0.5 text-xs">Level 1</h3>
                  <h4 className="font-medium text-slate-800 mb-0.5 text-xs">AI Code</h4>
                  <p className="text-slate-600 text-xs leading-tight">Static code generation</p>
                </div>
              </div>

              {/* Level 2 */}
              <div className="text-center">
                <div className="relative z-10 w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-white shadow-md">
                  <span className="text-sm">🔄</span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1.5 border border-slate-200/50 min-h-[75px]">
                  <h3 className="font-semibold text-slate-900 mb-0.5 text-xs">Level 2</h3>
                  <h4 className="font-medium text-slate-800 mb-0.5 text-xs">Dynamic UI</h4>
                  <p className="text-slate-600 text-xs leading-tight">Context-driven selection</p>
                </div>
              </div>

              {/* Level 3 */}
              <div className="text-center">
                <div className="relative z-10 w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-white shadow-md">
                  <span className="text-sm">🏗️</span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1.5 border border-slate-200/50 min-h-[75px]">
                  <h3 className="font-semibold text-slate-900 mb-0.5 text-xs">Level 3</h3>
                  <h4 className="font-medium text-slate-800 mb-0.5 text-xs">SDUI</h4>
                  <p className="text-slate-600 text-xs leading-tight">Declarative universal rendering</p>
                </div>
              </div>

              {/* Level 4 */}
              <div className="text-center">
                <div className="relative z-10 w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-white shadow-md">
                  <span className="text-sm">🤖</span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1.5 border border-slate-200/50 min-h-[75px]">
                  <h3 className="font-semibold text-slate-900 mb-0.5 text-xs">Level 4</h3>
                  <h4 className="font-medium text-slate-800 mb-0.5 text-xs">Agent UI</h4>
                  <p className="text-slate-600 text-xs leading-tight">Interactive AI dialogue</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Implementation */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Implementation Architecture</h2>
          <div className="glass-card rounded-xl p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-xl"></div>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-xl">🔍</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Context Analysis</h3>
                <p className="text-sm text-slate-600">AI Agent processes user input, system state, and environmental context</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 text-xl">⚙️</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Interface Synthesis</h3>
                <p className="text-sm text-slate-600">LLM generates optimal component structure and interaction patterns</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 text-xl">🎯</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Runtime Rendering</h3>
                <p className="text-sm text-slate-600">Generated interface components are dynamically rendered in real-time</p>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Approaches */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Implementation Approaches</h2>
          <p className="text-slate-600 mb-4 max-w-4xl text-sm">
            Different maturity levels require distinct technical approaches and architectural considerations.
            Each level addresses specific use cases and complexity requirements.
          </p>

          {/* Balanced 2x2 Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Levels */}
            <div className="bg-gradient-to-br from-slate-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl border border-slate-200/50 p-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">📝</span>
                </div>
                <div>
                  <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">Level 0-1</span>
                  <h3 className="font-semibold text-slate-900 mt-1">Document & Code Generation</h3>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-4">Static content generation with Markdown formatting and AI-assisted code creation for development efficiency</p>
              <div className="text-xs text-slate-500">
                <span className="inline-block bg-slate-100 px-2 py-1 rounded mr-2 mb-1">Markdown</span>
                <span className="inline-block bg-slate-100 px-2 py-1 rounded mr-2 mb-1">Code Gen</span>
                <span className="inline-block bg-slate-100 px-2 py-1 rounded mr-2 mb-1">Static</span>
              </div>
            </div>

            {/* Dynamic UI */}
            <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-xl border border-green-200/50 p-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">🔄</span>
                </div>
                <div>
                  <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">Level 2</span>
                  <h3 className="font-semibold text-slate-900 mt-1">Rule-Based Dynamic UI</h3>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-4">Context-driven component selection from predefined libraries with conditional rendering logic</p>
              <div className="text-xs text-slate-500">
                <span className="inline-block bg-green-100 px-2 py-1 rounded mr-2 mb-1">Context-Aware</span>
                <span className="inline-block bg-green-100 px-2 py-1 rounded mr-2 mb-1">Component Library</span>
                <span className="inline-block bg-green-100 px-2 py-1 rounded mr-2 mb-1">Dynamic</span>
              </div>
            </div>

            {/* Abstract Assembly */}
            <div className="bg-gradient-to-br from-purple-50/80 to-violet-50/80 backdrop-blur-sm rounded-xl border border-purple-200/50 p-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">🏗️</span>
                </div>
                <div>
                  <span className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded">Level 3</span>
                  <h3 className="font-semibold text-slate-900 mt-1">Abstract Assembly (SDUI)</h3>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-4">Declarative UI descriptions with universal rendering engines for cross-platform compatibility</p>
              <div className="text-xs text-slate-500">
                <span className="inline-block bg-purple-100 px-2 py-1 rounded mr-2 mb-1">JSON Schema</span>
                <span className="inline-block bg-purple-100 px-2 py-1 rounded mr-2 mb-1">Universal SDK</span>
                <span className="inline-block bg-purple-100 px-2 py-1 rounded mr-2 mb-1">Cross-Platform</span>
              </div>
            </div>

            {/* Agent-Driven */}
            <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 p-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <span className="text-xs text-indigo-700 bg-indigo-100 px-2 py-1 rounded">Level 4</span>
                  <h3 className="font-semibold text-slate-900 mt-1">Agent-Driven Interfaces</h3>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-4">Fully interactive AI-driven UI with real-time generation, specialized protocols, and continuous feedback loops</p>
              <div className="text-xs text-slate-500">
                <span className="inline-block bg-indigo-100 px-2 py-1 rounded mr-2 mb-1">AI Agents</span>
                <span className="inline-block bg-indigo-100 px-2 py-1 rounded mr-2 mb-1">Real-time</span>
                <span className="inline-block bg-indigo-100 px-2 py-1 rounded mr-2 mb-1">Interactive</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-white/60 backdrop-blur-md mt-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div>Generative UI - Runtime Interface Generation</div>
            <div>Powered by AI Agents & LLM</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
