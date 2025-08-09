# Generative UI

As the capabilities of Large Language Models (LLMs) and the complexity of AI Agent application scenarios continue to evolve, a promising concept has emerged: can we extend the generative paradigm from text and content generation to interface and application generation - what we call Generative UI?

This differs from traditional AI Coding. AI Coding assists in generating web application code during development, which is then reviewed by developers, compiled, and deployed to users. Generative UI, however, is a run-time product dynamically generated and assembled by AI. The application's layout, components, and even overall interaction logic are determined by AI Agents in real-time based on context, user input, and reasoning.

## Generative UI Maturity Spectrum

To establish a clear foundation for discussion, we must first create a precise taxonomy for "Generative UI." It's not a single technical concept, but rather a spectrum covering different maturity levels. This classification helps us understand the core problems that different technical approaches aim to solve.

### Level 0: Markdown Expression and Enhanced Markdown Expression

At the most basic level, AI generates responses in Markdown format to present structured content, lists, tables, and basic formatting. Enhanced Markdown takes this further by incorporating interactive elements, rich media embedding, and dynamic content within the Markdown structure. This represents the simplest form of generative UI, where the presentation layer is limited to text formatting and basic document structure.

### Level 1: AI-Assisted Code Generation

At this stage, Large Language Models (LLMs) serve as development assistants. Developers use natural language prompts or design mockups to generate static code snippets like HTML, CSS, or React components through LLMs. This is currently the most common application form, aimed at improving development efficiency, but the final output remains static code that requires manual integration and deployment.

### Level 2: Conditional and Dynamic UI

At this level, servers or AI agents select and combine components from a predefined, limited UI component library based on context (such as user roles, behavioral data, etc.). The components themselves are static, but their presentation and combination methods are dynamic. This pattern is often mistaken for true generative UI, but it's essentially rule-based dynamic rendering rather than real-time generation.

### Level 3: Abstract Assembly (SDUI)

This is the core of the "abstract assembly" approach. AI or servers no longer generate final code, but instead produce a declarative, abstract UI representation (e.g., JSON-formatted metadata). The client has a built-in universal rendering engine (SDK) that parses this abstract description and maps it to native UI controls for rendering. This is a powerful pattern for achieving dynamic, cross-platform UI.

### Level 4: Interactive and Agent-Driven UI

This is the highest form of Generative UI. The UI is no longer a one-way display, but a real-time, bidirectional dialogue medium between users and AI agents. AI agents can not only generate interfaces but also understand and respond to user interactions with these interface elements, forming a continuous feedback loop. This advanced form requires specialized protocols (like AG-UI) and platforms (like Thesys) for support, representing truly intelligent interactive experiences.

