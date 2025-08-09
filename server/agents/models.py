from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from enum import Enum
from datetime import datetime

class ChatMessage(BaseModel):
    role: str  # "user", "assistant", "system"
    content: str

    def to_langchain_message(self) -> BaseMessage:
        """转换为 LangChain 消息格式"""
        if self.role == "user":
            return HumanMessage(content=self.content)
        elif self.role == "assistant":
            return AIMessage(content=self.content)
        elif self.role == "system":
            return SystemMessage(content=self.content)
        else:
            return HumanMessage(content=self.content)

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    stream: Optional[bool] = True
    config: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    content: str
    role: str = "assistant"
    finish_reason: Optional[str] = None

class StreamChunk(BaseModel):
    delta: Optional[str] = None
    finish_reason: Optional[str] = None

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None

class EventType(str, Enum):
    """LangGraph 事件类型枚举"""
    CHAT_START = "chat_start"
    CHAT_TOKEN = "chat_token"
    CHAT_END = "chat_end"
    TOOL_START = "tool_start"
    TOOL_END = "tool_end"
    STEP_START = "step_start"
    STEP_END = "step_end"
    ERROR = "error"
    DEBUG = "debug"

class EventData(BaseModel):
    """标准化事件数据结构"""
    type: EventType
    content: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    step_name: Optional[str] = None
    tool_name: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())

class StreamEvent(BaseModel):
    """流式事件包装器"""
    event: EventData
    run_id: str
    thread_id: str