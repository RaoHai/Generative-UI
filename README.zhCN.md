# 生成式 UI

随着大语言模型 (LLM) 的能力和 AI Agent 应用场景的复杂性不断发展，一个充满前景的概念应运而生：我们能否将生成式范式从文本和内容生成扩展到界面和应用生成——我们称之为生成式 UI (Generative UI)？

这与传统的 AI 编码不同。AI 编码在开发阶段协助生成 Web 应用程序代码，然后由开发人员审查、编译并部署给用户。而生成式 UI 则是一种由 AI 动态生成和组装的运行时产品。应用程序的布局、组件，甚至整体交互逻辑都由 AI Agent 根据上下文、用户输入和推理实时确定。

## 以“代理”为中心的成熟度光谱：交互范式的演进

生成式 UI 的演进，其核心并非是技术的堆砌，而是人机交互范式的根本性变革。AI 代理 (Agent)——一个能够代表用户自主执行任务的系统——贯穿于所有阶段 [1, 2]。关键的区别在于，随着技术成熟，代理的自主性不断增强，而人类的角色则从“直接操作者”逐步转变为“目标委托人”。因此，这个成熟度光谱是围绕着**人与代理交互范式**的演进而展开的。

### 第 1 级：开发者代理 (Developer's Agent) - 指令式交互

在初始阶段，AI 代理是作为**开发者**的“副驾驶”存在的。这里的代理自主性最低，其行为完全由开发者的明确、单次的指令驱动。交互范式是**指令式的**：开发者通过提示（Prompt）下达一个具体任务，代理则执行该任务并返回一个静态结果 [3, 4]。

  * **代理能力**：这个阶段的代理主要执行“生成内容”的任务，更偏向于生成式 AI (Generative AI) 的范畴，而非“采取行动”的代理式 AI (Agentic AI) [5]。它可以将文本、草图或截图转换为代码片段或设计稿 [6, 3]。
  * **人类角色**：开发者是创造者和指令发出者，对代理的每一步输出都有完全的控制权，并负责后续的审查、修改和集成工作。
  * **应用实例**：所有将设计稿转代码、根据描述生成 UI 组件的工具都属于此范畴。

### 第 2 级：个性化代理 (Personalization Agent) - 隐式交互

进入第二阶段，代理开始在**运行时**为最终用户服务，但它在后台工作，用户通常感知不到其存在。交互范式是**隐式的**：用户通过其自然的行为（如浏览、点击）与应用互动，代理则在后台观察这些行为，并自主决策如何动态调整界面以提供个性化体验 [7]。

  * **代理能力**：代理的核心能力是利用检索增强生成 (RAG) 等技术，结合用户的实时上下文（如行为历史、设备、地理位置）来动态组合预定义的 UI 组件 [7, 8]。它开始具备初步的决策能力，但行动范围被严格限制在“调整界面展现”上。
  * **人类角色**：用户是内容的消费者，其行为数据成为代理决策的输入。用户被动地接受代理提供的个性化界面。
  * **应用实例**：电商应用的“猜你喜欢”模块、新闻应用的信息流，这些界面的布局和内容由服务器端的代理根据用户画像实时组合并下发（通常需要 SDUI 架构支持）[9, 10]。

### 第 3 级：对话式代理 (Conversational Agent) - 协作式交互

在第三阶段，代理从幕后走向台前，成为用户可以直接与之沟通的伙伴。交互范式演变为**协作式的对话**：用户通过自然语言向代理下达一系列指令，代理不仅能理解，还能调用外部工具（API）来执行这些指令，并实时重构界面以展示结果 [11]。

  * **代理能力**：代理的关键能力是**工具使用 (Tool Use)** [11]。它能将用户的模糊指令分解为具体的 API 调用，获取数据并执行操作。UI 成为代理与用户之间多轮对话的可视化呈现。
  * **人类角色**：用户成为“指导者”，通过对话引导代理完成较为复杂的、需要多步操作的任务。人与代理形成了一种协作关系。
  * **应用实例**：在数据分析工具中，用户可以说“帮我找出上季度销售额最高的三个产品，并用柱状图展示”，代理会调用数据查询 API 并动态生成图表组件。

### 第 4 级：自主代理 (Autonomous Agent) - 委托式交互

在成熟度的顶峰，人机交互范式发生了终极转变。交互范式是**委托式的**：用户不再下达具体指令，而是设定一个高阶目标，并完全信任代理去自主完成 [5, 1]。

  * **代理能力**：代理具备了**规划 (Planning)、反思 (Reflection) 和多代理协作**等高级能力 [11]。它能将一个模糊的、宏大的目标自主分解为一系列可执行的子任务，选择并调用合适的工具，监控执行过程，处理异常，甚至在遇到困难时进行自我修正 [11, 1]。
  * **人类角色**：用户成为“委托人”或“监督者”。他们的主要工作是设定目标、定义约束（如预算、时间），并在关键节点进行审批或在代理无法解决问题时介入。
  * **应用实例**：用户对旅游 App 的代理说：“帮我整个团队（5人）预订下个月去北京的差旅，预算每人不超过 3000 元，确保往返都在工作日”。代理会自主完成机票比价、酒店预订、日程协调等所有任务。此时，传统的操作界面对人类用户而言已不再重要，它变成了代理执行任务的工作台。

### 成熟度光谱总览

| 维度 | 第 1 级：开发者代理 | 第 2 级：个性化代理 | 第 3 级：对话式代理 | 第 4 级：自主代理 |
|---|---|---|---|---|
| **核心交互范式** | **指令式 (Instructional)** | **隐式 (Implicit)** | **协作式 (Collaborative)** | **委托式 (Delegated)** |
| **人类角色** | 创造者 / 指令者 | 消费者 / 数据提供者 | 指导者 / 对话者 | 委托人 / 监督者 |
| **代理自主性** | 低：执行单次、明确的任务。 | 中：在预设规则内做实时决策。 | 高：理解多步指令并使用工具。 | 极高：自主规划并执行复杂目标。 |
| **代理核心能力** | 内容生成 | 检索增强 (RAG) | 工具使用 (Tool Use) | 规划、反思、多代理协作 |
| **UI 的作用** | 代理的静态输出物。 | 代理动态调整的画布。 | 人与代理的对话载体。 | 代理执行任务的工作台。 |
| **主要商业价值** | 提升开发效率，加速原型验证。 | 通过深度个性化提升用户参与度和转化率。 | 极大简化复杂工作流，提升操作效率。 | 端到端自动化复杂业务流程，创造巨大价值。 |
| **主要挑战** | 生成质量不可控，需人工审查 [6]。 | 架构改造（SDUI），数据隐私与实时性 [9, 12]。 | 对话上下文管理，意图理解模糊性。 | 安全性、对齐、信任、可解释性，以及用户技能退化风险 [5, 13]。 |

## 来源与相关内容

  * [10] [https://thebcms.com/blog/server-driven-ui-on-the-web-examples](https://thebcms.com/blog/server-driven-ui-on-the-web-examples)
  * [14] [https://vikasgoyal.github.io/genai/AdoptionMaturityModel.html](https://vikasgoyal.github.io/genai/AdoptionMaturityModel.html)
  * [11] [https://azure.microsoft.com/en-us/blog/agent-factory-the-new-era-of-agentic-ai-common-use-cases-and-design-patterns/](https://azure.microsoft.com/en-us/blog/agent-factory-the-new-era-of-agentic-ai-common-use-cases-and-design-patterns/)
  * [8] [https://azure.microsoft.com/en-us/blog/achieve-generative-ai-operational-excellence-with-the-llmops-maturity-model/](https://azure.microsoft.com/en-us/blog/achieve-generative-ai-operational-excellence-with-the-llmops-maturity-model/)
  * [11] [https://azure.microsoft.com/en-us/blog/agent-factory-the-new-era-of-agentic-ai-common-use-cases-and-design-patterns/](https://azure.microsoft.com/en-us/blog/agent-factory-the-new-era-of-agentic-ai-common-use-cases-and-design-patterns/)
  * [12] [https://uxdesign.cc/an-introduction-to-generative-uis-01dcf6bca808](https://uxdesign.cc/an-introduction-to-generative-uis-01dcf6bca808)
  * [8] [https://azure.microsoft.com/en-us/blog/achieve-generative-ai-operational-excellence-with-the-llmops-maturity-model/](https://azure.microsoft.com/en-us/blog/achieve-generative-ai-operational-excellence-with-the-llmops-maturity-model/)
  * [9] [https://craft.faire.com/transitioning-to-server-driven-ui-a76b216ed408](https://craft.faire.com/transitioning-to-server-driven-ui-a76b216ed408)
  * [13] [https://www.anthropic.com/research/agentic-misalignment](https://www.anthropic.com/research/agentic-misalignment)
  * [10] [https://thebcms.com/blog/server-driven-ui-on-the-web-examples](https://thebcms.com/blog/server-driven-ui-on-the-web-examples)
  * [15] [https://www.judo.app/blog/server-driven-ui](https://www.judo.app/blog/server-driven-ui)
  * [12] [https://uxdesign.cc/an-introduction-to-generative-uis-01dcf6bca808](https://uxdesign.cc/an-introduction-to-generative-uis-01dcf6bca808)
  * [16] [https://dr-arsanjani.medium.com/the-genai-maturity-model-a1a42f6f390b](https://dr-arsanjani.medium.com/the-genai-maturity-model-a1a42f6f390b)
  * [5] [https://cap.csail.mit.edu/agentic-ai-what-you-need-know-about-ai-agents](https://cap.csail.mit.edu/agentic-ai-what-you-need-know-about-ai-agents)
  * [17] [https://medium.com/@tech.rapipay/server-driven-ui-80ae85603747](https://medium.com/@tech.rapipay/server-driven-ui-80ae85603747)
  * [9] [https://craft.faire.com/transitioning-to-server-driven-ui-a76b216ed408](https://craft.faire.com/transitioning-to-server-driven-ui-a76b216ed408)
  * [5] [https://cap.csail.mit.edu/agentic-ai-what-you-need-know-about-ai-agents](https://cap.csail.mit.edu/agentic-ai-what-you-need-know-about-ai-agents)
  * [2] [https://www.ibm.com/think/insights/agentic-ai](https://www.ibm.com/think/insights/agentic-ai)
  * [14] [https://vikasgoyal.github.io/genai/AdoptionMaturityModel.html](https://vikasgoyal.github.io/genai/AdoptionMaturityModel.html)
  * [18] [https://www.youtube.com/watch?v=B7\_RcXqOOWM](https://www.youtube.com/watch?v=B7_RcXqOOWM)
  * [19] [https://ceur-ws.org/Vol-3925/paper17.pdf](https://ceur-ws.org/Vol-3925/paper17.pdf)
  * [20] [https://www.ijraset.com/research-paper/adaptive-user-interfaces-enhancing-user-experience-through-dynamic-interaction](https://www.ijraset.com/research-paper/adaptive-user-interfaces-enhancing-user-experience-through-dynamic-interaction)
  * [21] [https://interface.ai/blog/what-is-agentic-ai/](https://interface.ai/blog/what-is-agentic-ai/)
  * [22] [https://www.youtube.com/watch?v=kZ\_Ir0tnrWw](https://www.youtube.com/watch?v=kZ_Ir0tnrWw)
  * [23] [https://www.numberanalytics.com/blog/maturity-models-ui-ux-design](https://www.numberanalytics.com/blog/maturity-models-ui-ux-design)
  * [8] [https://azure.microsoft.com/en-us/blog/achieve-generative-ai-operational-excellence-with-the-llmops-maturity-model/](https://azure.microsoft.com/en-us/blog/achieve-generative-ai-operational-excellence-with-the-llmops-maturity-model/)
  * [21] [https://interface.ai/blog/what-is-agentic-ai/](https://interface.ai/blog/what-is-agentic-ai/)
  * [24] [https://journalwjaets.com/sites/default/files/fulltext\_pdf/WJAETS-2025-0538.pdf](https://journalwjaets.com/sites/default/files/fulltext_pdf/WJAETS-2025-0538.pdf)
  * [20] [https://www.ijraset.com/research-paper/adaptive-user-interfaces-enhancing-user-experience-through-dynamic-interaction](https://www.ijraset.com/research-paper/adaptive-user-interfaces-enhancing-user-experience-through-dynamic-interaction)
  * [7] [https://medium.com/@dfs.techblog/server-driven-ui-concept-db07d7946e94](https://medium.com/@dfs.techblog/server-driven-ui-concept-db07d7946e94)
  * [6] [https://www.banani.co/blog/ai-for-ui-design-and-wireframes](https://www.banani.co/blog/ai-for-ui-design-and-wireframes)
  * [25] [https://www.reddit.com/r/androiddev/comments/1ejngo9/server\_driven\_ui\_is\_this\_really\_worth\_it/](https://www.reddit.com/r/androiddev/comments/1ejngo9/server_driven_ui_is_this_really_worth_it/)
  * [1] [https://www.uipath.com/ai/agentic-ai](https://www.uipath.com/ai/agentic-ai)
  * [26] [https://www.engineegroup.com/articles/TCSIT-7-159.php](https://www.engineegroup.com/articles/TCSIT-7-159.php)
  * [27] [https://scispace.com/pdf/benefits-and-costs-of-adaptive-user-interfaces-2ccoqxfhef.pdf](https://scispace.com/pdf/benefits-and-costs-of-adaptive-user-interfaces-2ccoqxfhef.pdf)
  * [28] [https://www.visily.ai/](https://www.visily.ai/)
  * [29] [https://pmc.ncbi.nlm.nih.gov/articles/PMC7479802/](https://pmc.ncbi.nlm.nih.gov/articles/PMC7479802/)
  * [30] [https://uxpilot.ai/](https://uxpilot.ai/)
  * [3] [https://uizard.io/](https://uizard.io/)
  * [4] [https://www.visily.ai/ai-ui-design-generator/](https://www.visily.ai/ai-ui-design-generator/)
  * [31] [https://www.ibm.com/think/topics/agentic-architecture\#:\~:text=Agentic%20architecture%20is%20designed%20to,agents%20to%20make%20informed%20decisions](https://www.google.com/search?q=https://www.ibm.com/think/topics/agentic-architecture%23:~:text%3DAgentic%2520architecture%2520is%2520designed%2520to,agents%2520to%2520make%2520informed%2520decisions).
  * [32] [https://stitch.withgoogle.com/](https://stitch.withgoogle.com/)