import logging
import uuid
import os
from datetime import datetime
from typing import AsyncIterator, Dict, Any, Union, Optional

from langchain_core.messages import BaseMessage, HumanMessage

from core.types.models import ChatRequest, ChatResponse, StreamChunk, ChatMessage, EventType, EventData, StreamEvent
from agents.state import AgentState

# 创建专门的事件日志器
event_logger = logging.getLogger(f"{__name__}.events")
event_logger.setLevel(logging.INFO)

# 为 event_logger 添加处理器（如果还没有的话）
if not event_logger.handlers:
    # 创建控制台处理器
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(console_formatter)
    event_logger.addHandler(console_handler)

    # 创建文件处理器
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    file_handler = logging.FileHandler(
        os.path.join(log_dir, 'langgraph_events.log'),
        encoding='utf-8'
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(console_formatter)
    event_logger.addHandler(file_handler)


class LangGraphEventProcessor:
    """LangGraph 事件处理器，用于过滤和格式化事件"""

    def __init__(self, debug_mode: bool = False):
        self.debug_mode = debug_mode

    def _should_forward_event(self, event: Dict[str, Any]) -> bool:
        """判断事件是否应该转发到前端"""
        event_type = event.get("event", "")
        event_name = event.get("name", "")

        # 始终转发的事件类型
        important_events = [
            "on_chat_model_stream",  # 聊天模型流式输出
            "on_tool_start",         # 工具开始
            "on_tool_end",           # 工具结束
            "on_chain_start",        # 链开始
            "on_chain_end",          # 链结束
        ]

        # 在调试模式下转发更多事件
        if self.debug_mode:
            debug_events = [
                "on_llm_start",
                "on_llm_end",
                "on_retriever_start",
                "on_retriever_end",
            ]
            important_events.extend(debug_events)

        return event_type in important_events

    def _format_event(self, raw_event: Dict[str, Any], run_id: str, thread_id: str) -> Optional[StreamEvent]:
        """将原始 LangGraph 事件格式化为标准事件"""
        event_type = raw_event.get("event", "")
        data = raw_event.get("data", {})
        name = raw_event.get("name", "")

        try:
            # 处理聊天模型流式输出
            if event_type == "on_chat_model_stream":
                chunk = data.get("chunk", {})
                content = ""

                # 处理不同的 chunk 格式
                if hasattr(chunk, 'content'):
                    content = chunk.content
                elif isinstance(chunk, dict):
                    content = chunk.get("content", "")
                elif isinstance(chunk, str):
                    content = chunk

                return StreamEvent(
                    event=EventData(
                        type=EventType.CHAT_TOKEN,
                        content=content,
                        metadata={"model": name}
                    ),
                    run_id=run_id,
                    thread_id=thread_id
                )

            # 处理工具调用
            elif event_type == "on_tool_start":
                return StreamEvent(
                    event=EventData(
                        type=EventType.TOOL_START,
                        tool_name=name,
                        metadata={"input": data.get("input", {})}
                    ),
                    run_id=run_id,
                    thread_id=thread_id
                )

            elif event_type == "on_tool_end":
                return StreamEvent(
                    event=EventData(
                        type=EventType.TOOL_END,
                        tool_name=name,
                        content=str(data.get("output", "")),
                        metadata={"duration": data.get("duration", 0)}
                    ),
                    run_id=run_id,
                    thread_id=thread_id
                )

            # 处理链/步骤事件
            elif event_type == "on_chain_start":
                return StreamEvent(
                    event=EventData(
                        type=EventType.STEP_START,
                        step_name=name,
                        metadata=data
                    ),
                    run_id=run_id,
                    thread_id=thread_id
                )

            elif event_type == "on_chain_end":
                return StreamEvent(
                    event=EventData(
                        type=EventType.STEP_END,
                        step_name=name,
                        metadata=data
                    ),
                    run_id=run_id,
                    thread_id=thread_id
                )

            # 调试模式下的其他事件
            elif self.debug_mode:
                return StreamEvent(
                    event=EventData(
                        type=EventType.DEBUG,
                        content=f"{event_type}: {name}",
                        metadata=data
                    ),
                    run_id=run_id,
                    thread_id=thread_id
                )

        except Exception as e:
            event_logger.error(f"Error formatting event: {e}")
            return StreamEvent(
                event=EventData(
                    type=EventType.ERROR,
                    content=f"Event processing error: {str(e)}"
                ),
                run_id=run_id,
                thread_id=thread_id
            )

        return None


class LangGraphHandler:
    """LangGraph 处理器，用于标准化调用和响应处理"""

    def __init__(self, graph, debug_mode: bool = False):
        """
        初始化处理器
        Args:
            graph: 编译后的 LangGraph 实例
            debug_mode: 是否启用调试模式
        """
        self.graph = graph
        self.event_processor = LangGraphEventProcessor(debug_mode)

    def _prepare_state(self, request: ChatRequest) -> AgentState:
        """准备 LangGraph 状态"""
        # 转换消息格式
        messages = [msg.to_langchain_message() for msg in request.messages]

        print(f"_prepare_state: {request}")
        # 构建初始状态
        state = AgentState(
            provider=request.provider,
            model=request.model,
            messages=messages,
            steps=[],
            next_step=None
        )

        return state

    async def stream(self, request: ChatRequest) -> AsyncIterator[str]:
        """流式调用 LangGraph - 优雅的事件处理"""
        try:
            state = self._prepare_state(request)

            # 生成运行 ID
            run_id = str(uuid.uuid4())
            thread_id = str(uuid.uuid4())

            # 准备配置
            config = request.config or {}
            config.update({
                "configurable": {
                    "thread_id": thread_id,
                    "checkpoint_ns": "",
                    "run_id": run_id,
                    **config.get("configurable", {})
                }
            })

            # 发送开始事件
            start_event = StreamEvent(
                event=EventData(
                    type=EventType.CHAT_START,
                    content="开始处理对话",
                    metadata={"messages_count": len(request.messages)}
                ),
                run_id=run_id,
                thread_id=thread_id
            )
            yield f"data: {start_event.model_dump_json()}\n\n"

            # 处理 LangGraph 事件流
            async for raw_event in self.graph.astream_events(state, config=config, version="v2"):
                # 记录原始事件到日志
                event_logger.info(f"Raw event: {raw_event}")

                # 过滤和格式化事件
                if self.event_processor._should_forward_event(raw_event):
                    formatted_event = self.event_processor._format_event(raw_event, run_id, thread_id)

                    if formatted_event:
                        # 使用 Server-Sent Events 格式
                        yield f"data: {formatted_event.model_dump_json()}\n\n"

            # 发送结束事件
            end_event = StreamEvent(
                event=EventData(
                    type=EventType.CHAT_END,
                    content="对话处理完成"
                ),
                run_id=run_id,
                thread_id=thread_id
            )
            yield f"data: {end_event.model_dump_json()}\n\n"

        except Exception as e:
            event_logger.error(f"Error in stream: {e}")

            # 发送错误事件
            error_event = StreamEvent(
                event=EventData(
                    type=EventType.ERROR,
                    content=f"处理过程中发生错误: {str(e)}"
                ),
                run_id=run_id if 'run_id' in locals() else str(uuid.uuid4()),
                thread_id=thread_id if 'thread_id' in locals() else str(uuid.uuid4())
            )
            yield f"data: {error_event.model_dump_json()}\n\n"
            raise e