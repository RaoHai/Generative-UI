import asyncio
import json
import logging
from typing import AsyncIterator, Dict, Any, Union
from langchain_core.messages import BaseMessage, HumanMessage

from .models import ChatRequest, ChatResponse, StreamChunk, ChatMessage

# 设置日志
logger = logging.getLogger(__name__)


class LangGraphHandler:
    """LangGraph 处理器，用于标准化调用和响应处理"""

    def __init__(self, graph):
        """
        初始化处理器
        Args:
            graph: 编译后的 LangGraph 实例
        """
        self.graph = graph

    def _prepare_state(self, request: ChatRequest) -> Dict[str, Any]:
        """准备 LangGraph 状态"""
        # 转换消息格式
        messages = [msg.to_langchain_message() for msg in request.messages]

        # 构建初始状态
        state = {
            "messages": messages,
            "steps": [],
            "next_step": None
        }

        return state

    async def invoke(self, request: ChatRequest) -> ChatResponse:
        """同步调用 LangGraph"""
        try:
            state = self._prepare_state(request)
            result = await self.graph.ainvoke(state, config=request.config or {})

            # 提取最后的消息内容
            if result.get("messages"):
                last_message = result["messages"][-1]
                content = getattr(last_message, 'content', str(last_message))
            else:
                content = "No response generated"

            return ChatResponse(
                content=content,
                finish_reason="stop"
            )

        except Exception as e:
            raise Exception(f"LangGraph invocation failed: {str(e)}")

    async def stream(self, request: ChatRequest) -> AsyncIterator[str]:
        """流式调用 LangGraph"""
        try:
            state = self._prepare_state(request)

            # 发送开始标记
            start_chunk = StreamChunk(delta="🚀 开始处理请求...\n")
            yield f"data: {start_chunk.model_dump_json()}\n\n"

            # 记录调试信息
            logger.info(f"开始流式处理，初始状态: {list(state.keys())}")

            # 使用 astream 进行流式处理，获取每个节点的更新
            # stream_mode="updates" 可以获取每个节点执行后的状态变化
            async for chunk in self.graph.astream(state, config=request.config or {}, stream_mode="updates"):
                logger.debug(f"收到流式更新: {chunk}")

                formatted_chunk = await self._format_stream_chunk(chunk)
                if formatted_chunk:
                    yield formatted_chunk

                # 添加小延迟让用户能看到流式效果
                await asyncio.sleep(0.1)

            # 获取最终结果
            final_state = await self.graph.ainvoke(state, config=request.config or {})
            if final_state.get("messages"):
                last_message = final_state["messages"][-1]
                if hasattr(last_message, 'content') and last_message.content:
                    # 如果最终内容是HTML，发送预览
                    content = last_message.content
                    if content.strip().startswith('<'):
                        preview_chunk = StreamChunk(delta=f"\n📄 生成的HTML报告 ({len(content)} 字符)\n")
                        yield f"data: {preview_chunk.model_dump_json()}\n\n"

                        # 发送完整内容
                        content_chunk = StreamChunk(delta=content)
                        yield f"data: {content_chunk.model_dump_json()}\n\n"

            # 发送结束标记
            final_chunk = StreamChunk(delta="\n✅ 处理完成", finish_reason="stop")
            yield f"data: {final_chunk.model_dump_json()}\n\n"

        except Exception as e:
            logger.error(f"流式处理错误: {str(e)}")
            error_chunk = StreamChunk(delta=f"❌ 错误: {str(e)}", finish_reason="error")
            yield f"data: {error_chunk.model_dump_json()}\n\n"

    async def _format_stream_chunk(self, chunk: Dict[str, Any]) -> str:
        """格式化流式输出块"""
        try:
            # 根据 chunk 内容提取有用信息
            delta_content = ""

            if isinstance(chunk, dict):
                # 遍历每个节点的更新
                for node_name, node_data in chunk.items():
                    # 发送节点开始执行的信息
                    delta_content += f"\n🔄 执行节点: {node_name}\n"

                    if isinstance(node_data, dict):
                        # 处理消息更新
                        if "messages" in node_data:
                            messages = node_data["messages"]
                            if messages:
                                last_message = messages[-1]
                                if hasattr(last_message, 'content'):
                                    content = last_message.content
                                    # 如果是工具调用
                                    if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
                                        delta_content += f"🔧 调用工具: {[tc['name'] for tc in last_message.tool_calls]}\n"
                                    # 如果是普通消息内容
                                    elif content:
                                        # 截取内容的一部分进行流式输出
                                        preview = content[:200] + "..." if len(content) > 200 else content
                                        delta_content += f"💬 生成内容: {preview}\n"
                                elif hasattr(last_message, 'tool_call_id'):
                                    # 工具执行结果
                                    delta_content += f"✅ 工具执行完成\n"

                        # 处理步骤更新
                        if "steps" in node_data:
                            steps = node_data["steps"]
                            if steps:
                                delta_content += f"📋 当前步骤数: {len(steps)}\n"

                        # 处理下一步信息
                        if "next_step" in node_data:
                            next_step = node_data["next_step"]
                            if next_step:
                                delta_content += f"➡️ 下一步: {next_step}\n"

            if delta_content.strip():
                stream_chunk = StreamChunk(delta=delta_content)
                return f"data: {stream_chunk.model_dump_json()}\n\n"

            return None

        except Exception as e:
            error_chunk = StreamChunk(delta=f"❌ 格式化错误: {str(e)}\n")
            return f"data: {error_chunk.model_dump_json()}\n\n"