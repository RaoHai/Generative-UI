'use client';

import React, { useState, useEffect } from 'react';
import StreamingChat from '../components/StreamingChat';

const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8080';

// Level data with descriptions and code examples
const levelData = [
  {
    id: 1,
    title: "Level 1: Assisted Generation",
    emoji: "🎨",
    agentName: "enhanced_markdown",
    description: "AI as a designer's co-pilot. The user is a creator (designer, developer), and the AI is a tool used to produce static assets more efficiently.",
    features: ["Static design assets", "Accelerated design cycles", "Code generation", "Design system alignment"],
    codeExample: `// AI-assisted design generation
const generateComponent = async (prompt) => {
  const design = await ai.generateDesign({
    prompt: "Create a user profile card",
    style: "modern",
    framework: "react"
  });

  return design;
};

// Output: Static React component code
// Developer reviews and integrates manually`,
    color: "from-blue-100 to-blue-200"
  },
  {
    id: 2,
    title: "Level 2: Adaptive Composition",
    emoji: "🔄",
    agentName: "enhanced_markdown",
    description: "UI as a dynamic, personalized surface. The user is a consumer, and the AI is a curator that dynamically assembles a personalized interface in real-time.",
    features: ["Real-time personalization", "Component composition", "Server-driven UI", "Dynamic assembly"],
    codeExample: `// Server-driven UI with personalization
const PersonalizedUI = ({ userId, context }) => {
  const [uiConfig, setUiConfig] = useState(null);

  useEffect(() => {
    const config = personalizer.compose({
      userId,
      context,
      preferences: userPreferences,
      behavior: userBehavior
    });
    setUiConfig(config);
  }, [userId, context]);

  return <ComponentRenderer config={uiConfig} />;
};`,
    color: "from-green-100 to-green-200"
  },
  {
    id: 3,
    title: "Level 3: Conversational Orchestration",
    emoji: "💬",
    agentName: "enhanced_markdown",
    description: "UI as a fluid, interactive partner. The user is a director, and the AI is a collaborator that reconfigures the interface and executes tasks based on natural language dialogue.",
    features: ["Natural language dialogue", "Dynamic reconfiguration", "Context awareness", "Task execution"],
    codeExample: `// Conversational UI orchestration
const ConversationalUI = () => {
  const [conversation, setConversation] = useState([]);
  const [uiState, setUIState] = useState({});

  const handleUserInput = async (input) => {
    const response = await agent.processDialogue({
      input,
      context: uiState,
      conversation
    });

    // AI reconfigures UI and executes actions
    setUIState(response.newUIState);
    setConversation([...conversation, input, response.reply]);
  };

  return <FluidInterface state={uiState} onInput={handleUserInput} />;
};`,
    color: "from-purple-100 to-purple-200"
  },
  {
    id: 4,
    title: "Level 4: Agentic Delegation",
    emoji: "🤖",
    agentName: "enhanced_markdown",
    description: "UI as a workspace for autonomous agents. The user is a principal, and the AI is an agent that autonomously uses the application's interface and APIs to achieve high-level goals.",
    features: ["Autonomous execution", "Multi-step planning", "Goal delegation", "End-to-end automation"],
    codeExample: `// Autonomous agent delegation
const AgenticWorkspace = () => {
  const [goals, setGoals] = useState([]);
  const [agentStatus, setAgentStatus] = useState('idle');

  const delegateGoal = async (goal) => {
    const agent = new AutonomousAgent({
      tools: availableTools,
      apis: systemAPIs,
      workspace: currentWorkspace
    });

    // Agent plans and executes multi-step process
    const result = await agent.executeGoal({
      goal,
      onProgress: (status) => setAgentStatus(status),
      onComplete: (result) => handleCompletion(result)
    });

    return result;
  };

  return <AgentWorkspace onDelegate={delegateGoal} status={agentStatus} />;
};`,
    color: "from-indigo-100 to-indigo-200"
  }
];


// Main component
export default function HomePage() {
  const [selectedLevel, setSelectedLevel] = useState(1);

  const currentLevel = levelData[selectedLevel - 1];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-full mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Generative UI Playground
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-500">
              {currentLevel.title}
            </span>
            <button className="text-slate-600 hover:text-slate-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Left/Right Layout */}
      <main className="max-w-full mx-auto px-8 py-6 flex gap-6 h-[calc(100vh-4rem)]">
        {/* Left Panel - 55% width for better balance */}
        <div className="w-[55%] flex flex-col">
          {/* Generative UI Maturity Spectrum */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Generative UI Maturity Spectrum</h2>
            <p className="text-slate-600 mb-6">
              Explore different levels of UI generation maturity, from basic Markdown to fully interactive agent-driven interfaces.
            </p>

            {/* Timeline */}
            <div className="relative mb-8">
              {/* Timeline Line */}
              <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200"></div>

              {/* Timeline Levels */}
              <div className="relative grid grid-cols-4 gap-4">
                {levelData.map((level) => (
                  <div key={level.id} className="text-center">
                    <button
                      onClick={() => setSelectedLevel(level.id)}
                      className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white shadow-md transition-all ${
                        selectedLevel === level.id
                          ? `bg-gradient-to-br ${level.color} ring-2 ring-blue-500 ring-offset-2`
                          : `bg-gradient-to-br ${level.color} hover:scale-105`
                      }`}
                    >
                      <span className="text-lg">{level.emoji}</span>
                    </button>
                    <div className={`bg-white/90 backdrop-blur-sm rounded-lg p-2 border ${
                      selectedLevel === level.id ? 'border-blue-300 shadow-md' : 'border-slate-200/50'
                    } min-h-[80px] transition-all`}>
                      <h3 className="font-semibold text-slate-900 mb-1 text-xs">Level {level.id}</h3>
                      <h4 className="font-medium text-slate-800 mb-1 text-xs">
                        {level.title.split(':')[1]?.trim() || level.title}
                      </h4>
                      <p className="text-slate-600 text-xs leading-tight">
                        {level.description.split('.')[0]}.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Level Details */}
          <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/50 p-6 overflow-auto">
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${currentLevel.color} rounded-lg flex items-center justify-center mr-4`}>
                <span className="text-xl">{currentLevel.emoji}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{currentLevel.title}</h3>
              </div>
            </div>

            <p className="text-slate-700 mb-6 leading-relaxed">{currentLevel.description}</p>

            {/* Features */}
            <div className="mb-6">
              <h4 className="font-semibold text-slate-900 mb-3">Key Features</h4>
              <div className="grid grid-cols-2 gap-2">
                {currentLevel.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Code Example */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Code Example</h4>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-auto text-sm">
                <code>{currentLevel.codeExample}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Right Panel - 45% width for better chat area */}
        <div className="w-[45%] bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/50 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200/50">
            <h3 className="font-semibold text-slate-900">AI Assistant</h3>
            <p className="text-sm text-slate-500">Ask about the selected level</p>
          </div>

          <StreamingChat
            apiEndpoint={`${endpoint}/api/agents/v1/chat/completions`}
            agentName={currentLevel.agentName}
          />
        </div>
      </main>
    </div>
  );
}
