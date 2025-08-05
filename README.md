# Generative-UI

基于 LangGraph 的生成式 UI 演示项目

## 安装依赖

这个项目使用 Poetry 作为依赖管理工具。

### 1. 安装 Poetry

如果还没有安装 Poetry，请先安装：

```bash
curl -sSL https://install.python-poetry.org | python3 -
```

### 2. 安装项目依赖

```bash
poetry install
```

### 3. 运行开发服务器

```bash
source .venv/bin/activate
langgraph dev
```

或者先进入 Poetry 的虚拟环境：

```bash
poetry shell
dev
```

## 项目配置

- Python 版本要求：>=3.12,<3.13
- 主要依赖：uvicorn、langchain 系列、langgraph、fastapi 等
- 开发脚本：`dev` 指向 `agents.raw-web:main`

## 项目结构

```
Generative-UI/
├── agents/
│   └── raw-web/
│       └── agent.py
├── langgraph.json
├── pyproject.toml
└── README.md
```
