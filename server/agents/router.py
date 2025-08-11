from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse, JSONResponse
from langgraph.graph.state import CompiledStateGraph

from core.types.models import (
    ChatRequest,
    ErrorResponse,
)
from llm import import_clients

from .raw_web.agent import graph as raw_web_graph
from .l0.enhanced_markdown.agent import graph as enhanced_markdown_graph
from .langgraph_handler import LangGraphHandler, OpenAICompatibleLangGraphHandler

router = APIRouter(
    prefix="/api/agents",
    tags=["agents"],
    responses={404: {"description": "Not found"}},
)

# 可用的代理映射
AVAILABLE_AGENTS = {
    "raw_web": raw_web_graph,
    "enhanced_markdown": enhanced_markdown_graph,
}

def get_agent(agent_name: str) -> CompiledStateGraph:
    """
    依赖注入函数：根据代理名称获取对应的 CompiledStateGraph
    """
    import_clients()
    if agent_name not in AVAILABLE_AGENTS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent '{agent_name}' not found. Available agents: {list(AVAILABLE_AGENTS.keys())}"
        )
    return AVAILABLE_AGENTS[agent_name]

def get_agent_from_query(agent_name: str = Query(..., description="代理名称")) -> CompiledStateGraph:
    """
    从查询参数获取代理
    """
    return get_agent(agent_name)

def get_agent_from_model_or_query(
    request: ChatRequest,
    agent_name: str = Query(None, description="代理名称，可选，如果不提供则从请求体或model字段解析")
) -> CompiledStateGraph:
    """
    从查询参数、请求体或模型名称获取代理
    优先级：查询参数 > 请求体agent_name > model字段解析
    """
    import_clients()

    # 优先使用查询参数中的agent_name
    if agent_name:
        target_agent_name = agent_name
    # 其次使用请求体中的agent_name
    elif request.agent_name:
        target_agent_name = request.agent_name
    else:
        # 最后从模型名称中提取代理名称
        if ":" in request.model:
            target_agent_name, model_name = request.model.split(":", 1)
            # 更新请求中的模型名称
            request.model = model_name
        else:
            # 默认使用第一个可用的代理
            target_agent_name = list(AVAILABLE_AGENTS.keys())[0] if AVAILABLE_AGENTS else "raw_web"

    if target_agent_name not in AVAILABLE_AGENTS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent '{target_agent_name}' not found. Available agents: {list(AVAILABLE_AGENTS.keys())}"
        )

    return AVAILABLE_AGENTS[target_agent_name]

@router.post("/stream/{agent_name}")
async def agent_stream(request: ChatRequest, agent: Annotated[CompiledStateGraph, Depends(get_agent)]):
    """原有的流式端点"""
    print(f"agent: {agent}")

    try:
        # 为注入的代理创建处理器
        handler = LangGraphHandler(agent)
        return StreamingResponse(
            handler.stream(request),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=ErrorResponse(error="Stream processing failed", detail=str(e)).model_dump()
        )

@router.post("/v1/chat/completions")
async def openai_chat_completions(
    request: ChatRequest,
    agent: Annotated[CompiledStateGraph, Depends(get_agent_from_model_or_query)]
):
    """OpenAI 兼容的 /v1/chat/completions 端点"""
    print(f"agent: {agent}")

    try:
        # 创建 OpenAI 兼容的处理器
        handler = OpenAICompatibleLangGraphHandler(agent)

        return StreamingResponse(
            handler.stream(request),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            }
        )

    except Exception as e:
        # 返回 OpenAI 格式的错误响应
        error_response = {
            "error": {
                "message": str(e),
                "type": "server_error",
                "code": None
            }
        }
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=error_response
        )
