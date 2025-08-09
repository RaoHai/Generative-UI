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
    <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/50">
      <h3 className="font-semibold text-slate-900">{title}</h3>
    </div>
    <div className="grid grid-cols-2">
      <div className="p-4 border-r border-slate-200/50">
        <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">Traditional UI</div>
        <p className="text-sm text-slate-700">{traditional}</p>
      </div>
      <div className="p-4">
        <div className="text-xs text-blue-600 uppercase tracking-wide mb-2 font-medium">Generative UI</div>
        <p className="text-sm text-slate-700">{generative}</p>
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
          <div className="text-sm text-slate-500">Runtime Interface Generation</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">

        {/* Concept Introduction */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Beyond <span className="gradient-text">Static Interfaces</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Generative UI represents a paradigm shift from traditional static interfaces to
              <strong className="text-blue-600"> runtime-generated, context-aware user experiences</strong> powered by AI Agents.
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
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">AI Coding vs <span className="gradient-text">Generative UI</span></h2>
          <div className="grid gap-4">
            <ConceptCard
              title="Development Phase"
              traditional="Code generated during development, reviewed by developers, then compiled and deployed"
              generative="Interface generated at runtime by AI Agent based on real-time context and user input"
            />
            <ConceptCard
              title="User Experience"
              traditional="Same static interface for all users, predetermined layouts and interactions"
              generative="Personalized interface for each user, adaptive layouts based on context and behavior"
            />
            <ConceptCard
              title="Flexibility"
              traditional="Limited to predefined components and layouts, changes require code updates"
              generative="Unlimited possibilities, AI can create novel interface patterns and interactions"
            />
          </div>
        </section>

        {/* Core Capabilities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Core Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="🧠"
              title="Context Awareness"
              description="AI analyzes real-time context, user input, and interaction history to determine optimal interface structure"
            />
            <FeatureCard
              icon="⚡"
              title="Runtime Generation"
              description="Interfaces created dynamically during user interaction, not predetermined during development"
            />
            <FeatureCard
              icon="🎨"
              title="Adaptive Design"
              description="Layout, components, and interactions automatically adjust based on user needs and preferences"
            />
            <FeatureCard
              icon="🔄"
              title="Continuous Learning"
              description="System improves interface generation based on user feedback and interaction patterns"
            />
            <FeatureCard
              icon="🚀"
              title="Infinite Possibilities"
              description="Break free from component library constraints, create entirely new interface patterns"
            />
            <FeatureCard
              icon="📱"
              title="Cross-Platform"
              description="Single AI Agent generates optimal interfaces for different devices and platforms"
            />
          </div>
        </section>

        {/* Technical Implementation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Implementation Architecture</h2>
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

        {/* Use Cases */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Application Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/50 p-6">
              <div className="flex items-center mb-3">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">Production Ready</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Intelligent Form Generation</h3>
              <p className="text-slate-600 text-sm">AI generates optimal form layouts and validation rules based on data types and business logic</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/50 p-6">
              <div className="flex items-center mb-3">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                <span className="text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded">In Development</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Dynamic Dashboard Creation</h3>
              <p className="text-slate-600 text-sm">Real-time generation of relevant charts and controls based on data characteristics and user roles</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/50 p-6">
              <div className="flex items-center mb-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">Research</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Adaptive Content Editors</h3>
              <p className="text-slate-600 text-sm">Context-aware editing tools that adapt based on content type and user preferences</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/50 p-6">
              <div className="flex items-center mb-3">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                <span className="text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded">Concept</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Personalized Shopping Interfaces</h3>
              <p className="text-slate-600 text-sm">Dynamic product displays and recommendation modules based on user behavior and preferences</p>
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
