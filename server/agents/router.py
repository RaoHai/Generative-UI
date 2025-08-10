from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse, JSONResponse
from langgraph.graph.state import CompiledStateGraph

from core.types.models import ChatRequest, ErrorResponse
from llm import import_clients

from .raw_web.agent import graph as raw_web_graph
from .l0.enhanced_markdown.agent import graph as enhanced_markdown_graph
from .langgraph_handler import LangGraphHandler

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
    import_clients()
    """
    依赖注入函数：根据代理名称获取对应的 CompiledStateGraph
    """
    if agent_name not in AVAILABLE_AGENTS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent '{agent_name}' not found. Available agents: {list(AVAILABLE_AGENTS.keys())}"
        )
    return AVAILABLE_AGENTS[agent_name]

@router.post("/stream/{agent_name}")
async def agent_stream(request: ChatRequest, agent: Annotated[CompiledStateGraph | None, Depends(get_agent)]):
    print(f"agent: {agent}")
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent '{request.agent_name}' not found. Available agents: {list(AVAILABLE_AGENTS.keys())}"
        )

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
