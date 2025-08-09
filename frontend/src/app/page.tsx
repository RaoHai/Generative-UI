'use client';

import React, { useState, useEffect } from 'react';

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="card rounded-xl p-6 group hover:scale-105">
    <div className="text-4xl mb-4 text-center">{icon}</div>
    <h3 className="text-xl font-semibold mb-3 text-slate-800">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

const DemoCard = ({ title, description, status }: { title: string; description: string; status: string }) => (
  <div className="card rounded-xl p-6 border-l-4 border-l-blue-500">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{status}</span>
    </div>
    <p className="text-slate-600">{description}</p>
  </div>
);

const TypewriterText = ({ text, speed = 100 }: { text: string; speed?: number }) => {
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

  return <span>{displayText}<span className="animate-pulse">|</span></span>;
};

export default function HomePage() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDemo = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setActiveDemo(prev => (prev + 1) % 4);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-bold text-xl gradient-text">Agentic GUI</div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">特性</a>
              <a href="#demos" className="text-slate-600 hover:text-slate-900 transition-colors">演示</a>
              <a href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">关于</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="gradient-text">生成式 UI</span>
                <br />
                <span className="text-slate-900">的新时代</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto text-balance">
                超越传统的静态界面，探索由 AI Agent 驱动的<strong>运行时动态生成</strong>用户界面
              </p>
            </div>

            <div className="animate-slide-up">
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <button
                  className="btn-primary"
                  onClick={generateDemo}
                  disabled={isGenerating}
                >
                  {isGenerating ? '🔄 正在生成...' : '🚀 体验演示'}
                </button>
                <button className="btn-secondary">
                  📖 了解更多
                </button>
              </div>
            </div>

            {/* Interactive Visual Element */}
            <div className="relative max-w-4xl mx-auto animate-float">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-200/50">
                <div className="text-left">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-slate-500 ml-2">
                      {isGenerating ? (
                        <TypewriterText text="AI Agent 正在生成界面..." />
                      ) : (
                        `演示 ${activeDemo + 1}/4 - 点击上方按钮查看动态生成`
                      )}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {isGenerating ? (
                      <>
                        <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gradient-to-r from-purple-200 to-indigo-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-gradient-to-r from-indigo-200 to-blue-200 rounded animate-pulse w-1/2"></div>
                      </>
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-sm text-slate-700">
                          {activeDemo === 0 && "生成的表单界面：智能字段布局，自适应验证"}
                          {activeDemo === 1 && "生成的仪表板：动态图表组合，个性化数据展示"}
                          {activeDemo === 2 && "生成的购物界面：智能商品推荐，个性化布局"}
                          {activeDemo === 3 && "生成的编辑器：适应性工具栏，智能功能选择"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              革命性的 UI 生成方式
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              与传统的 AI Coding 不同，生成式 UI 在运行时动态创建界面，为用户带来前所未有的个性化体验
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🧠"
              title="智能上下文感知"
              description="AI Agent 根据实时上下文、用户输入和历史交互，智能决定界面布局和组件选择"
            />
            <FeatureCard
              icon="⚡"
              title="运行时动态生成"
              description="不同于编译时生成，界面在用户交互的瞬间由 AI 实时创建和组装"
            />
            <FeatureCard
              icon="🎨"
              title="个性化界面"
              description="每个用户的界面都是独特的，基于其偏好、行为和当前需求动态调整"
            />
            <FeatureCard
              icon="🔄"
              title="自适应交互"
              description="界面不仅在视觉上适应，连交互逻辑都由 AI 根据场景实时优化"
            />
            <FeatureCard
              icon="🚀"
              title="无限可能性"
              description="突破传统组件库限制，AI 可以创造全新的界面模式和交互方式"
            />
            <FeatureCard
              icon="📱"
              title="跨平台一致"
              description="同一个 AI Agent 可以为不同设备和平台生成最适合的界面形态"
            />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demos" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              实际应用场景
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              从简单的表单到复杂的数据可视化，看看 AI Agent 如何为不同场景生成最合适的界面
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DemoCard
              title="智能表单生成器"
              description="根据数据类型和业务逻辑，AI 自动生成最优的表单布局和验证规则"
              status="可用"
            />
            <DemoCard
              title="动态数据仪表板"
              description="基于数据特征和用户角色，实时生成最相关的图表和控件组合"
              status="开发中"
            />
            <DemoCard
              title="个性化购物界面"
              description="根据用户购买历史和浏览行为，动态调整商品展示和推荐模块"
              status="规划中"
            />
            <DemoCard
              title="自适应文档编辑器"
              description="基于文档类型和编辑习惯，智能选择最合适的编辑工具和布局"
              status="规划中"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-8">
            推动界面技术的进步
          </h2>
          <div className="text-lg text-slate-700 leading-relaxed space-y-6">
            <p>
              随着 LLM 能力的不断提升和 AI Agent 应用场景的复杂化，我们正站在用户界面技术的新起点。
              生成式 UI 代表着从静态、预定义界面向动态、智能化界面的根本性转变。
            </p>
            <p>
              这不仅仅是技术的进步，更是用户体验的革命。每个用户都将拥有专属的、实时优化的界面，
              真正实现"千人千面"的个性化体验。
            </p>
            <p className="text-xl font-semibold gradient-text">
              让我们一起探索这个充满无限可能的新世界。
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4 gradient-text">Agentic GUI</div>
            <p className="text-slate-400 mb-6">生成式用户界面的未来，今天就开始</p>
            <div className="text-sm text-slate-500">
              © 2024 Agentic GUI. 探索 AI 驱动的界面生成技术
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
