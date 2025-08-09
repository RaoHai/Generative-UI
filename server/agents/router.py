from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse, JSONResponse

from .raw_web.agent import graph
from .models import ChatRequest, ChatResponse, ErrorResponse
from .langgraph_handler import LangGraphHandler

router = APIRouter(
    prefix="/api/agents",
    tags=["agents"],
    responses={404: {"description": "Not found"}},
)

# 初始化 LangGraph 处理器
raw_web_handler = LangGraphHandler(graph)


@router.post("/raw-web/stream")
async def raw_web_stream(request: ChatRequest):
    """流式聊天接口 - Server-Sent Events"""
    try:
        return StreamingResponse(
            raw_web_handler.stream(request),
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
